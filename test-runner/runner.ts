// The runner launches Cucumber CLI; Playwright is only the browser automation library.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '..');
const cucumberCli = path.join(projectRoot, 'node_modules', '@cucumber', 'cucumber', 'bin', 'cucumber.js');

if (!existsSync(cucumberCli)) {
  throw new Error(`Cucumber CLI was not found at "${cucumberCli}". Run npm install first.`);
}

const userArguments = process.argv.slice(2);
const headed = userArguments.includes('--headed');
const html = userArguments.includes('--html');
const cucumberArguments = userArguments.filter((argument) => argument !== '--headed' && argument !== '--html');

if (html) {
  cucumberArguments.push(
    '--format',
    'json:reports/cucumber-report.json',
    '--format',
    'html:reports/cucumber-report.html',
  );
}

const result = spawnSync(
  process.execPath,
  [cucumberCli, ...cucumberArguments],
  {
    cwd: projectRoot,
    env: { ...process.env, ...(headed ? { HEADLESS: 'false' } : {}) },
    stdio: 'inherit',
  },
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
