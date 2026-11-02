import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'
import { waitForVisible } from '../support/wait-for-visible.js'
import { seedCheckYourAnswersSession } from '../support/seed-quote.js'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

Given(
  'I have a quote ready to submit',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await seedCheckYourAnswersSession(this)
    await this.pageObjects.checkYourAnswersPage.open()
    await waitForVisible(
      this.page,
      this.pageObjects.checkYourAnswersPage.pageHeading,
      'the Check Your Answers page heading',
      { timeoutMs: 20_000 }
    )
  }
)

When(
  'I click the Delete button',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.checkYourAnswersPage.delete()
  }
)

When(
  'I click Delete to confirm deletion',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.deleteQuotePage.clickYes()
  }
)

Then(
  'I should see the deletion confirmation page',
  /** @this {PlaywrightWorld} */
  async function () {
    const panel = this.pageObjects.deleteQuoteConfirmationPage.panelTitle
    await waitForVisible(this.page, panel, 'the deletion confirmation panel')
    assert.equal(
      (await panel.textContent()).trim(),
      'Your details have been deleted'
    )
  }
)
