import assert from 'node:assert/strict'
import { Given, Then } from '@cucumber/cucumber'

Given('I am on the home page', async function () {
  await this.pageObjects.homePage.open()
})

Then('the page title should be {string}', async function (expectedTitle) {
  const title = await this.page.title()
  assert.equal(title, expectedTitle)
})

Then('I should see a {string} phase banner', async function (tagText) {
  const banner = this.pageObjects.homePage.phaseBanner
  assert.ok(await banner.isVisible(), 'Expected phase banner to be visible')
  const text = (await banner.textContent()).trim()
  assert.ok(
    text.includes(tagText),
    `Expected phase banner to contain "${tagText}", got "${text}"`
  )
})

Then(
  'the phase banner should contain a {string} link',
  async function (linkText) {
    const link = this.pageObjects.homePage.phaseBanner.getByRole('link', {
      name: linkText
    })
    assert.ok(
      await link.isVisible(),
      `Expected phase banner to contain a "${linkText}" link`
    )
  }
)
