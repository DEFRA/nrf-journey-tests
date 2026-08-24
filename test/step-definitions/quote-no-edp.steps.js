import { Then } from '@cucumber/cucumber'
import { waitForVisible } from '../support/wait-for-visible.js'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

Then(
  'I should see the no-EDP explanation text',
  /** @this {PlaywrightWorld} */
  async function () {
    await waitForVisible(
      this.page,
      this.pageObjects.noEdpPage.bodyText,
      'the no-EDP explanation text'
    )
  }
)

Then(
  'I should see the {string} heading',
  /** @this {PlaywrightWorld} */
  async function (heading) {
    const h1 = this.page.locator('h1', { hasText: heading })
    await waitForVisible(this.page, h1, `heading "${heading}"`)
  }
)
