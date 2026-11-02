# Playwright + TypeScript + Cucumber BDD Framework

This project runs Cucumber scenarios against SauceDemo using Playwright as the browser automation library. Cucumber—not the Playwright Test runner—discovers and executes the scenarios.

## A. Project architecture

```text
playwright-bdd-framework/
├── features/                 Gherkin feature files
├── step-definitions/         TypeScript implementations of Gherkin steps
├── pages/                    Page Object Model classes and UI interactions
├── hooks/                    Cucumber World and per-scenario browser lifecycle
├── config/                   Environment-aware configuration and env files
├── test-runner/              Cucumber CLI launcher and report options
├── utils/                    Reusable file helpers
├── reports/                  Generated Cucumber reports
├── screenshots/              Screenshots saved for failed scenarios
├── playwright.config.ts       Playwright library settings used by the hooks
├── cucumber.js                Cucumber CLI defaults and TypeScript support
├── tsconfig.json              TypeScript compiler settings
└── package.json               Dependencies and npm commands
```

The feature file uses **Gherkin**, a readable Given/When/Then syntax for describing behavior. **Step definitions** bind each Gherkin sentence to TypeScript. The **Page Object Model** keeps selectors and UI interactions in `LoginPage`, rather than duplicating them in steps.

Each Cucumber scenario gets a fresh **BrowserContext** (isolated cookies and session) and a **Page** (browser tab). The **Browser** is launched in a Cucumber `Before` hook and all resources are closed in `After`. Failed scenarios save a PNG in `screenshots/` and attach the image to the Cucumber report.

## B. Installation

From this project directory:

```bash
npm install
```

## C. Install Playwright browsers

Install Chromium, used by default:

```bash
npx playwright install chromium
```

To use Firefox or WebKit, install them as well:

```bash
npx playwright install firefox webkit
```

## D. Configure environments

The default environment is `qa`, read from `config/.env.qa`. The included QA file contains the public SauceDemo test credentials. `config/.env.uat` is an example and must be updated for your UAT application. Do not put private credentials in source control; local `.env.*` files are ignored by Git.

Configuration variables:

| Variable | Purpose |
|---|---|
| `BASE_URL` | Application base URL |
| `USERNAME`, `PASSWORD` | Valid login credentials |
| `INVALID_USERNAME`, `INVALID_PASSWORD` | Credentials for the invalid-login scenario |
| `BROWSER` | `chromium`, `firefox`, or `webkit` |
| `HEADLESS` | `true` or `false` |
| `TIMEOUT` | Playwright/Cucumber timeout in milliseconds |

On Windows, `USERNAME` is also an operating-system variable. The selected `.env` file's `USERNAME` is used by default; set `APP_USERNAME` when you need to override it explicitly.

Select an environment using `TEST_ENV=qa` or `TEST_ENV=uat`. For example, in PowerShell:

```powershell
$env:TEST_ENV = "uat"
npm run test:bdd
```

In macOS/Linux shells:

```bash
TEST_ENV=uat npm run test:bdd
```

## E. Run all BDD tests

```bash
npm run test:bdd
```

Cucumber reads all matching `features/**/*.feature` files. A failed scenario does not stop the remaining scenarios unless Cucumber is explicitly run with a fail-fast option.

## F. Run a specific feature

```bash
npx cucumber-js features/login.feature
```

## G. Run a specific tag or scenario

Run the smoke scenario:

```bash
npx cucumber-js --tags "@smoke"
```

Run the regression scenario:

```bash
npx cucumber-js --tags "@regression"
```

Or select a scenario by its name:

```bash
npx cucumber-js --name "Successful login with valid credentials"
```

## H. Run in headed mode

```bash
npm run test:bdd:headed
```

To run a subset headed, set `HEADLESS=false` in the selected environment file, or set it in the current shell before using the direct Cucumber command with the desired tag/name.

## I. Generate the HTML report

```bash
npm run test:bdd:html
```

The command writes `reports/cucumber-report.html` and `reports/cucumber-report.json`. The HTML report shows features, scenarios, steps, pass/fail states, durations, failure details, and attached failure screenshots.

## J. Failure screenshots

The `After` hook checks the scenario result. When a scenario fails, it saves a full-page PNG under `screenshots/` and attaches the image as `image/png` to the Cucumber report. Cucumber also records the original step error and marks the scenario failed. Browser resources are closed even if screenshot capture fails.

## K. End-to-end execution flow

The `cucumber.js` file loads TypeScript through `ts-node/register`, hooks, and step definitions. The feature describes behavior; Cucumber matches each sentence to a step definition; the step delegates to `LoginPage`; that page object uses Playwright's `Page` API to drive the selected browser and application. Cucumber records results and attachments in its report.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

The `test-runner/runner.ts` launcher invokes the Cucumber CLI programmatically as a child process. This keeps Cucumber as the BDD runner and uses Playwright only for browser automation.

## Verify the TypeScript

```bash
npm run typecheck
```
