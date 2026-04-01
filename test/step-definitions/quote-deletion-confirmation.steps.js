import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'

Given('I have a quote ready to submit', async function () {
  await this.pageObjects.boundaryTypePage.open()
  await this.pageObjects.boundaryTypePage.selectBoundaryType('Draw on a map')
  await this.page.getByRole('button', { name: 'Continue' }).click()
  await this.pageObjects.developmentTypesPage.open()
  await this.pageObjects.developmentTypesPage.selectDevelopmentType('Housing')
  await this.page.getByRole('button', { name: 'Continue' }).click()
  await this.pageObjects.residentialPage.fillResidentialUnits('10')
  await this.page.getByRole('button', { name: 'Continue' }).click()
  await this.pageObjects.wasteWaterPage.selectOption(
    "I don't know the waste water treatment works yet"
  )
  await this.page.getByRole('button', { name: 'Continue' }).click()
  await this.pageObjects.emailPage.fillEmail('test@example.com')
  await this.page.getByRole('button', { name: 'Continue' }).click()
  await this.pageObjects.checkYourAnswersPage.pageHeading.waitFor({
    state: 'visible'
  })
})

When('I click the Delete button', async function () {
  await this.pageObjects.checkYourAnswersPage.delete()
})

Then('I should see the delete quote page', async function () {
  const heading = this.pageObjects.deleteQuotePage.pageHeading
  await heading.waitFor({ state: 'visible' })
  assert.equal(
    (await heading.textContent()).trim(),
    'Are you sure you want to delete this quote?'
  )
})

When('I click Yes to confirm deletion', async function () {
  await this.pageObjects.deleteQuotePage.clickYes()
})

Then('I should see the deletion confirmation page', async function () {
  const panel = this.pageObjects.deleteQuoteConfirmationPage.panelTitle
  await panel.waitFor({ state: 'visible' })
  assert.equal(
    (await panel.textContent()).trim(),
    'Your details have been deleted'
  )
})

When('I click No', async function () {
  await this.pageObjects.deleteQuotePage.clickNo()
})

Then('I should be on the check your answers page', async function () {
  const heading = this.pageObjects.checkYourAnswersPage.pageHeading
  await heading.waitFor({ state: 'visible' })
  assert.equal((await heading.textContent()).trim(), 'Check your answers')
})
