import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

import { getNavigationMenu } from '../utils/navigation-fixture';
import type { CustomWorld } from '../support/world';

const assertMenuLinks = async (
  world: CustomWorld,
  menuKey: string
): Promise<void> => {
  if (!world.homePage) {
    throw new Error(
      'HomePage is not initialized. Open the homepage before validating menus.'
    );
  }

  const menu = getNavigationMenu(menuKey);

  for (const item of menu.items) {
    const link = await world.homePage.menuItemLink(menu, item.label);
    await expect(link).toHaveAttribute('href', new RegExp(item.expectedPath));
  }
};

Then(
  'the {string} menu should expose working fixture links',
  async function (this: CustomWorld, menuKey: string) {
    await assertMenuLinks(this, menuKey);
  }
);

Then(
  'the savings, order ahead, and catering menus should expose working fixture links',
  async function (this: CustomWorld) {
    for (const menuKey of ['savings', 'orderAhead', 'catering']) {
      await assertMenuLinks(this, menuKey);
    }
  }
);
