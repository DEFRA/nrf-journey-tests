import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'
import { waitForVisible } from '../support/wait-for-visible.js'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

Given(
  'I am on the these details do not match our records page',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.quoteNotMatchedPage.open()
  }
)

Then(
  'I should see the email confirmation page',
  /** @this {PlaywrightWorld} */
  async function () {
    const panelTitle = this.pageObjects.emailConfirmationPage.panelTitle
    await waitForVisible(this.page, panelTitle, 'the email confirmation panel')
    assert.equal(
      (await panelTitle.textContent()).trim(),
      'We have sent you an email'
    )
  }
)

When(
  'I answer {string} to having an NRL reference',
  /** @this {PlaywrightWorld} */
  async function (answer) {
    await this.pageObjects.haveNrlReferencePage.selectAnswer(answer)
  }
)

When(
  'I enter {string} as my NRL reference',
  /** @this {PlaywrightWorld} */
  async function (reference) {
    await this.pageObjects.enterNrlReferencePage.fillNrlReference(reference)
  }
)

Then(
  'I should be taken to {string}',
  /** @this {PlaywrightWorld} */
  async function (path) {
    await this.page.waitForURL((url) => url.pathname === path)
  }
)
