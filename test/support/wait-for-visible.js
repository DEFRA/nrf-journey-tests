import assert from 'node:assert/strict'

const DEFAULT_TIMEOUT_MS = 10_000

// Waits for `locator` to become visible within `timeoutMs` — deliberately
// bounded well under Cucumber's step timeout (see setDefaultTimeout in
// world.js, and any per-step override) so this catch block runs and reports
// what was actually on the page, rather than Cucumber's own timer firing
// first with a bare "function timed out" error that gives no clue what was
// expected vs found.
async function waitForVisible(
  page,
  locator,
  description,
  { timeoutMs = DEFAULT_TIMEOUT_MS } = {}
) {
  try {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs })
  } catch {
    const actualHeading = await page
      .locator('h1')
      .first()
      .textContent()
      .catch(() => null)
    assert.fail(
      `Expected to see ${description} but it did not appear within ${timeoutMs / 1000}s.\n` +
        `Current URL: ${page.url()}\n` +
        `Actual <h1> on page: ${actualHeading ? `"${actualHeading.trim()}"` : 'none found'}`
    )
  }
}

export { waitForVisible }
