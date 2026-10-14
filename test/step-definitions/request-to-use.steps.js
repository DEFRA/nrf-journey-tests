import { Given, When, Then } from '@cucumber/cucumber'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

Given(
  'I am on the these details do not match our records page',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.quoteNotMatchedPage.open()
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
