// Cucumber discovers this configuration for both the TypeScript runner and direct CLI commands.
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['hooks/**/*.ts', 'step-definitions/**/*.ts'],
    format: ['progress'],
    formatOptions: {
      snippetInterface: 'async-await',
    },
  },
};
