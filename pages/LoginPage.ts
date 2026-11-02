// The Page Object Model keeps selectors and UI interactions out of step definitions.
import assert from 'node:assert/strict';
import type { Page } from 'playwright';

export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly pageTitle;
  private readonly errorMessage;

  constructor(private readonly page: Page) {
    // A Playwright Page represents one browser tab and provides its locators/actions.
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.pageTitle = page.locator('[data-test="title"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto('/');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.page.waitForURL(/inventory\.html$/);
    await this.pageTitle.waitFor({ state: 'visible' });
    assert.equal((await this.pageTitle.textContent())?.trim(), 'Products');
  }

  async verifyLoginError(): Promise<void> {
    await this.errorMessage.waitFor({ state: 'visible' });
    assert.ok((await this.errorMessage.textContent())?.trim(), 'Expected a visible login error message.');
  }
}
