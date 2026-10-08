import fs from 'node:fs'
import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber'
import {
  isBrowserStack,
  setSessionStatus,
  startBrowserStackLocal,
  stopBrowserStackLocal
} from './browserstack.js'

let failedCount = 0

BeforeAll({ timeout: 120_000 }, async function () {
  if (isBrowserStack) await startBrowserStackLocal()
})

Before({ timeout: 120_000 }, async function ({ pickle }) {
  // Recorded before any quote email is sent, so the email lookup can ignore
  // older emails (reused NRL references across runs share the Notify account).
  this.scenarioStartedAt = new Date().toISOString()
  await this.openBrowser(pickle.name)
  await this.pageObjects.analyticsInternalPage.open()
  await this.pageObjects.analyticsInternalPage.disableAnalytics()
})

After({ timeout: 30_000 }, async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    // A failed attempt that will be retried doesn't count: only the final
    // outcome decides whether the run is marked as failed
    if (!scenario.willBeRetried) failedCount++
    try {
      const screenshot = await this.page.screenshot({ fullPage: true })
      this.attach(screenshot, 'image/png')
      this.attach(`URL at failure: ${this.page.url()}`, 'text/plain')
    } catch {
      // Screenshot failed (page already closed or unresponsive) — not critical
    }
  }
  if (isBrowserStack) {
    try {
      const failed = scenario.result?.status === Status.FAILED
      await setSessionStatus(
        this.page,
        failed ? 'failed' : 'passed',
        scenario.pickle.name
      )
    } catch {
      // Session already closed — the BrowserStack dashboard shows it as unmarked
    }
  }
  await this.closeBrowser()
})

AfterAll({ timeout: 60_000 }, async function () {
  if (isBrowserStack) await stopBrowserStackLocal()

  if (failedCount > 0) {
    fs.writeFileSync('FAILED', JSON.stringify({ failed: failedCount }))
  }
})
