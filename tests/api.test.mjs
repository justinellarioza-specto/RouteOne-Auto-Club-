// API tests: start the real server on a spare port with a throwaway data folder, then call every endpoint.
// Run with: npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PORT = 4000 + Math.floor(Math.random() * 1000);
const BASE = `http://127.0.0.1:${PORT}`;
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'routeone-test-'));
fs.copyFileSync(path.join('data', 'customers.json'), path.join(dataDir, 'customers.json'));
let server;
let ADMIN; // session tokens shared by the tests (logging in repeatedly would hit the login rate limit)
let MEMBER;

const api = (p, { method = 'GET', body, token, headers = {} } = {}) =>
  fetch(BASE + p, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
const json = async (res) => res.json();
const login = async (login, password) => (await json(await api('/api/auth/login', { method: 'POST', body: { login, password } }))).token;
const futureDate = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

before(async () => {
  server = spawn(process.execPath, ['--import', 'tsx', 'server.ts'], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'test', DATA_DIR: dataDir },
    stdio: 'ignore',
  });
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(BASE + '/api/health')).ok) {
        ADMIN = await login('admin', 'admin');
        MEMBER = await login('user', 'user');
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error('Server did not start');
});
after(() => {
  server?.kill();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

// ---------------- Dataset 1: products ----------------
test('GET /api/vehicles returns the full car list', async () => {
  const body = await json(await api('/api/vehicles'));
  assert.equal(body.data.length, 32);
  for (const key of ['id', 'name', 'marque', 'category', 'image', 'price']) assert.ok(key in body.data[0], `missing ${key}`);
});

test('GET /api/vehicles/:id returns one car, unknown id is 404', async () => {
  assert.equal((await api('/api/vehicles/r1-concept')).status, 200);
  assert.equal((await api('/api/vehicles/does-not-exist')).status, 404);
});

test('GET /api/experiences returns services', async () => {
  const body = await json(await api('/api/experiences'));
  assert.ok((body.data || body).length >= 4);
});

// ---------------- Dataset 2: customers and privacy ----------------
test('public GET /api/customers is masked', async () => {
  const body = await json(await api('/api/customers'));
  assert.equal(body.access, 'public-masked');
  for (const r of body.data) {
    assert.match(r.email, /•••@/);
    assert.equal(r.message, undefined);
  }
});

test('reading one customer by email needs a login', async () => {
  assert.equal((await api('/api/customers?email=user@routeone.club')).status, 401);
});

// ---------------- Login ----------------
test('wrong password and partial names are rejected', async () => {
  assert.equal((await api('/api/auth/login', { method: 'POST', body: { login: 'admin', password: 'nope' } })).status, 401);
  assert.equal((await api('/api/auth/login', { method: 'POST', body: { login: 'a', password: 'a' } })).status, 401);
});

test('admin sees full customer records', async () => {
  const body = await json(await api('/api/customers', { token: ADMIN }));
  assert.equal(body.access, 'full');
  assert.ok(body.data.some((r) => r.email === 'user@routeone.club'));
});

test('a member sees only their own bookings', async () => {
  assert.equal((await api('/api/customers?email=user@routeone.club', { token: MEMBER })).status, 200);
  assert.equal((await api('/api/customers?email=j.vane@apex-capital.demo', { token: MEMBER })).status, 403);
});

test('a forged token gets no access', async () => {
  const body = await json(await api('/api/customers', { token: 'forged-token' }));
  assert.equal(body.access, 'public-masked');
  assert.equal((await api('/api/auth/me', { token: 'forged-token' })).status, 401);
});

// ---------------- Status changes ----------------
test('status changes need the right permissions', async () => {
  const member = MEMBER;
  const admin = ADMIN;
  assert.equal((await api('/api/inquiries/101', { method: 'PATCH', body: { status: 'Confirmed' } })).status, 401);
  assert.equal((await api('/api/inquiries/101', { method: 'PATCH', body: { status: 'Cancelled' }, token: member })).status, 403);
  assert.equal((await api('/api/inquiries/101', { method: 'PATCH', body: { status: 'Bogus' }, token: admin })).status, 400);
  assert.equal((await api('/api/inquiries/1', { method: 'PATCH', body: { status: 'Confirmed' }, token: admin })).status, 404);
  const ok = await api('/api/inquiries/101', { method: 'PATCH', body: { status: 'In Review' }, token: admin });
  assert.equal(ok.status, 200);
  assert.equal((await json(ok)).record.status, 'In Review');
});

test('a member can cancel their own open request', async () => {
  const member = MEMBER;
  const res = await api('/api/inquiries/1790006400002', { method: 'PATCH', body: { status: 'Cancelled' }, token: member });
  assert.equal(res.status, 200);
});

// ---------------- Fleet availability ----------------
test('only admins can change a car’s availability, and it shows publicly', async () => {
  const member = MEMBER;
  const admin = ADMIN;
  const path = '/api/vehicles/r1-concept/availability';
  assert.equal((await api(path, { method: 'PATCH', body: { status: 'In Private Collection' }, token: member })).status, 403);
  assert.equal((await api(path, { method: 'PATCH', body: { status: 'In Private Collection' }, token: admin })).status, 200);
  const avail = await json(await api('/api/vehicles/availability'));
  assert.equal(avail.availability['r1-concept'].status, 'In Private Collection');
});

// ---------------- Sign up ----------------
test('sign up checks the password, blocks duplicates, and the new account can log in', async () => {
  const short = await api('/api/auth/signup', { method: 'POST', body: { name: 'Test Driver', login: 'tester@example.com', password: 'short' } });
  assert.equal(short.status, 400);
  const ok = await api('/api/auth/signup', { method: 'POST', body: { name: 'Test Driver', login: 'tester@example.com', password: 'track-day-2026' } });
  assert.equal(ok.status, 201);
  const dup = await api('/api/auth/signup', { method: 'POST', body: { name: 'Test Driver', login: 'tester@example.com', password: 'track-day-2026' } });
  assert.equal(dup.status, 409);
  const token = await login('tester@example.com', 'track-day-2026');
  assert.ok(token);
  assert.equal((await json(await api('/api/auth/me', { token }))).user.email, 'tester@example.com');
  await api('/api/auth/logout', { method: 'POST', token });
  assert.equal((await api('/api/auth/me', { token })).status, 401);
  const saved = JSON.parse(fs.readFileSync(path.join(dataDir, 'accounts.json'), 'utf-8'));
  assert.ok(saved[0].hash && !JSON.stringify(saved).includes('track-day-2026'), 'password must be stored hashed');
});

// ---------------- Inquiry form ----------------
test('the inquiry form is validated on the server', async () => {
  const bad = await api('/api/inquiries', { method: 'POST', body: { name: 'J', email: 'not-an-email', date: '2020-01-01' } });
  assert.equal(bad.status, 400);
  const { errors } = await json(bad);
  assert.ok(errors.name && errors.email && errors.date);
});

test('a valid inquiry is saved with its campaign source', async () => {
  const res = await api('/api/inquiries', {
    method: 'POST',
    body: { name: 'Ana Reyes', email: 'ana@example.com', date: futureDate(30), message: 'Track day', channel: 'instagram' },
  });
  assert.equal(res.status, 201);
  const { record } = await json(res);
  assert.equal(record.channel, 'instagram');
  assert.equal(record.status, 'Inquiry');
});

test('an unknown campaign source is stored as website', async () => {
  const res = await api('/api/inquiries', { method: 'POST', body: { name: 'Ben Cruz', email: 'ben@example.com', channel: 'spam' } });
  assert.equal((await json(res)).record.channel, 'website');
});

test('oversized requests are refused', async () => {
  const res = await api('/api/inquiries', { method: 'POST', body: JSON.stringify({ name: 'x'.repeat(30000) }) });
  assert.equal(res.status, 413);
});

// ---------------- Security basics ----------------
test('security headers are set and the server is not advertised', async () => {
  const res = await api('/api/health');
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.equal(res.headers.get('x-powered-by'), null);
});

test('unknown API routes return a JSON 404', async () => {
  const res = await api('/api/architecture/systems-integration');
  assert.equal(res.status, 404);
  assert.equal((await json(res)).error, 'Not found.');
});

test('too many inquiries in a minute are rate limited', async () => {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    codes.push((await api('/api/inquiries', { method: 'POST', body: { name: 'Rate Test', email: `r${i}@example.com` } })).status);
  }
  assert.ok(codes.includes(429), `expected a 429, got ${codes.join(',')}`);
});

test('too many login attempts are rate limited', async () => {
  const codes = [];
  for (let i = 0; i < 6; i++) {
    codes.push((await api('/api/auth/login', { method: 'POST', body: { login: 'admin', password: `guess-${i}` } })).status);
  }
  assert.ok(codes.includes(429), `expected a 429, got ${codes.join(',')}`);
});
