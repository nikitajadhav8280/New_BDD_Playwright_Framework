// This adapter shares Playwright library settings without using the Playwright Test runner.
import type { BrowserContextOptions, LaunchOptions } from 'playwright';
import { config } from './config/config';

export const playwrightConfig: {
  launchOptions: LaunchOptions;
  contextOptions: BrowserContextOptions;
} = {
  launchOptions: {
    headless: true,
  },
  contextOptions: {
    baseURL: config.baseUrl,
  },
};
