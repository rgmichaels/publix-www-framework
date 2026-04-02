import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

import { getNavigationMenu } from '../utils/navigation-fixture';
import type { CustomWorld } from '../support/world';

Then(
  'the {string} menu should expose working fixture links',
  async function (this: CustomWorld, menuKey: string) {
    if (!this.homePage) {
      throw new Error(
        'HomePage is not initialized. Open the homepage before validating menus.'
      );
    }

    const menu = getNavigationMenu(menuKey);

    for (const item of menu.items) {
      const link = await this.homePage.menuItemLink(menu, item.label);
      await expect(link).toHaveAttribute('href', new RegExp(item.expectedPath));
    }
  }
);
