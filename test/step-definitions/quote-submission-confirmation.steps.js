import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'

Given('I am on the development types page', async function () {
  await this.pageObjects.boundaryTypePage.open()
  await this.pageObjects.boundaryTypePage.selectBoundaryType('Draw on a map')
  await this.page.getByRole('button', { name: 'Continue' }).click()
  await this.pageObjects.developmentTypesPage.open()
})

When('I select {string}', async function (type) {
  await this.pageObjects.developmentTypesPage.selectDevelopmentType(type)
})

When('I continue', async function () {
  await this.page.getByRole('button', { name: 'Continue' }).click()
})

When('I enter {string} residential units', async function (count) {
  await this.pageObjects.residentialPage.fillResidentialUnits(count)
})

When(
  'I enter {string} as the maximum number of people',
  async function (count) {
    await this.pageObjects.peopleCountPage.fillPeopleCount(count)
  }
)

When(
  'I select {string} as the waste water treatment works',
  async function (option) {
    await this.pageObjects.wasteWaterPage.selectOption(option)
  }
)

When('I enter {string} as my email', async function (email) {
  await this.pageObjects.emailPage.fillEmail(email)
})

When('I submit my answers', async function () {
  await this.pageObjects.checkYourAnswersPage.submit()
})

Then(
  'I should see the confirmation page',
  { timeout: 20_000 },
  async function () {
    const panelTitle = this.pageObjects.confirmationPage.panelTitle
    await panelTitle.waitFor({ state: 'visible' })
    const titleText = await panelTitle.textContent()
    assert.equal(titleText.trim(), 'Your details have been submitted')
  }
)

Then('I should see an NRF reference number', async function () {
  const panelBody = this.pageObjects.confirmationPage.panelBody
  await panelBody.waitFor({ state: 'visible' })
  const bodyText = await panelBody.textContent()
  assert.ok(bodyText.includes('NRF reference:'))
})

Then('I should see the {string} heading', async function (heading) {
  const h1 = this.page.locator('h1', { hasText: heading })
  await h1.waitFor({ state: 'visible' })
  assert.ok(await h1.isVisible())
})

Then('I should see the {string} section', async function (heading) {
  const sectionHeading = this.page.locator('h2', { hasText: heading })
  await sectionHeading.waitFor({ state: 'visible' })
  assert.ok(await sectionHeading.isVisible())
})

Then('I should see a message that I will receive an email', async function () {
  const message = this.pageObjects.confirmationPage.emailMessage
  await message.waitFor({ state: 'visible' })
  assert.ok(await message.isVisible())
})

Given('I have submitted a Housing development quote', async function () {
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
  await this.pageObjects.checkYourAnswersPage.submit()
  await this.pageObjects.confirmationPage.panelTitle.waitFor({
    state: 'visible'
  })
})

When('I navigate back in the browser', async function () {
  await this.page.goBack()
})

When('I navigate to the check your answers page', async function () {
  await this.pageObjects.checkYourAnswersPage.open()
})

Then('I should be on the start page', async function () {
  const heading = this.pageObjects.homePage.pageHeading
  await heading.waitFor({ state: 'visible' })
  assert.equal((await heading.textContent()).trim(), 'Nature Restoration Fund')
})
