import visualNavigationFixture from '../fixtures/visual-navigation-fixtures.json';

export type VisualNavigationExpectation = {
  expectedPath?: string;
  expectedText?: string;
  expectedTitleContains?: string;
  expectedDialogText?: string;
  expectedHrefContains?: string;
};

type VisualNavigationFixtureShape = Record<string, VisualNavigationExpectation>;

const fixture = visualNavigationFixture as VisualNavigationFixtureShape;

export const getVisualNavigationExpectation = (
  linkLabel: string
): VisualNavigationExpectation => {
  const expectation = fixture[linkLabel];
  if (!expectation) {
    throw new Error(
      `No visual navigation fixture was found for label "${linkLabel}".`
    );
  }

  return expectation;
};
