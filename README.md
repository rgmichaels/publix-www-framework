# Publix WWW Framework

Production-ready end-to-end automation framework for `publix.com` using Playwright, Cucumber, TypeScript, and the Page Object Model.

## What you're getting

- A reusable BDD automation framework built with Playwright + Cucumber + TypeScript in strict mode.
- A layered structure with `pages`, `steps`, `support`, `utils`, and `fixtures`.
- Runtime environment validation that fails fast when `BASE_URL` is missing.
- Scenario-level isolation with a custom Cucumber `World`.
- Failure artifacts for screenshots, console logs, optional HTML snapshots, and retry traces.
- GitHub Actions CI that installs Chromium, runs the suite headlessly, and uploads artifacts.
- Sample tests for homepage availability, product search, and header navigation coverage.

## Assumptions

- `BASE_URL` is required at runtime and should be set to `https://publix.com` unless your target environment differs.
- Publix is a third-party site, so this framework prefers `data-testid` selectors first but falls back to semantic locators and known stable ids when test ids are not available.
- A few navigation selectors are based on currently observed production navigation metadata. If Publix changes those menus, update `src/fixtures/navigation-fixtures.json` and the page object fallback selectors.
- The framework validates menu link targets in the open flyout. If you want full click-through validation for every menu item, extend the navigation steps to iterate through a fresh page state per link.

## Folder structure

```text
publix-www-framework/
├── .github/
│   └── workflows/
│       └── ci.yml
├── scripts/
│   ├── clean.mjs
│   └── generate-report.mjs
├── src/
│   ├── features/
│   │   ├── homepage.feature
│   │   ├── navigation.feature
│   │   └── search.feature
│   ├── fixtures/
│   │   ├── navigation-fixtures.json
│   │   └── search-fixtures.json
│   ├── pages/
│   │   ├── base-page.ts
│   │   ├── home-page.ts
│   │   └── search-results-page.ts
│   ├── steps/
│   │   ├── homepage.steps.ts
│   │   ├── navigation.steps.ts
│   │   └── search.steps.ts
│   ├── support/
│   │   ├── browser.ts
│   │   ├── config.ts
│   │   ├── hooks.ts
│   │   └── world.ts
│   └── utils/
│       ├── navigation-fixture.ts
│       ├── search-fixture.ts
│       └── selector-utils.ts
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── cucumber.js
├── eslint.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

1. Use Node.js `18+`.
2. Install dependencies:

```bash
npm ci
```

3. Install the Playwright browser:

```bash
npx playwright install chromium
```

4. Export the required base URL:

```bash
export BASE_URL=https://publix.com
```

## Run commands

Run the full suite:

```bash
npm test
```

Run smoke tests:

```bash
npm run test:smoke
```

Run regression tests:

```bash
npm run test:regression
```

Run work-in-progress tests only:

```bash
npm run test:wip
```

Run in parallel:

```bash
npm run test:parallel
```

Run headed locally:

```bash
HEADLESS=false npm test
```

Run headless locally:

```bash
HEADLESS=true npm test
```

Generate the HTML report from the latest Cucumber JSON artifact:

```bash
npm run report:html
```

## Tags

- `@smoke`: fast coverage for core user journeys.
- `@regression`: broader confidence checks.
- `@wip`: excluded from default and CI runs.

## Selector strategy

Use selectors in this order:

1. `data-testid`
2. Other automation attributes like `data-test` or `data-qa-automation`
3. Accessible role + name
4. Stable ids or CSS fallbacks only when needed for third-party pages

For sites you own, prefer adding `data-testid` and keeping page objects simple. For external sites like Publix, use semantic locators and store any unavoidable fallbacks in page objects or JSON fixtures instead of scattering them across step definitions.

## Reporting and artifacts

Artifacts are written to `artifacts/`:

- `artifacts/screenshots`: screenshots captured on failure
- `artifacts/traces`: Playwright traces saved when a failed scenario will retry
- `artifacts/console`: browser console logs captured on failure
- `artifacts/snapshots`: optional HTML snapshots captured on failure
- `artifacts/network`: optional network logs when `CAPTURE_NETWORK_LOGS=true`
- `artifacts/cucumber`: raw Cucumber JSON output
- `artifacts/html`: generated HTML report

## CI explanation

GitHub Actions runs on every push and:

1. installs dependencies with `npm ci`
2. installs Chromium for Playwright
3. runs linting, formatting checks, type checks, and the Cucumber suite headlessly
4. generates the HTML report
5. uploads the `artifacts/` directory for debugging

## Debug locally

- Use `HEADLESS=false` to watch the browser.
- Re-run a single tagged slice such as `npm run test:smoke`.
- Turn on network logging with `CAPTURE_NETWORK_LOGS=true npm test`.
- Open retry traces with `npx playwright show-trace artifacts/traces/<trace-file>.zip`.

## How to update selectors

1. Inspect the current page with Playwright Inspector or browser dev tools.
2. Update the relevant page object selector first.
3. If the menu or search data changes, update the corresponding JSON fixture.
4. Re-run the smallest relevant tag or feature before re-running the whole suite.

## Troubleshooting

- `Missing required environment variable BASE_URL`:
  Export `BASE_URL=https://publix.com` before running tests.
- Search steps fail because the page structure changed:
  Update the fallback search locator in `src/pages/home-page.ts`.
- Navigation assertions fail:
  Inspect the current flyout content and refresh `src/fixtures/navigation-fixtures.json`.
- CI is green locally but flaky remotely:
  Increase timeouts or retries through env vars rather than hard-coding waits.

## Notes for future hardening

- If Publix exposes better automation-friendly attributes later, switch the framework over to those selectors.
- For deeper link validation, add a scenario that clicks each menu item in a fresh scenario context and verifies the final page content.
