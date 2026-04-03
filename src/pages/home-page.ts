import { expect, type Locator, type Page } from '@playwright/test';

import { config } from '../support/config';
import { BasePage } from './base-page';
import { locateWithFallback } from '../utils/selector-utils';
import type { NavigationMenu } from '../utils/navigation-fixture';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/');
    const searchInputPromise = locateWithFallback(this.page, {
      role: 'textbox',
      name: /search products, savings, or recipes/i,
      css: 'input[type="search"], input[placeholder*="Search"]'
    })
      .then(async (input) => {
        await expect(input).toBeVisible({ timeout: config.actionTimeoutMs });
        return true;
      })
      .catch(() => false);

    const quickLinksPromise = this.page
      .locator('body')
      .getByText(/BOGOs|Weekly Ad|Order ahead/i)
      .first()
      .isVisible()
      .catch(() => false);

    const [searchInputReady, quickLinksReady] = await Promise.all([
      searchInputPromise,
      quickLinksPromise
    ]);

    if (!searchInputReady && !quickLinksReady) {
      throw new Error(
        'Homepage did not reach a stable interactive state (search input or quick links).'
      );
    }
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Publix/i);
    await expect(this.page.locator('body')).toContainText(/Publix/i);
  }

  async expectClubPopupCopy(): Promise<void> {
    const popup = await this.clubPopupContainer();
    await expect(popup.getByText(/join the club\./i)).toBeVisible({
      timeout: config.actionTimeoutMs
    });
    await expect(
      popup.getByText(/get \$5 off your next purchase of \$20\+\.\*/i)
    ).toBeVisible({ timeout: config.actionTimeoutMs });
    await expect(
      popup.getByText(
        /\*terms, conditions & restrictions apply\. must sign up by 12\/31\/2026\./i
      )
    ).toBeVisible({ timeout: config.actionTimeoutMs });
  }

  async expectClubPopupActionButtons(
    firstButtonLabel: string,
    secondButtonLabel: string
  ): Promise<void> {
    const popup = await this.clubPopupContainer();
    await this.expectPopupActionVisible(popup, firstButtonLabel);
    await this.expectPopupActionVisible(popup, secondButtonLabel);
  }

  private async clubPopupContainer(): Promise<Locator> {
    const popup = this.page
      .locator('section, div, aside, article')
      .filter({ hasText: /join the club\./i })
      .first();
    await expect(popup).toBeVisible({ timeout: config.actionTimeoutMs });
    return popup;
  }

  private async expectPopupActionVisible(
    popup: Locator,
    buttonLabel: string
  ): Promise<void> {
    const escaped = buttonLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const name = new RegExp(`^${escaped}$`, 'i');

    const roleButton = popup.getByRole('button', { name }).first();
    if ((await roleButton.count()) > 0) {
      await expect(roleButton).toBeVisible({ timeout: config.actionTimeoutMs });
      return;
    }

    await expect(popup.getByRole('link', { name }).first()).toBeVisible({
      timeout: config.actionTimeoutMs
    });
  }

  async dismissOneTrustIfPresent(): Promise<void> {
    const button = this.page.getByRole('button', { name: /accept/i });
    if ((await button.count()) > 0) {
      await button
        .first()
        .click()
        .catch(() => undefined);
    }
  }

  async search(term: string): Promise<void> {
    const desktopInput = await locateWithFallback(this.page, {
      role: 'textbox',
      name: /search products, savings, or recipes/i,
      css: 'input[type="search"], input[placeholder*="Search"]'
    });

    await desktopInput.fill(term);
    await desktopInput.press('Enter');
    await this.waitForStable();
  }

  async openMenu(menu: NavigationMenu): Promise<void> {
    const candidate: {
      testId?: string;
      role: 'button';
      name: RegExp;
      css?: string;
    } = {
      role: 'button',
      name: new RegExp(`^${menu.triggerLabel}$`, 'i')
    };

    if (menu.fallbackTriggerId) {
      candidate.testId = menu.fallbackTriggerId;
      candidate.css = `#${menu.fallbackTriggerId}`;
    }

    const trigger = await locateWithFallback(this.page, candidate);

    await trigger.hover().catch(() => undefined);
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }

  async menuItemLink(
    menu: NavigationMenu,
    itemLabel: string
  ): Promise<Locator> {
    const regex = new RegExp(
      `^${itemLabel.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}$`,
      'i'
    );
    await this.openMenu(menu);

    const link = this.page.getByRole('link', { name: regex }).first();
    await expect(link).toBeVisible({ timeout: config.actionTimeoutMs });
    return link;
  }
}
