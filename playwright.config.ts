import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const testEnv = process.env.TEST_ENV || 'int';
dotenv.config({ path: `.env.${testEnv}` });
dotenv.config({ path: '.env', override: false });
dotenv.config({ path: '.env.local', override: true });

const baseURL = process.env.BASE_URL || 'https://evolvetest.elsevier.com/';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: 'test-results',
});
