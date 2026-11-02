// Environment-specific values stay outside the test and page-object code.
import dotenv from 'dotenv';
import path from 'node:path';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface FrameworkConfig {
  environment: string;
  baseUrl: string;
  browser: BrowserName;
  headless: boolean;
  timeout: number;
  username: string;
  password: string;
  invalidUsername: string;
  invalidPassword: string;
}

const environment = process.env.TEST_ENV ?? 'qa';
if (!/^[a-zA-Z0-9_-]+$/.test(environment)) {
  throw new Error(`Invalid TEST_ENV "${environment}". Use only letters, numbers, "_" or "-".`);
}

const environmentFile = path.resolve(__dirname, `.env.${environment}`);
const dotenvResult = dotenv.config({ path: environmentFile });
if (dotenvResult.error) {
  throw new Error(`Could not load environment file "${environmentFile}": ${dotenvResult.error.message}`);
}

function requiredValue(name: string): string {
  // Windows defines USERNAME for the signed-in OS account; prefer the selected env file
  // unless the test runner explicitly supplies APP_USERNAME.
  const configuredValue = name === 'USERNAME'
    ? process.env.APP_USERNAME ?? dotenvResult.parsed?.USERNAME ?? process.env.USERNAME
    : process.env[name];
  const value = configuredValue?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable "${name}" in ${environmentFile}.`);
  }
  return value;
}

function parseBoolean(name: string, value: string): boolean {
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  throw new Error(`Environment variable "${name}" must be "true" or "false".`);
}

function parsePositiveInteger(name: string, value: string): number {
  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`Environment variable "${name}" must be a positive integer.`);
  }
  return parsedValue;
}

function isBrowserName(value: string): value is BrowserName {
  return value === 'chromium' || value === 'firefox' || value === 'webkit';
}

//const browserValue = process.env.BROWSER ?? 'chromium';
const browserValue = (process.env.BROWSER ?? 'chromium').trim().toLowerCase();
if (!isBrowserName(browserValue)) {
  throw new Error(`Unsupported BROWSER "${browserValue}". Use chromium, firefox, or webkit.`);
}

export const config: FrameworkConfig = {
  environment,
  baseUrl: requiredValue('BASE_URL'),
  browser: browserValue,
  headless: parseBoolean('HEADLESS', process.env.HEADLESS ?? 'true'),
  timeout: parsePositiveInteger('TIMEOUT', process.env.TIMEOUT ?? '30000'),
  username: requiredValue('USERNAME'),
  password: requiredValue('PASSWORD'),
  invalidUsername: requiredValue('INVALID_USERNAME'),
  invalidPassword: requiredValue('INVALID_PASSWORD'),
};
