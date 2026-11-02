// Cucumber hooks manage one Browser, BrowserContext, and Page per scenario.
import { After, Before, Status, World, setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';
import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from 'playwright';
import { config } from '../config/config';
import { playwrightConfig } from '../playwright.config';
import { createFailureScreenshotPath } from '../utils/fileUtils';
import { LoginPage } from '../pages/LoginPage';

export class ScenarioWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage!: LoginPage;
}

setWorldConstructor(ScenarioWorld);
setDefaultTimeout(config.timeout);

const browserTypes = { chromium, firefox, webkit };

Before(async function (this: ScenarioWorld) {
  // Browser is the automation process; BrowserContext isolates scenario state and cookies.
  this.browser = await browserTypes[config.browser].launch(playwrightConfig.launchOptions);
  this.context = await this.browser.newContext(playwrightConfig.contextOptions);
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.timeout);
  this.page.setDefaultNavigationTimeout(config.timeout);
  this.loginPage = new LoginPage(this.page);
});

After(async function (this: ScenarioWorld, { pickle, result }) {
  try {
    if (result?.status === Status.FAILED && this.page) {
      const screenshotPath = createFailureScreenshotPath(pickle.name);
      const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });
      await this.attach(screenshot, 'image/png');
      console.error(`Failure screenshot saved to ${screenshotPath}`);
    }
  } finally {
    // Nested finally blocks ensure all resources are closed even if one close operation fails.
    try {
      await this.page?.waitForTimeout(2000);
      await this.page?.close();
    } finally {
      try {
        await this.context?.close();
      } finally {
        await this.browser?.close();
      }
    }
  }
});
