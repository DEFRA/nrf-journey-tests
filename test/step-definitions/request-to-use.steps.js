import { When } from '@cucumber/cucumber'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

When(
  'I answer {string} to having an NRL reference',
  /** @this {PlaywrightWorld} */
  async function (answer) {
    await this.pageObjects.haveNrlReferencePage.selectAnswer(answer)
  }
)
