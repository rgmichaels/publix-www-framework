import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page
} from '@playwright/test';

import { config } from './config';

export class BrowserSessionManager {
  private static browserPromise: Promise<Browser> | undefined;

  static async startBrowser(): Promise<Browser> {
    if (!BrowserSessionManager.browserPromise) {
      BrowserSessionManager.browserPromise = chromium.launch({
        headless: config.headless
      });
    }

    return BrowserSessionManager.browserPromise;
  }

  static async stopBrowser(): Promise<void> {
    if (!BrowserSessionManager.browserPromise) {
      return;
    }

    const browser = await BrowserSessionManager.browserPromise;
    await browser.close();
    BrowserSessionManager.browserPromise = undefined;
  }

  static async newContextAndPage(): Promise<{
    context: BrowserContext;
    page: Page;
  }> {
    const browser = await BrowserSessionManager.startBrowser();
    const context = await browser.newContext({
      baseURL: config.baseUrl,
      locale: config.locale,
      ignoreHTTPSErrors: false,
      viewport: { width: 1440, height: 1000 }
    });

    context.setDefaultTimeout(config.defaultTimeoutMs);
    context.setDefaultNavigationTimeout(config.navigationTimeoutMs);

    const page = await context.newPage();
    page.setDefaultTimeout(config.defaultTimeoutMs);
    page.setDefaultNavigationTimeout(config.navigationTimeoutMs);

    return { context, page };
  }
}
