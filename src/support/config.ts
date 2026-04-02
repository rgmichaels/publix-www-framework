import path from 'node:path';

type RuntimeConfig = {
  readonly baseUrl: string;
  readonly headless: boolean;
  readonly ci: boolean;
  readonly retries: number;
  readonly defaultTimeoutMs: number;
  readonly navigationTimeoutMs: number;
  readonly actionTimeoutMs: number;
  readonly browserName: 'chromium';
  readonly locale: string;
  readonly screenshotOnFailure: boolean;
  readonly htmlSnapshotOnFailure: boolean;
  readonly captureNetworkLogs: boolean;
  readonly parallel: number;
  readonly artifacts: {
    readonly root: string;
    readonly screenshots: string;
    readonly traces: string;
    readonly snapshots: string;
    readonly console: string;
    readonly network: string;
    readonly cucumber: string;
    readonly html: string;
  };
};

const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean
): boolean => {
  if (value === undefined || value === '') {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'n'].includes(normalized)) {
    return false;
  }

  throw new Error(`Expected a boolean value but received "${value}".`);
};

const parseNumber = (
  value: string | undefined,
  defaultValue: number
): number => {
  if (value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Expected a numeric value but received "${value}".`);
  }

  return parsed;
};

const requireBaseUrl = (): string => {
  const value = process.env.BASE_URL;
  if (!value) {
    throw new Error(
      'Missing required environment variable BASE_URL. Example: BASE_URL=https://publix.com'
    );
  }

  const parsed = new URL(value);
  return parsed.toString().replace(/\/$/, '');
};

const ci = parseBoolean(process.env.CI, false);
const root = path.resolve('artifacts');

export const config: RuntimeConfig = {
  baseUrl: requireBaseUrl(),
  headless: parseBoolean(process.env.HEADLESS, ci),
  ci,
  retries: parseNumber(process.env.RETRIES, ci ? 2 : 0),
  defaultTimeoutMs: parseNumber(process.env.DEFAULT_TIMEOUT_MS, 15_000),
  navigationTimeoutMs: parseNumber(process.env.NAVIGATION_TIMEOUT_MS, 30_000),
  actionTimeoutMs: parseNumber(process.env.ACTION_TIMEOUT_MS, 15_000),
  browserName: 'chromium',
  locale: process.env.LOCALE ?? 'en-US',
  screenshotOnFailure: parseBoolean(process.env.SCREENSHOT_ON_FAILURE, true),
  htmlSnapshotOnFailure: parseBoolean(
    process.env.HTML_SNAPSHOT_ON_FAILURE,
    true
  ),
  captureNetworkLogs: parseBoolean(process.env.CAPTURE_NETWORK_LOGS, false),
  parallel: parseNumber(process.env.PARALLEL, ci ? 2 : 1),
  artifacts: {
    root,
    screenshots: path.join(root, 'screenshots'),
    traces: path.join(root, 'traces'),
    snapshots: path.join(root, 'snapshots'),
    console: path.join(root, 'console'),
    network: path.join(root, 'network'),
    cucumber: path.join(root, 'cucumber'),
    html: path.join(root, 'html')
  }
};
