import fs from 'node:fs'
import { Before, After, AfterAll, Status } from '@cucumber/cucumber'

let failedCount = 0

Before(async function () {
  // Recorded before any quote email is sent, so the email lookup can ignore
  // older emails (reused NRF references across runs share the Notify account).
  this.scenarioStartedAt = new Date().toISOString()
  await this.openBrowser()
})

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    failedCount++
    const screenshot = await this.page.screenshot({ fullPage: true })
    this.attach(screenshot, 'image/png')
  }
  await this.closeBrowser()
})

AfterAll(function () {
  if (failedCount > 0) {
    fs.writeFileSync('FAILED', JSON.stringify({ failed: failedCount }))
  }
})
