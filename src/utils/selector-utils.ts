import type { Locator, Page } from '@playwright/test';

type SelectorCandidate = {
  testId?: string;
  role?: Parameters<Page['getByRole']>[0];
  name?: string | RegExp;
  css?: string;
};

const firstVisible = async (locators: Locator[]): Promise<Locator> => {
  for (const locator of locators) {
    const count = await locator.count();
    if (count > 0) {
      return locator.first();
    }
  }

  throw new Error(
    'Unable to resolve a visible locator from the provided selector candidates.'
  );
};

export const locateWithFallback = async (
  page: Page,
  candidate: SelectorCandidate
): Promise<Locator> => {
  const locators: Locator[] = [];

  if (candidate.testId) {
    locators.push(page.getByTestId(candidate.testId));
    locators.push(page.locator(`[data-testid="${candidate.testId}"]`));
    locators.push(page.locator(`[data-test="${candidate.testId}"]`));
    locators.push(page.locator(`[data-qa-automation="${candidate.testId}"]`));
  }

  if (candidate.role && candidate.name !== undefined) {
    locators.push(page.getByRole(candidate.role, { name: candidate.name }));
  }

  if (candidate.css) {
    locators.push(page.locator(candidate.css));
  }

  return firstVisible(locators);
};

export const escapeForRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
