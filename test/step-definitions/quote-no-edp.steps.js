import { Then } from '@cucumber/cucumber'
import { waitForVisible } from '../support/wait-for-visible.js'

Then('I should see the no-EDP explanation text', async function () {
  await waitForVisible(
    this.page,
    this.pageObjects.noEdpPage.bodyText,
    'the no-EDP explanation text'
  )
})

Then('I should see the {string} heading', async function (heading) {
  const h1 = this.page.locator('h1', { hasText: heading })
  await waitForVisible(this.page, h1, `heading "${heading}"`)
})
