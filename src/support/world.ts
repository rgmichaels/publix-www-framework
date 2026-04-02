import {
  World,
  setWorldConstructor,
  type IWorldOptions
} from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';

import type { HomePage } from '../pages/home-page';
import type { SearchResultsPage } from '../pages/search-results-page';

export type ScenarioArtifacts = {
  screenshotPath?: string;
  tracePath?: string;
  htmlSnapshotPath?: string;
  consoleLogPath?: string;
  networkLogPath?: string;
};

export class CustomWorld extends World {
  context: BrowserContext | undefined;
  page: Page | undefined;
  homePage: HomePage | undefined;
  searchResultsPage: SearchResultsPage | undefined;
  consoleLogs: string[] = [];
  networkLogs: string[] = [];
  scenarioArtifacts: ScenarioArtifacts = {};
  activeFixtureKey: string | undefined;

  constructor(options: IWorldOptions) {
    super(options);
  }

  ensurePage(): Page {
    if (!this.page) {
      throw new Error(
        'Playwright page is not initialized for the current scenario.'
      );
    }

    return this.page;
  }

  ensureContext(): BrowserContext {
    if (!this.context) {
      throw new Error(
        'Playwright context is not initialized for the current scenario.'
      );
    }

    return this.context;
  }
}

setWorldConstructor(CustomWorld);
