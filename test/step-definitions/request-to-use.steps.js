import { When } from '@cucumber/cucumber'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

When(
  'I select {string} as whether I have an NRL reference',
  /** @this {PlaywrightWorld} */
  async function (option) {
    await this.pageObjects.haveNrlReferencePage.selectOption(option)
  }
)
