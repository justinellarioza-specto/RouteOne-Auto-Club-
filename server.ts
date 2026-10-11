import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

interface CustomerInquiryRecord {
  id: number;
  name: string;
  email: string;
  preferredExperience: string;
  vehicleInterest: string;
  date: string;
  status: string;
  location: string;
  source?: 'web-client' | 'legacy-import' | 'cots-crm';
  channel?: string;
  updatedAt?: string;
  createdAt?: string;
  subject?: string;
  message?: string;
}

// Hosts like Render set PORT themselves; 3000 is the local default
const PORT = Number(process.env.PORT) || 3000;

// ------------------------------------------------------------------
// Security helpers
// ------------------------------------------------------------------
const INQUIRY_STATUSES = ['Inquiry', 'In Review', 'Confirmed', 'Completed', 'Cancelled'];
const CHANNELS = ['website', 'email', 'instagram', 'facebook', 'tiktok', 'youtube'];
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

type Role = 'member' | 'admin';
interface Account {
  login: string; // lower-case login id or email
  name: string;
  email: string;
  role: Role;
  profileId: string; // matches a profile in the front end
  salt: string;
  hash: string;
}
interface Session {
  login: string;
  role: Role;
  email: string;
  expires: number;
}

function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  return { salt, hash: crypto.scryptSync(password, salt, 32).toString('hex') };
}
function passwordMatches(password: string, account: Account) {
  const { hash } = hashPassword(password, account.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(account.hash, 'hex'));
}
function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
/** "Julian Vane" -> "Julian V." and "j.vane@apex.demo" -> "j•••@apex.demo" for public views */
function maskRecord(r: CustomerInquiryRecord) {
  const [first, ...rest] = String(r.name || '').split(' ');
  const last = rest.length ? ` ${rest[rest.length - 1].charAt(0)}.` : '';
  const [user, domain] = String(r.email || '').split('@');
  return {
    id: r.id,
    name: `${first}${last}`,
    email: domain ? `${user.charAt(0)}•••@${domain}` : '•••',
    preferredExperience: r.preferredExperience,
    vehicleInterest: r.vehicleInterest,
    date: r.date,
    status: r.status,
    location: r.location,
    channel: r.channel || 'website',
    createdAt: r.createdAt,
  };
}

/** Small in-memory rate limiter: at most `max` hits per `windowMs` per visitor */
function rateLimit(max: number, windowMs: number, message: string) {
  const hits = new Map<string, number[]>();
  return (req: Request, res: Response, next: () => void) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      res.setHeader('Retry-After', String(Math.ceil(windowMs / 1000)));
      return res.status(429).json({ error: message });
    }
    recent.push(now);
    hits.set(key, recent);
    next();
  };
}

async function startServer() {
  const app = express();

  // Middleware for body parsing and logging
  app.disable('x-powered-by'); // don't advertise the server software
  app.set('trust proxy', 1); // Render sits behind a proxy; needed for per-visitor rate limits
  app.use(express.json({ limit: '20kb' })); // forms are small; reject oversized bodies
  app.use(express.urlencoded({ extended: false, limit: '20kb' }));

  // Standard security headers
  const isProduction = process.env.NODE_ENV === 'production';
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (isProduction) {
      // Dev mode is skipped because Vite's live reload needs inline scripts
      res.setHeader(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          "media-src 'self'",
          "connect-src 'self'",
          "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
        ].join('; ')
      );
      res.setHeader('Strict-Transport-Security', 'max-age=15552000');
    }
    next();
  });

  // Private data folder: never served to the browser
  // DATA_DIR lets the automated tests use a throwaway folder instead of your real data
  const privateDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(process.cwd(), 'data');
  if (!fs.existsSync(privateDir)) fs.mkdirSync(privateDir, { recursive: true });
  const privateCustomersPath = path.join(privateDir, 'customers.json');
  const accountsPath = path.join(privateDir, 'accounts.json');

  // Load In-Memory Data from public/data with resilience
  const publicDir = path.join(process.cwd(), 'public', 'data');
  
  let vehiclesCache: any[] = [];
  let experiencesCache: any[] = [];
  let customersCache: CustomerInquiryRecord[] = [];

  try {
    const vPath = path.join(publicDir, 'vehicles.json');
    if (fs.existsSync(vPath)) {
      vehiclesCache = JSON.parse(fs.readFileSync(vPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading vehicles.json:', err);
  }

  try {
    const ePath = path.join(publicDir, 'experiences.json');
    if (fs.existsSync(ePath)) {
      experiencesCache = JSON.parse(fs.readFileSync(ePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading experiences.json:', err);
  }

  // Customer records live in data/customers.json (private). The public folder only gets a masked copy.
  try {
    const seedPath = fs.existsSync(privateCustomersPath) ? privateCustomersPath : path.join(publicDir, 'customers.json');
    if (fs.existsSync(seedPath)) {
      customersCache = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading customers.json:', err);
  }

  const saveCustomers = () => {
    try {
      fs.writeFileSync(privateCustomersPath, JSON.stringify(customersCache, null, 2), 'utf-8');
      // Masked copy keeps the static (no-server) version of the site working without exposing anyone
      if (process.env.NODE_ENV !== 'test' && !process.env.DATA_DIR) fs.writeFileSync(path.join(publicDir, 'customers.json'), JSON.stringify(customersCache.map(maskRecord), null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not save customers:', e);
    }
  };
  saveCustomers();

  // ---------------- Accounts & sessions ----------------
  const accounts = new Map<string, Account>();
  const addAccount = (a: Omit<Account, 'salt' | 'hash'>, password: string) => {
    accounts.set(a.login, { ...a, ...hashPassword(password) });
  };
  // Demo accounts shown on the login screen
  addAccount({ login: 'user', name: 'Member User', email: 'user@routeone.club', role: 'member', profileId: 'user' }, 'user');
  addAccount({ login: 'admin', name: 'Marcus Vance', email: 'director@routeone.club', role: 'admin', profileId: 'admin' }, 'admin');
  // Accounts people created with Sign up (stored hashed, never in the public folder)
  try {
    if (fs.existsSync(accountsPath)) {
      (JSON.parse(fs.readFileSync(accountsPath, 'utf-8')) as Account[]).forEach((a) => accounts.set(a.login, a));
    }
  } catch (err) {
    console.warn('Could not load accounts:', err);
  }
  const saveAccounts = () => {
    try {
      const custom = [...accounts.values()].filter((a) => a.login !== 'user' && a.login !== 'admin');
      fs.writeFileSync(accountsPath, JSON.stringify(custom, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not save accounts:', e);
    }
  };
  const findAccount = (loginOrEmail: string) => {
    const q = loginOrEmail.trim().toLowerCase();
    return accounts.get(q) || [...accounts.values()].find((a) => a.email.toLowerCase() === q);
  };

  const sessions = new Map<string, Session>();
  const SESSION_MS = 8 * 60 * 60 * 1000;
  const startSession = (a: Account) => {
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { login: a.login, role: a.role, email: a.email, expires: Date.now() + SESSION_MS });
    return token;
  };
  const getSession = (req: Request): Session | null => {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const session = token ? sessions.get(token) : undefined;
    if (!session) return null;
    if (session.expires < Date.now()) {
      sessions.delete(token);
      return null;
    }
    return session;
  };
  const publicUser = (a: Account) => ({ login: a.login, name: a.name, email: a.email, role: a.role, profileId: a.profileId });

  // Request counter & audit tracking
  let totalApiRequests = 0;
  const dataFlowLogs: Array<{
    id: string;
    timestamp: string;
    source: string;
    target: string;
    action: string;
    latencyMs: number;
    status: 'SUCCESS' | 'RECONCILED' | 'CACHED';
  }> = [];

  const logDataFlow = (source: string, target: string, action: string, latencyMs: number, status: 'SUCCESS' | 'RECONCILED' | 'CACHED' = 'SUCCESS') => {
    dataFlowLogs.unshift({
      id: `DF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      source,
      target,
      action,
      latencyMs,
      status,
    });
    if (dataFlowLogs.length > 50) dataFlowLogs.pop();
  };

  // ==========================================
  // API ROUTES (Before Vite middleware)
  // ==========================================

  // Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    totalApiRequests++;
    res.json({
      status: 'healthy',
      service: 'RouteOne Integrated Application Server',
      timestamp: new Date().toISOString(),
      port: PORT,
      architecture: 'Express-Vite-Fullstack',
    });
  });

  // 1. DATA ACCESS & STORAGE: Vehicles Endpoint (DAL Layer)
  app.get('/api/vehicles', (req: Request, res: Response) => {
    totalApiRequests++;
    const startTime = Date.now();
    const category = req.query.category as string;
    const powertrain = req.query.powertrain as string;

    let result = vehiclesCache;
    if (category && category !== 'ALL') {
      result = result.filter(
        (v) => v.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (powertrain && powertrain !== 'ALL') {
      result = result.filter(
        (v) => v.powertrain?.toLowerCase() === powertrain.toLowerCase()
      );
    }

    const elapsed = Math.max(1, Date.now() - startTime);
    logDataFlow('Client Interface', 'Application Server (DAL)', 'GET /api/vehicles', elapsed, 'CACHED');

    res.json({
      source: 'DAL_DATABASE_CACHE',
      count: result.length,
      latencyMs: elapsed,
      data: result,
    });
  });

  // Live Vehicle Availability & Real-Time Reservation Allocation Status
  // Admin-set availability per car (Fleet tab), saved privately
  const FLEET_STATUSES = ['Currently Available', 'In Private Collection'];
  const fleetPath = path.join(privateDir, 'fleet-status.json');
  let fleetOverrides: Record<string, string> = {};
  try {
    if (fs.existsSync(fleetPath)) fleetOverrides = JSON.parse(fs.readFileSync(fleetPath, 'utf-8'));
  } catch (err) {
    console.warn('Could not load fleet status:', err);
  }

  app.get(['/api/vehicles/availability', '/api/reservations/availability'], (_req: Request, res: Response) => {
    totalApiRequests++;
    const startTime = Date.now();

    // Map active reservations from customersCache
    const reservationsByVehicle = new Map<string, number>();
    customersCache.forEach((inquiry) => {
      const target = (inquiry.vehicleInterest || '').toLowerCase();
      vehiclesCache.forEach((v) => {
        if (
          target.includes(v.id.toLowerCase()) ||
          target.includes(v.name.toLowerCase()) ||
          v.name.toLowerCase().includes(target)
        ) {
          reservationsByVehicle.set(v.id, (reservationsByVehicle.get(v.id) || 0) + 1);
        }
      });
    });

    // Specific curated specimens designated as held in private collection / syndicate vaults
    const privateCollectionSet = new Set([
      'mclaren-mp4-4',
      'ferrari-f2004',
      'williams-fw14b',
      'ferrari-250-gto',
      'mclaren-f1',
      'bugatti-chiron',
      'koenigsegg-jesko',
      'pagani-huayra-r',
      'aston-martin-valkyrie-amr',
      'lamborghini-aventador-svj',
      'ferrari-sf24',
    ]);

    const availabilityMap: Record<string, any> = {};
    let countAvailable = 0;
    let countPrivate = 0;

    const vaultLocations = [
      'Geneva Private Vault',
      'Zurich Collector Syndicate',
      'Monaco Member Vault',
      'Silverstone Heritage Wing',
      'Alpine Private Garage',
      'Milan FIA Reserve',
    ];

    vehiclesCache.forEach((vehicle, idx) => {
      const activeRes = reservationsByVehicle.get(vehicle.id) || 0;
      const isDesignatedPrivate = privateCollectionSet.has(vehicle.id);
      
      // If designated private or has 2+ active inquiries/reservations, in private collection
      const isInPrivateCollection = isDesignatedPrivate || activeRes >= 2;
      // An admin's choice in the Fleet tab wins over the automatic rule
      const status = fleetOverrides[vehicle.id] || (isInPrivateCollection ? 'In Private Collection' : 'Currently Available');

      if (status === 'Currently Available') {
        countAvailable++;
      } else {
        countPrivate++;
      }

      let urgencyLabel = '';
      let availableSlots = 0;
      let vaultLocation: string | undefined = undefined;

      if (status === 'Currently Available') {
        const slots = activeRes > 0 ? 1 : ((idx % 3) === 0 ? 1 : 2);
        availableSlots = slots;
        urgencyLabel = slots === 1 
          ? 'Only 1 Track Allocation Left' 
          : '2 Track Allocations Open';
      } else {
        availableSlots = 0;
        vaultLocation = vaultLocations[idx % vaultLocations.length];
        urgencyLabel = 'Allocated: Private Vault';
      }

      availabilityMap[vehicle.id] = {
        vehicleId: vehicle.id,
        status,
        urgencyLabel,
        activeReservationsCount: activeRes,
        availableSlots,
        vaultLocation,
        lastUpdated: new Date().toISOString(),
      };
    });

    const elapsed = Math.max(1, Date.now() - startTime);
    logDataFlow('Client Interface', 'Reservation Engine', 'GET /api/vehicles/availability', elapsed);

    res.json({
      source: 'LIVE_RESERVATION_ALLOCATION_MATRIX',
      lastSync: new Date().toISOString(),
      summary: {
        total: vehiclesCache.length,
        currentlyAvailable: countAvailable,
        inPrivateCollection: countPrivate,
      },
      availability: availabilityMap,
    });
  });

  // Single Vehicle Details
  app.get('/api/vehicles/:id', (req: Request, res: Response) => {
    totalApiRequests++;
    const startTime = Date.now();
    const id = req.params.id;
    const vehicle = vehiclesCache.find((v) => v.id === id);

    const elapsed = Math.max(1, Date.now() - startTime);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    logDataFlow('Client Interface', 'Database Storage', `GET /api/vehicles/${id}`, elapsed);
    res.json({ source: 'DATABASE_SPEC_STORE', data: vehicle });
  });

  // 1. DATA ACCESS & STORAGE: Circuit Experiences
  app.get('/api/experiences', (_req: Request, res: Response) => {
    totalApiRequests++;
    const startTime = Date.now();
    const elapsed = Math.max(1, Date.now() - startTime);
    logDataFlow('Client Interface', 'Application Server (DAL)', 'GET /api/experiences', elapsed, 'CACHED');

    res.json({
      source: 'DAL_EXPERIENCES_STORE',
      count: experiencesCache.length,
      data: experiencesCache,
    });
  });

  // ---------------- Authentication ----------------
  const authLimiter = rateLimit(10, 5 * 60 * 1000, 'Too many login attempts. Wait a few minutes and try again.');

  app.post('/api/auth/login', authLimiter, (req: Request, res: Response) => {
    const login = clean(req.body?.login, 120);
    const password = typeof req.body?.password === 'string' ? req.body.password.slice(0, 200) : '';
    const account = login && password ? findAccount(login) : undefined;
    if (!account || !passwordMatches(password, account)) {
      return res.status(401).json({ error: 'Wrong login ID or password.' });
    }
    res.json({ token: startSession(account), user: publicUser(account) });
  });

  app.post('/api/auth/signup', authLimiter, (req: Request, res: Response) => {
    const name = clean(req.body?.name, 60);
    const login = clean(req.body?.login, 120).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = 'Enter your full name.';
    if (!/^[a-z0-9._@+-]{3,120}$/.test(login)) errors.login = 'Use 3 or more letters, numbers, dots or an email address.';
    if (login.includes('@') && !EMAIL_RE.test(login)) errors.login = 'Enter a valid email address.';
    if (password.length < 8 || password.length > 200) errors.password = 'Use at least 8 characters for your password.';
    if (Object.keys(errors).length) return res.status(400).json({ error: Object.values(errors)[0], errors });
    if (findAccount(login)) return res.status(409).json({ error: 'That login ID or email is already registered. Log in instead.' });
    const email = login.includes('@') ? login : `${login}@members.routeone.club`;
    addAccount({ login, name, email, role: 'member', profileId: `R1-${login.replace(/[^a-z0-9]/g, '').slice(0, 10).toUpperCase()}` }, password);
    saveAccounts();
    const account = accounts.get(login)!;
    res.status(201).json({ token: startSession(account), user: publicUser(account) });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const session = getSession(req);
    const account = session ? accounts.get(session.login) : undefined;
    if (!account) return res.status(401).json({ error: 'Not logged in.' });
    res.json({ user: publicUser(account) });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const header = req.get('authorization') || '';
    if (header.startsWith('Bearer ')) sessions.delete(header.slice(7));
    res.json({ success: true });
  });

  // ---------------- Fleet availability (admin) ----------------
  app.patch('/api/vehicles/:id/availability', (req: Request, res: Response) => {
    totalApiRequests++;
    const session = getSession(req);
    if (!session) return res.status(401).json({ error: 'Log in as admin to change availability.' });
    if (session.role !== 'admin') return res.status(403).json({ error: 'Only admins can change availability.' });
    const id = String(req.params.id);
    const status = req.body?.status;
    if (!vehiclesCache.some((v) => v.id === id)) return res.status(404).json({ error: `Car ${id} was not found.` });
    if (!FLEET_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${FLEET_STATUSES.join(', ')}` });
    }
    fleetOverrides[id] = status;
    try {
      fs.writeFileSync(fleetPath, JSON.stringify(fleetOverrides, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not save fleet status:', e);
    }
    logDataFlow('Admin Console', 'Fleet Storage', `PATCH /api/vehicles/${id}/availability`, 2, 'SUCCESS');
    res.json({ success: true, vehicleId: id, status });
  });

  // ---------------- Dataset 2: customer information ----------------
  // Admin: full records. Member: only their own (?email=). Public: masked records for the API showcase.
  app.get('/api/customers', (req: Request, res: Response) => {
    totalApiRequests++;
    const session = getSession(req);
    const email = typeof req.query.email === 'string' ? req.query.email.trim().toLowerCase() : '';

    if (email) {
      if (!session) return res.status(401).json({ error: 'Log in to see your bookings.' });
      if (session.role !== 'admin' && session.email.toLowerCase() !== email) {
        return res.status(403).json({ error: 'You can only see your own bookings.' });
      }
      const data = customersCache.filter((c) => String(c.email).toLowerCase() === email);
      return res.json({ source: 'DATABASE_CRM_STORAGE', count: data.length, data });
    }

    if (session?.role === 'admin') {
      logDataFlow('Admin Console', 'CRM Storage Engine', 'GET /api/customers', 1);
      return res.json({ source: 'DATABASE_CRM_STORAGE', access: 'full', count: customersCache.length, data: customersCache });
    }

    logDataFlow('Client Interface', 'CRM Storage Engine', 'GET /api/customers (masked)', 1);
    res.json({
      source: 'DATABASE_CRM_STORAGE',
      access: 'public-masked',
      note: 'Names and emails are partly hidden. Log in as admin for full records.',
      count: customersCache.length,
      data: customersCache.map(maskRecord),
    });
  });

  // Change an inquiry's status. Admin: any status. Member: cancel their own open request.
  app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
    totalApiRequests++;
    const session = getSession(req);
    if (!session) return res.status(401).json({ error: 'Log in to change a booking.' });
    const id = Number(req.params.id);
    const status = req.body?.status;
    if (!INQUIRY_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${INQUIRY_STATUSES.join(', ')}` });
    }
    const record = customersCache.find((c) => Number(c.id) === id);
    if (!record) return res.status(404).json({ error: `Inquiry ${req.params.id} was not found.` });

    if (session.role !== 'admin') {
      const own = String(record.email).toLowerCase() === session.email.toLowerCase();
      const cancellable = status === 'Cancelled' && (record.status === 'Inquiry' || record.status === 'In Review');
      if (!own || !cancellable) {
        return res.status(403).json({ error: 'You can only cancel your own open requests.' });
      }
    }

    record.status = status;
    record.updatedAt = new Date().toISOString();
    saveCustomers();
    logDataFlow(session.role === 'admin' ? 'Admin Console' : 'Member Portal', 'CRM Storage Engine', `PATCH /api/inquiries/${id}`, 2, 'SUCCESS');
    res.json({ success: true, record });
  });

  // Save a request from the contact or booking form (checked on the server, not just in the browser)
  const inquiryLimiter = rateLimit(5, 60 * 1000, 'Too many requests sent. Wait a minute and try again.');
  app.post('/api/inquiries', inquiryLimiter, (req: Request, res: Response) => {
    totalApiRequests++;
    const startTime = Date.now();
    const body = req.body || {};
    const name = clean(body.name, 80);
    const email = clean(body.email, 190).toLowerCase();
    const preferredExperience = clean(body.preferredExperience, 80);
    const vehicleInterest = clean(body.vehicleInterest, 120);
    const subject = clean(body.subject, 120);
    const message = clean(body.message, 2000);
    const location = clean(body.location, 120);
    const date = clean(body.date, 10);
    const channelRaw = clean(body.channel, 20).toLowerCase();

    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = 'Enter your name.';
    if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
    if (date) {
      const picked = new Date(`${date}T00:00:00Z`);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const limit = new Date(today);
      limit.setUTCFullYear(limit.getUTCFullYear() + 2);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(picked.getTime())) errors.date = 'Pick a valid date.';
      else if (picked < today) errors.date = 'Pick a date from today onward.';
      else if (picked > limit) errors.date = 'Pick a date within the next two years.';
    }
    if (typeof body.message === 'string' && body.message.length > 2000) errors.message = 'Keep your message under 2,000 characters.';
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: Object.values(errors)[0], errors });
    }

    const newInquiry: CustomerInquiryRecord = {
      id: Date.now(),
      name,
      email,
      preferredExperience: preferredExperience || 'Track Experience',
      vehicleInterest: vehicleInterest || 'RouteOne R1 Concept',
      date: date || new Date().toISOString().split('T')[0],
      status: 'Inquiry',
      location: location || 'Silverstone GP Proving Ground',
      source: 'web-client',
      channel: CHANNELS.includes(channelRaw) ? channelRaw : 'website',
      createdAt: new Date().toISOString(),
      ...(subject ? { subject } : {}),
      ...(message ? { message } : {}),
    };

    customersCache.unshift(newInquiry);
    saveCustomers();

    const elapsed = Math.max(2, Date.now() - startTime);
    logDataFlow('Client Form', 'API Gateway', 'POST /api/inquiries', 3);
    logDataFlow('API Gateway', 'Database Storage', 'INSERT customer_inquiries', elapsed, 'SUCCESS');

    res.status(201).json({ success: true, message: 'Inquiry received.', record: newInquiry });
  });

  // Unknown API routes return JSON 404 instead of the web page
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found.' });
  });

  // Serve public directory statically with Range support for video/audio streaming
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV === 'test') {
    // Automated tests: API only, no web page build
  } else if (process.env.NODE_ENV !== 'production') {
    // Dev only: load Vite lazily so the production server never needs it
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RouteOne Architecture Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
