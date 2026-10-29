// Scenarios each launch their own browser and session, so they run in parallel
// worker processes. BrowserStack stays serial: each worker would start its own
// Local tunnel and use another device session.
const parallelWorkers = 5

export default {
  // BrowserStack runs cover one upload and one draw journey, end to end. The
  // iPhone runs the upload journey only: BrowserStack's iOS Playwright sends
  // synthetic events, which the draw map doesn't respond to.
  paths: process.env.BROWSERSTACK_DEVICE
    ? [
        'test/features/quote/upload/quote-full-journey.feature',
        ...(process.env.BROWSERSTACK_DEVICE === 'iphone'
          ? []
          : ['test/features/quote/draw/quote-full-journey.feature'])
      ]
    : ['test/features/**/*.feature'],
  parallel: process.env.BROWSERSTACK_DEVICE ? 0 : parallelWorkers,
  tags: 'not @pending',
  // Real remote browsers occasionally stall for about a minute (the page stops
  // responding, or a meta refresh never fires). Retry a failed scenario once on
  // BrowserStack, in a fresh session; local and CI runs don't retry. Firefox on
  // macOS (latest-3) stalls more often than the others, so it gets two retries.
  retry: !process.env.BROWSERSTACK_DEVICE
    ? 0
    : process.env.BROWSERSTACK_DEVICE === 'firefox-macos-latest-3'
      ? 2
      : 1,
  import: [
    'test/support/world.js',
    'test/support/hooks.js',
    'test/step-definitions/**/*.js'
  ],
  format: [
    'progress',
    ['allure-cucumberjs/reporter', 'allure-results/.allure-stream']
  ],
  formatOptions: {
    resultsDir: 'allure-results'
  }
}
