// Step definitions connect readable Gherkin steps to reusable page-object behavior.
import { Given, Then, When } from '@cucumber/cucumber';
import { config } from '../config/config';
import { ScenarioWorld } from '../hooks/hooks';

Given('I navigate to the login page', async function (this: ScenarioWorld) {
  await this.loginPage.navigateToLoginPage();
});

When('I enter valid username and password', async function (this: ScenarioWorld) {
  await this.loginPage.enterUsername(config.username);
  await this.loginPage.enterPassword(config.password);
});

When('I enter invalid username and password', async function (this: ScenarioWorld) {
  await this.loginPage.enterUsername(config.invalidUsername);
  await this.loginPage.enterPassword(config.invalidPassword);
});

When('I click the login button', async function (this: ScenarioWorld) {
  await this.loginPage.clickLogin();
});

Then('I should be successfully logged in', async function (this: ScenarioWorld) {
  await this.loginPage.verifySuccessfulLogin();
});

Then('I should see a login error', async function (this: ScenarioWorld) {
  await this.loginPage.verifyLoginError();
});
