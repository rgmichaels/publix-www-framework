import { Given, Then, When } from '@cucumber/cucumber';

import { HomePage } from '../pages/home-page';
import type { CustomWorld } from '../support/world';

Given('I open the Publix homepage', async function (this: CustomWorld) {
  this.homePage = new HomePage(this.ensurePage());
  await this.homePage.open();
  await this.homePage.dismissOneTrustIfPresent();
});

Then('the homepage loads successfully', async function (this: CustomWorld) {
  if (!this.homePage) {
    this.homePage = new HomePage(this.ensurePage());
  }

  await this.homePage.expectLoaded();
});

Then(
  'the Club popup appears with expected copy',
  async function (this: CustomWorld) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    await this.homePage.expectClubPopupCopy();
  }
);

Then(
  'the Club popup has a {string} button and a {string} button',
  async function (
    this: CustomWorld,
    firstButtonLabel: string,
    secondButtonLabel: string
  ) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    await this.homePage.expectClubPopupActionButtons(
      firstButtonLabel,
      secondButtonLabel
    );
  }
);

When('I open the cart from the homepage', async function (this: CustomWorld) {
  if (!this.homePage) {
    this.homePage = new HomePage(this.ensurePage());
  }

  await this.homePage.openCart();
});

Then(
  'the empty cart message should be displayed',
  async function (this: CustomWorld) {
    if (!this.homePage) {
      this.homePage = new HomePage(this.ensurePage());
    }

    await this.homePage.expectEmptyCartMessage();
  }
);
