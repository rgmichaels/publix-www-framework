import { mkdir, rm } from 'node:fs/promises';

const directories = [
  'artifacts',
  'artifacts/console',
  'artifacts/cucumber',
  'artifacts/html',
  'artifacts/network',
  'artifacts/screenshots',
  'artifacts/snapshots',
  'artifacts/traces'
];

await rm('artifacts', { force: true, recursive: true });

for (const directory of directories) {
  await mkdir(directory, { recursive: true });
}
