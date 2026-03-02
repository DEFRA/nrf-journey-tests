import assert from 'node:assert/strict'
import { Given, Then } from '@cucumber/cucumber'

Given('I am on the home page', async function () {
  await this.attach(
    `Base URL: ${this.pageObjects.homePage.baseUrl}`,
    'text/plain'
  )
  await this.pageObjects.homePage.open()
})

Then('the page title should be {string}', async function (expectedTitle) {
  const title = await this.page.title()
  assert.equal(title, expectedTitle)
})
