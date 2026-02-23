export default {
  paths: ['test/features/**/*.feature'],
  import: [
    'test/support/world.js',
    'test/support/hooks.js',
    'test/step-definitions/**/*.js'
  ],
  format: [
    'summary',
    ['allure-cucumberjs/reporter', 'allure-results/.allure-stream']
  ],
  formatOptions: {
    resultsDir: 'allure-results'
  }
}
