import assert from 'node:assert/strict'

async function assertSummaryRow(checkYourAnswersPage, key, expectedValue) {
  const rowValue = checkYourAnswersPage.summaryRowValue(key)
  await rowValue.waitFor({ state: 'visible' })
  const text = await rowValue.textContent()
  assert.ok(
    text.includes(expectedValue),
    `Expected "${key}" row to contain "${expectedValue}" but got "${text.trim()}"`
  )
}

export { assertSummaryRow }
