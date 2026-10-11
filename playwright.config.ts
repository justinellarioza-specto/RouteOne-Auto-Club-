import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Throwaway copy of the data so browser tests never change your real files
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'routeone-e2e-'));
fs.copyFileSync(path.join('data', 'customers.json'), path.join(dataDir, 'customers.json'));

const PORT = 4321;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    // Optional: use an already-installed Chromium (set PW_CHROMIUM_PATH)
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && node dist/server.cjs',
    url: `http://localhost:${PORT}/api/health`,
    timeout: 180_000,
    reuseExistingServer: false,
    env: { PORT: String(PORT), DATA_DIR: dataDir },
  },
});
