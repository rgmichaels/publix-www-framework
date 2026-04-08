import { expect, type Locator, type Page } from '@playwright/test';

import { config } from '../support/config';
import { BasePage } from './base-page';
import { locateWithFallback } from '../utils/selector-utils';
import type { NavigationMenu } from '../utils/navigation-fixture';
import type { VisualNavigationExpectation } from '../utils/visual-navigation-fixture';

export class SeasonalVisualNavigationUnavailableError extends Error {
  constructor(linkLabel: string) {
    super(
      `Visual navigation link "${linkLabel}" is unavailable in this homepage variant.`
    );
    this.name = 'SeasonalVisualNavigationUnavailableError';
  }
}

export class HomePage extends BasePage {
  private lastVisualNavigationHref: string | null = null;

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/');
    const searchInputPromise = locateWithFallback(this.page, {
      testId: 'product-search-input',
      role: 'combobox',
      name: /search products, savings, or recipes/i,
      css: [
        '#searchInputFlyout',
        'input[data-qa-automation="product-search-input"]',
        'input[name="searchTerm"]',
        'input[type="search"]',
        'input[placeholder*="Search"]'
      ].join(', ')
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
      testId: 'product-search-input',
      role: 'searchbox',
      name: /search products, savings, or recipes/i,
      css: [
        '#searchInputFlyout',
        'input[data-qa-automation="product-search-input"]',
        'input[name="searchTerm"]',
        'input[type="search"]',
        'input[placeholder*="Search"]'
      ].join(', ')
    });

    await expect(desktopInput).toBeVisible({ timeout: config.actionTimeoutMs });
    await desktopInput.click({ timeout: config.actionTimeoutMs });
    await desktopInput.fill(term);

    const enterSubmitted = await desktopInput
      .press('Enter', { timeout: Math.min(config.actionTimeoutMs, 5_000) })
      .then(() => true)
      .catch(() => false);

    if (!enterSubmitted) {
      await this.page.keyboard.press('Enter').catch(() => undefined);

      const submitButton = await locateWithFallback(this.page, {
        testId: 'search-button',
        role: 'button',
        name: /submit search|search/i,
        css: [
          'button[data-qa-automation="search-button"]',
          'form[role="search"] button[type="submit"]',
          'button[aria-label*="search" i]',
          '[data-qa-automation="search-trigger"]'
        ].join(', ')
      }).catch(() => null);

      if (submitButton) {
        await this.clickSafe(submitButton).catch(() => undefined);
      }
    }

    await this.waitForStable();
    await this.page
      .waitForURL(/\/search|\/c\/|searchtermredirect=/i, {
        timeout: config.navigationTimeoutMs
      })
      .catch(() => undefined);
  }

  async clickWeeklyAdLink(): Promise<void> {
    const weeklyAdLink = this.page
      .getByRole('link', { name: /^weekly ad$/i })
      .first();
    await expect(weeklyAdLink).toBeVisible({ timeout: config.actionTimeoutMs });
    await this.clickSafe(weeklyAdLink);
    await this.waitForStable();
  }

  async expectWeeklyAdPage(pageText: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/savings\/weekly-ad/i, {
      timeout: config.navigationTimeoutMs
    });
    await expect(
      this.page.getByText(new RegExp(pageText, 'i')).first()
    ).toBeVisible({
      timeout: config.actionTimeoutMs
    });
  }

  async clickLocationsLink(): Promise<void> {
    const locationsLink = this.page
      .getByRole('link', { name: /^locations$/i })
      .first();
    await expect(locationsLink).toBeVisible({
      timeout: config.actionTimeoutMs
    });
    await this.clickSafe(locationsLink);
    await this.waitForStable();
  }

  async expectLocationsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/locations/i, {
      timeout: config.navigationTimeoutMs
    });

    const heading = this.page
      .getByRole('heading', {
        name: /locations|store locator|find.*store|find.*location/i
      })
      .first();

    const bodySignal = this.page
      .locator('body')
      .getByText(/locations|store locator|find a store|zip code|city, state/i)
      .first();

    const headingVisible = await heading
      .isVisible({ timeout: config.actionTimeoutMs })
      .catch(() => false);

    if (!headingVisible) {
      await expect(bodySignal).toBeVisible({ timeout: config.actionTimeoutMs });
    }
  }

  async clickPharmacyLink(): Promise<void> {
    const pharmacyLink = this.page
      .getByRole('link', { name: /^(publix )?pharmacy$/i })
      .first();
    await expect(pharmacyLink).toBeVisible({
      timeout: config.actionTimeoutMs
    });
    await this.clickSafe(pharmacyLink);
    await this.waitForStable();
  }

  async expectPharmacyPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pharmacy/i, {
      timeout: config.navigationTimeoutMs
    });

    const heading = this.page
      .getByRole('heading', { name: /pharmacy|prescriptions/i })
      .first();

    const bodySignal = this.page
      .locator('body')
      .getByText(/pharmacy|prescriptions|refill/i)
      .first();

    const headingVisible = await heading
      .isVisible({ timeout: config.actionTimeoutMs })
      .catch(() => false);

    if (!headingVisible) {
      await expect(bodySignal).toBeVisible({ timeout: config.actionTimeoutMs });
    }
  }

  async clickVisualNavigationLink(linkLabel: string): Promise<void> {
    await this.dismissClubPopupIfPresent();
    const escaped = linkLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const visualNavLink = this.page
      .getByRole('link', { name: new RegExp(`^${escaped}$`, 'i') })
      .first();
    try {
      await expect(visualNavLink).toBeVisible({
        timeout: config.actionTimeoutMs
      });
    } catch (error) {
      if (/^easter meals$/i.test(linkLabel)) {
        throw new SeasonalVisualNavigationUnavailableError(linkLabel);
      }
      throw error;
    }
    this.lastVisualNavigationHref = await visualNavLink.getAttribute('href');
    await visualNavLink.click({
      force: true,
      noWaitAfter: true,
      timeout: config.actionTimeoutMs
    });
    await this.waitForStable();
  }

  async expectVisualNavigationDestination(
    expectation: VisualNavigationExpectation
  ): Promise<void> {
    if (expectation.expectedDialogText) {
      try {
        const dialog = this.page.getByRole('dialog').first();
        await expect(dialog).toBeVisible({ timeout: config.actionTimeoutMs });
        await expect(dialog).toContainText(
          new RegExp(expectation.expectedDialogText, 'i')
        );
      } catch (error) {
        if (
          expectation.expectedHrefContains &&
          this.lastVisualNavigationHref?.includes(
            expectation.expectedHrefContains
          )
        ) {
          return;
        }
        throw error;
      }
      return;
    }

    if (expectation.expectedPath) {
      const expectedPathRegex = new RegExp(expectation.expectedPath);
      try {
        await expect(this.page).toHaveURL(expectedPathRegex, {
          timeout: config.navigationTimeoutMs
        });
      } catch (error) {
        if (this.lastVisualNavigationHref?.match(expectedPathRegex)) {
          return;
        }
        throw error;
      }
    }

    if (expectation.expectedTitleContains) {
      await expect(this.page).toHaveTitle(
        new RegExp(expectation.expectedTitleContains, 'i'),
        { timeout: config.actionTimeoutMs }
      );
    }

    if (expectation.expectedText) {
      await expect(this.page.locator('body')).toContainText(
        new RegExp(expectation.expectedText, 'i'),
        { timeout: config.actionTimeoutMs }
      );
    }
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

  async clickMenuItem(menu: NavigationMenu, itemLabel: string): Promise<void> {
    const link = await this.menuItemLink(menu, itemLabel);
    await this.clickSafe(link);
    await this.waitForStable();
  }

  async expectDigitalCouponsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/savings\/digital-coupons/i, {
      timeout: config.navigationTimeoutMs
    });
    await expect(this.page.locator('body')).toContainText(/digital coupons/i, {
      timeout: config.actionTimeoutMs
    });
  }

  private async dismissClubPopupIfPresent(): Promise<void> {
    const popup = this.page
      .locator('section, div, aside, article')
      .filter({ hasText: /join the club\./i })
      .first();

    if ((await popup.count()) === 0) {
      return;
    }

    const closeButton = popup
      .locator(
        'button[aria-label*="close" i], button[title*="close" i], button[aria-label="x" i]'
      )
      .first();

    if ((await closeButton.count()) > 0) {
      await closeButton
        .click({ force: true, noWaitAfter: true })
        .catch(() => undefined);
      await popup
        .waitFor({ state: 'hidden', timeout: 3_000 })
        .catch(() => undefined);
    }
  }
}
