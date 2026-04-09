import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

import {
  HomePage,
  SeasonalVisualNavigationUnavailableError
} from '../pages/home-page';
import { getNavigationMenu } from '../utils/navigation-fixture';
import { getVisualNavigationExpectation } from '../utils/visual-navigation-fixture';
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

When(
  'I click the {string} item in the {string} menu',
  async function (this: CustomWorld, itemLabel: string, menuKey: string) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    const menu = getNavigationMenu(menuKey);
    await this.homePage.clickMenuItem(menu, itemLabel);
  }
);

Then(
  'I should land on the digital coupons page',
  async function (this: CustomWorld) {
    if (!this.homePage) {
      throw new Error(
        'HomePage is not initialized. Open the homepage before validating destination page.'
      );
    }

    await this.homePage.expectDigitalCouponsPage();
  }
);

When(
  'I click the Weekly Ad link on the homepage',
  async function (this: CustomWorld) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    await this.homePage.clickWeeklyAdLink();
  }
);

When(
  'I click the Locations link on the homepage',
  async function (this: CustomWorld) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    await this.homePage.clickLocationsLink();
  }
);

When(
  'I click the Pharmacy link on the homepage',
  async function (this: CustomWorld) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    await this.homePage.clickPharmacyLink();
  }
);

When(
  'I click the Contact Us link on the homepage',
  async function (this: CustomWorld) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    await this.homePage.clickContactUsLink();
  }
);

When(
  'I click the About Publix link on the homepage',
  async function (this: CustomWorld) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    await this.homePage.clickAboutPublixLink();
  }
);

Then('I should land on a weekly ad page', async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error(
      'HomePage is not initialized. Open the homepage before validating destination page.'
    );
  }

  await this.homePage.expectWeeklyAdPage('weekly ad');
});

Then('I should land on the locations page', async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error(
      'HomePage is not initialized. Open the homepage before validating destination page.'
    );
  }

  await this.homePage.expectLocationsPage();
});

Then('I should land on the pharmacy page', async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error(
      'HomePage is not initialized. Open the homepage before validating destination page.'
    );
  }

  await this.homePage.expectPharmacyPage();
});

Then('I should land on a contact us page', async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error(
      'HomePage is not initialized. Open the homepage before validating destination page.'
    );
  }

  await this.homePage.expectContactUsPage();
});

Then(
  'I should land on an about publix page',
  async function (this: CustomWorld) {
    if (!this.homePage) {
      throw new Error(
        'HomePage is not initialized. Open the homepage before validating destination page.'
      );
    }

    await this.homePage.expectAboutPublixPage();
  }
);

Then('I should land on the catering page', async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error(
      'HomePage is not initialized. Open the homepage before validating destination page.'
    );
  }

  await this.homePage.expectCateringPage();
});

Then(
  'the page should display {string} text',
  async function (this: CustomWorld, pageText: string) {
    if (!this.homePage) {
      throw new Error(
        'HomePage is not initialized. Open the homepage before validating destination page content.'
      );
    }

    await this.homePage.expectWeeklyAdPage(pageText);
  }
);

When(
  'I click the {string} visual navigation link on the homepage',
  async function (this: CustomWorld, linkLabel: string) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    try {
      await this.homePage.clickVisualNavigationLink(linkLabel);
    } catch (error) {
      if (
        error instanceof SeasonalVisualNavigationUnavailableError &&
        /^easter meals$/i.test(linkLabel)
      ) {
        this.attach(`Skipping scenario: ${error.message}`, 'text/plain');
        return 'skipped';
      }
      throw error;
    }
  }
);

Then(
  'the {string} visual navigation destination should load',
  async function (this: CustomWorld, linkLabel: string) {
    if (!this.homePage) {
      throw new Error(
        'HomePage is not initialized. Open the homepage before validating visual navigation.'
      );
    }

    const expectation = getVisualNavigationExpectation(linkLabel);
    await this.homePage.expectVisualNavigationDestination(expectation);
  }
);
