import searchFixture from '../fixtures/search-fixtures.json';

type SearchCase = {
  term: string;
  expectedUrlIncludes: string;
  expectedResultText: string;
};

type SearchFixtureShape = Record<string, SearchCase>;

const fixture = searchFixture as SearchFixtureShape;

export const getSearchCase = (fixtureKey: string): SearchCase => {
  const searchCase = fixture[fixtureKey];
  if (!searchCase) {
    throw new Error(`No search fixture was found for key "${fixtureKey}".`);
  }

  return searchCase;
};
