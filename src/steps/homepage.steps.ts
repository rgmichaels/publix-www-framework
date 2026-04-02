import { Given, Then } from '@cucumber/cucumber';

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
