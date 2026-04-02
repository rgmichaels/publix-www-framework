import { Then, When } from '@cucumber/cucumber';

import { SearchResultsPage } from '../pages/search-results-page';
import { getSearchCase } from '../utils/search-fixture';
import type { CustomWorld } from '../support/world';

When(
  'I search using the {string} search fixture',
  async function (this: CustomWorld, fixtureKey: string) {
    const searchCase = getSearchCase(fixtureKey);
    if (!this.homePage) {
      throw new Error(
        'HomePage is not initialized. Open the homepage before searching.'
      );
    }

    await this.homePage.search(searchCase.term);
    this.searchResultsPage = new SearchResultsPage(this.ensurePage());
  }
);

Then(
  'the {string} search results should look valid',
  async function (this: CustomWorld, fixtureKey: string) {
    const searchCase = getSearchCase(fixtureKey);
    if (!this.searchResultsPage) {
      this.searchResultsPage = new SearchResultsPage(this.ensurePage());
    }

    await this.searchResultsPage.expectUrlContains(
      searchCase.expectedUrlIncludes
    );
    await this.searchResultsPage.expectResultsFor(
      searchCase.expectedResultText
    );
  }
);
