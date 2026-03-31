import assert from 'node:assert/strict'
import { Then } from '@cucumber/cucumber'

Then('I should see the no-EDP explanation text', async function () {
  await this.pageObjects.noEdpPage.bodyText.waitFor({ state: 'visible' })
  assert.ok(await this.pageObjects.noEdpPage.bodyText.isVisible())
})
