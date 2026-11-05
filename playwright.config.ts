import type { BrowserContextOptions, LaunchOptions } from 'playwright';
import { config } from './config/config';

export const playwrightConfig: {
  launchOptions: LaunchOptions;
  contextOptions: BrowserContextOptions;
} = {
  launchOptions: {
    headless: config.headless,
  },
  contextOptions: {
    baseURL: config.baseUrl,
  },
};