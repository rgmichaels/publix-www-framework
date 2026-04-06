import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const reportPath = path.resolve('artifacts/cucumber/cucumber-report.json');
const htmlPath = path.resolve('artifacts/html/cucumber-report.html');

let report = [];
let missingReport = false;
try {
  const raw = await readFile(reportPath, 'utf8');
  report = JSON.parse(raw);
} catch (error) {
  const code = error && typeof error === 'object' ? error.code : undefined;
  if (code === 'ENOENT') {
    console.warn(
      `Skipping HTML report generation: Cucumber JSON not found at ${reportPath}`
    );
    missingReport = true;
  } else {
    throw error;
  }
}

if (missingReport) {
  // Keep CI green when upstream steps fail before the cucumber JSON is produced.
} else {
  const rows = [];
  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const feature of report) {
    for (const scenario of feature.elements ?? []) {
      const steps = scenario.steps ?? [];
      const status = steps.find((step) => step.result?.status === 'failed')
        ? 'failed'
        : steps.some((step) => step.result?.status === 'skipped')
          ? 'skipped'
          : 'passed';

      if (status === 'passed') {
        passed += 1;
      } else if (status === 'failed') {
        failed += 1;
      } else {
        skipped += 1;
      }

      rows.push(`
      <tr class="${status}">
        <td>${feature.name}</td>
        <td>${scenario.name}</td>
        <td>${status.toUpperCase()}</td>
      </tr>
    `);
    }
  }

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Publix WWW Framework Report</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f7f9f4;
        --card: #ffffff;
        --border: #d5dfd2;
        --ink: #163120;
        --pass: #dff5e5;
        --fail: #fbe1de;
        --skip: #f6efcf;
      }
      body {
        margin: 0;
        padding: 32px;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        background: linear-gradient(180deg, #f3f7ee 0%, #fbfcf8 100%);
        color: var(--ink);
      }
      .card {
        max-width: 1100px;
        margin: 0 auto;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 18px 40px rgba(22, 49, 32, 0.08);
      }
      h1 {
        margin-top: 0;
      }
      .summary {
        display: flex;
        gap: 16px;
        margin: 24px 0;
        flex-wrap: wrap;
      }
      .pill {
        border-radius: 999px;
        padding: 10px 16px;
        font-weight: 700;
      }
      .pass {
        background: var(--pass);
      }
      .fail {
        background: var(--fail);
      }
      .skip {
        background: var(--skip);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        overflow: hidden;
        border-radius: 14px;
      }
      th,
      td {
        text-align: left;
        padding: 14px 16px;
        border-bottom: 1px solid var(--border);
      }
      tr.passed {
        background: rgba(223, 245, 229, 0.45);
      }
      tr.failed {
        background: rgba(251, 225, 222, 0.45);
      }
      tr.skipped {
        background: rgba(246, 239, 207, 0.45);
      }
    </style>
  </head>
  <body>
    <section class="card">
      <h1>Publix WWW Framework Report</h1>
      <p>Generated from the Cucumber JSON artifact produced by the framework.</p>
      <div class="summary">
        <span class="pill pass">Passed: ${passed}</span>
        <span class="pill fail">Failed: ${failed}</span>
        <span class="pill skip">Skipped: ${skipped}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Scenario</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${rows.join('')}</tbody>
      </table>
    </section>
  </body>
</html>`;

  await mkdir(path.dirname(htmlPath), { recursive: true });
  await writeFile(htmlPath, html, 'utf8');
  console.log(`HTML report written to ${htmlPath}`);
}
