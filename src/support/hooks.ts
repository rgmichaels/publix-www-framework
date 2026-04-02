import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  setDefaultTimeout
} from '@cucumber/cucumber';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { BrowserSessionManager } from './browser';
import { config } from './config';
import type { CustomWorld } from './world';

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

setDefaultTimeout(config.navigationTimeoutMs + 30_000);

BeforeAll(async () => {
  await BrowserSessionManager.startBrowser();
});

Before(async function (this: CustomWorld, scenario) {
  const { context, page } = await BrowserSessionManager.newContextAndPage();
  this.context = context;
  this.page = page;
  this.consoleLogs = [];
  this.networkLogs = [];
  this.scenarioArtifacts = {};

  page.on('console', (message) => {
    this.consoleLogs.push(`[${message.type()}] ${message.text()}`);
  });

  if (config.captureNetworkLogs) {
    page.on('requestfinished', async (request) => {
      const response = await request.response();
      this.networkLogs.push(
        `${request.method()} ${request.url()} -> ${response?.status() ?? 'NO_RESPONSE'}`
      );
    });
  }

  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });

  const scenarioName = scenario.pickle.name;
  this.homePage = undefined;
  this.searchResultsPage = undefined;
  this.activeFixtureKey = slugify(scenarioName);
});

After(async function (this: CustomWorld, scenario) {
  if (!this.page || !this.context) {
    return;
  }

  const scenarioSlug = slugify(scenario.pickle.name);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseFilename = `${scenarioSlug}-${timestamp}`;

  if (scenario.result?.status === Status.FAILED) {
    if (config.screenshotOnFailure) {
      const screenshotPath = path.join(
        config.artifacts.screenshots,
        `${baseFilename}.png`
      );
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      this.scenarioArtifacts.screenshotPath = screenshotPath;
      await this.attach(`Screenshot saved to ${screenshotPath}`);
    }

    if (config.htmlSnapshotOnFailure) {
      const htmlSnapshotPath = path.join(
        config.artifacts.snapshots,
        `${baseFilename}.html`
      );
      await writeFile(htmlSnapshotPath, await this.page.content(), 'utf8');
      this.scenarioArtifacts.htmlSnapshotPath = htmlSnapshotPath;
      await this.attach(`HTML snapshot saved to ${htmlSnapshotPath}`);
    }

    if (this.consoleLogs.length > 0) {
      const consolePath = path.join(
        config.artifacts.console,
        `${baseFilename}.log`
      );
      await writeFile(consolePath, this.consoleLogs.join('\n'), 'utf8');
      this.scenarioArtifacts.consoleLogPath = consolePath;
      await this.attach(this.consoleLogs.join('\n'), 'text/plain');
    }

    if (config.captureNetworkLogs && this.networkLogs.length > 0) {
      const networkPath = path.join(
        config.artifacts.network,
        `${baseFilename}.log`
      );
      await writeFile(networkPath, this.networkLogs.join('\n'), 'utf8');
      this.scenarioArtifacts.networkLogPath = networkPath;
      await this.attach(this.networkLogs.join('\n'), 'text/plain');
    }
  }

  const shouldPersistTrace =
    scenario.result?.status === Status.FAILED &&
    Boolean(scenario.willBeRetried);

  if (shouldPersistTrace) {
    await mkdir(config.artifacts.traces, { recursive: true });
    const tracePath = path.join(config.artifacts.traces, `${baseFilename}.zip`);
    await this.context.tracing.stop({ path: tracePath });
    this.scenarioArtifacts.tracePath = tracePath;
    await this.attach(`Retry trace saved to ${tracePath}`);
  } else {
    await this.context.tracing.stop();
  }

  await this.page.close();
  await this.context.close();
});

AfterAll(async () => {
  await BrowserSessionManager.stopBrowser();
});
