module.exports = {
  default: [
    'src/features/**/*.feature',
    '--require-module ts-node/register',
    '--require src/support/**/*.ts',
    '--require src/steps/**/*.ts',
    '--format progress',
    '--format json:artifacts/cucumber/cucumber-report.json',
    '--tags "not @wip"'
  ].join(' '),
  ci: [
    'src/features/**/*.feature',
    '--require-module ts-node/register',
    '--require src/support/**/*.ts',
    '--require src/steps/**/*.ts',
    '--retry 2',
    '--format progress-bar',
    '--format json:artifacts/cucumber/cucumber-report.json',
    '--tags "not @wip"'
  ].join(' ')
};
