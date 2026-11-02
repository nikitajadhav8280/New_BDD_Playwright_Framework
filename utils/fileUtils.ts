// Small filesystem helpers keep screenshot naming and directory creation reusable.
import { mkdirSync } from 'node:fs';
import path from 'node:path';

export function createFailureScreenshotPath(scenarioName: string): string {
  const screenshotsDirectory = path.resolve(__dirname, '..', 'screenshots');
  mkdirSync(screenshotsDirectory, { recursive: true });

  const safeScenarioName = scenarioName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  return path.join(screenshotsDirectory, `${Date.now()}-${safeScenarioName || 'scenario'}.png`);
}
