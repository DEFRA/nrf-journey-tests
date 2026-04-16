import assert from 'node:assert/strict'
import { Then } from '@cucumber/cucumber'

Then('I should see the no-EDP explanation text', async function () {
  await this.pageObjects.noEdpPage.bodyText.waitFor({ state: 'visible' })
  assert.ok(await this.pageObjects.noEdpPage.bodyText.isVisible())
})

Then('I should see the {string} heading', async function (heading) {
  const h1 = this.page.locator('h1', { hasText: heading })
  await h1.waitFor({ state: 'visible' })
  assert.ok(await h1.isVisible())
})
