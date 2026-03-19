import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'

Given(
  'I am on the people count page for an Other residential development',
  async function () {
    await this.pageObjects.boundaryTypePage.open()
    await this.pageObjects.boundaryTypePage.selectBoundaryType('Draw on a map')
    await this.page.getByRole('button', { name: 'Continue' }).click()
    await this.pageObjects.developmentTypesPage.open()
    await this.pageObjects.developmentTypesPage.selectDevelopmentType(
      'Other residential'
    )
    await this.pageObjects.developmentTypesPage.continue()
  }
)

When('I click the Back link', async function () {
  await this.page.getByRole('link', { name: 'Back' }).click()
})

Then('the people count field should contain {string}', async function (value) {
  const inputValue =
    await this.pageObjects.peopleCountPage.peopleCountInput.inputValue()
  assert.equal(inputValue, value)
})

Then('I should see the error {string}', async function (message) {
  const errorSummary = this.page.locator('.govuk-error-summary')
  await errorSummary.waitFor({ state: 'visible' })
  assert.ok((await errorSummary.textContent()).includes(message))
})
