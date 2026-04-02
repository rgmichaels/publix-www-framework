import { expect, type Locator, type Page } from '@playwright/test';

import { config } from '../support/config';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(pathname = ''): Promise<void> {
    const destination = pathname
      ? new URL(pathname, `${config.baseUrl}/`).toString()
      : config.baseUrl;

    await this.page.goto(destination, {
      waitUntil: 'domcontentloaded',
      timeout: config.navigationTimeoutMs
    });
    await this.waitForStable();
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
