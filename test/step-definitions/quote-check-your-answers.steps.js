import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'

Given(
  'I have completed a {string} quote up to check your answers',
  { timeout: 60000 },
  async function (devType) {
    await this.pageObjects.boundaryTypePage.open()
    await this.pageObjects.boundaryTypePage.selectBoundaryType('Draw on a map')
    await this.page.getByRole('button', { name: 'Continue' }).click()
    await this.pageObjects.developmentTypesPage.open()

    if (devType === 'Housing' || devType === 'Housing and Other residential') {
      await this.pageObjects.developmentTypesPage.selectDevelopmentType(
        'Housing'
      )
    }
    if (
      devType === 'Other residential' ||
      devType === 'Housing and Other residential'
    ) {
      await this.pageObjects.developmentTypesPage.selectDevelopmentType(
        'Other residential'
      )
    }
    await this.pageObjects.developmentTypesPage.continue()

    if (devType === 'Housing' || devType === 'Housing and Other residential') {
      await this.pageObjects.residentialPage.fillResidentialUnits('10')
      await this.page.getByRole('button', { name: 'Continue' }).click()
    }

    if (
      devType === 'Other residential' ||
      devType === 'Housing and Other residential'
    ) {
      await this.pageObjects.peopleCountPage.fillPeopleCount('50')
      await this.page.getByRole('button', { name: 'Continue' }).click()

      await this.pageObjects.wasteWaterPage.selectOption(
        "I don't know the waste water treatment works yet"
      )
      await this.page.getByRole('button', { name: 'Continue' }).click()
    }

    await this.pageObjects.emailPage.fillEmail('test@example.com')
    await this.page.getByRole('button', { name: 'Continue' }).click()
  }
)

When('I click the change link for {string}', async function (key) {
  await this.pageObjects.checkYourAnswersPage.changeLink(key).click()
})

Then(
  'the {string} row should show {string}',
  async function (key, expectedValue) {
    const rowValue = this.pageObjects.checkYourAnswersPage.summaryRowValue(key)
    await rowValue.waitFor({ state: 'visible' })
    const text = await rowValue.textContent()
    assert.ok(
      text.includes(expectedValue),
      `Expected "${key}" row to contain "${expectedValue}" but got "${text.trim()}"`
    )
  }
)

Then(
  'the email field should be pre-filled with {string}',
  async function (expectedEmail) {
    const input = this.pageObjects.emailPage.emailInput
    await input.waitFor({ state: 'visible' })
    const value = await input.inputValue()
    assert.equal(value, expectedEmail)
  }
)

Then('the {string} checkbox should be checked', async function (checkboxLabel) {
  const checkbox = this.page.getByRole('checkbox', { name: checkboxLabel })
  await checkbox.waitFor({ state: 'visible' })
  assert.ok(
    await checkbox.isChecked(),
    `Expected "${checkboxLabel}" checkbox to be checked`
  )
})
