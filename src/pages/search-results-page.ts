import { expect, type Page } from '@playwright/test';

import { BasePage } from './base-page';
import { escapeForRegex } from '../utils/selector-utils';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectResultsFor(term: string): Promise<void> {
    const escapedTerm = escapeForRegex(term);
    const encodedTermPattern = escapeForRegex(encodeURIComponent(term));

    await expect(this.page).toHaveURL(
      new RegExp(`(/search|searchtermredirect=${encodedTermPattern})`, 'i')
    );
    await expect(this.page.locator('body')).toContainText(
      new RegExp(escapedTerm, 'i')
    );

    const resultCards = this.page.locator(
      '[data-qa-automation*="product"], [class*="product-card"], article, li'
    );
    await expect(resultCards.first()).toBeVisible();
  }

  async expectUrlContains(value: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(value, 'i'));
  }
}
