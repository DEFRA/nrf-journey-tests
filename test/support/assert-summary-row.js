import assert from 'node:assert/strict'
import { waitForVisible } from './wait-for-visible.js'

async function assertSummaryRow(checkYourAnswersPage, key, expectedValue) {
  const rowValue = checkYourAnswersPage.summaryRowValue(key)
  await waitForVisible(
    checkYourAnswersPage.page,
    rowValue,
    `the "${key}" summary row`
  )
  const text = await rowValue.textContent()
  assert.ok(
    text.includes(expectedValue),
    `Expected "${key}" row to contain "${expectedValue}" but got "${text.trim()}"`
  )
}

export { assertSummaryRow }
