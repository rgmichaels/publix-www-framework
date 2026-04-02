import { expect, type Locator, type Page } from '@playwright/test';

import { config } from '../support/config';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(pathname = ''): Promise<void> {
    const destination = pathname
      ? new URL(pathname, `${config.baseUrl}/`).toString()
      : config.baseUrl;

    const attempts = config.ci ? 3 : 2;
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        await this.page.goto(destination, {
          waitUntil: 'commit',
          timeout: config.navigationTimeoutMs
        });
        await this.waitForStable();
        return;
      } catch (error) {
        lastError = error;
        if (attempt === attempts) {
          break;
        }

        await this.page.waitForTimeout(1_500 * attempt);
      }
    }

    throw lastError;
  }

  async waitForStable(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  async clickSafe(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
    await locator.click({ timeout: config.actionTimeoutMs });
  }
}
