// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'https://thenail.vn';
const isLocal = BASE_URL.includes('127.0.0.1') || BASE_URL.includes('localhost');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30000,
  expect: { timeout: 10000 },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: isLocal
    ? {
        command: 'python3 -m http.server 8899 --bind 127.0.0.1',
        url: 'http://127.0.0.1:8899',
        reuseExistingServer: true,
        timeout: 15000,
      }
    : undefined,
});
