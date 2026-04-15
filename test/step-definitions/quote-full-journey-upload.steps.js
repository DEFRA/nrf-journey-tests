import assert from 'node:assert/strict'
import path from 'node:path'
import { Given, When, Then } from '@cucumber/cucumber'

Given('I am on the start page', async function () {
  await this.pageObjects.homePage.open()
})

When('I start a new quote', async function () {
  await this.pageObjects.homePage.startNow()
})

When('I select {string} as my boundary type', async function (boundaryType) {
  await this.pageObjects.boundaryTypePage.selectBoundaryType(boundaryType)
})

When(
  'I upload {string} as my boundary file',
  { timeout: 60_000 },
  async function (filename) {
    const filePath = path.resolve(filename)
    await this.pageObjects.uploadBoundaryPage.uploadFile(filePath)
  }
)

When(
  'I save and continue on the boundary preview',
  { timeout: 60_000 },
  async function () {
    await this.pageObjects.uploadPreviewMapPage.saveAndContinueButton.waitFor({
      state: 'visible'
    })
    await this.pageObjects.uploadPreviewMapPage.saveAndContinue()
  }
)

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

When('I enter {string} as my email', async function (email) {
  await this.pageObjects.emailPage.fillEmail(email)
})

When('I submit my answers', async function () {
  await this.pageObjects.checkYourAnswersPage.submit()
})

When('I navigate back in the browser', async function () {
  await this.page.goBack()
})

When(
  'I select the first available waste water treatment works',
  async function () {
    this.selectedWasteWaterTreatmentWorks =
      await this.pageObjects.wasteWaterPage.selectFirstAvailableOption()
  }
)

Then(
  'I should see more than {int} waste water treatment works option',
  async function (minCount) {
    const labels = await this.pageObjects.wasteWaterPage.getOptionLabels()
    const options = labels.filter(
      (label) =>
        !label.includes("I don't know the waste water treatment works yet")
    )
    assert.ok(
      options.length > minCount,
      `Expected more than ${minCount} WWTW options but found ${options.length}`
    )
  }
)

Then(
  'each waste water treatment works option should show the distance from the development boundary',
  async function () {
    const hints = await this.pageObjects.wasteWaterPage.getOptionHints()
    assert.ok(hints.length > 0, 'Expected at least one hint with distance')
    for (const hint of hints) {
      assert.ok(
        hint.includes('km from the development boundary'),
        `Expected hint to contain distance but got "${hint.trim()}"`
      )
    }
  }
)

Then(
  'I should see my responses on the Check Your Answers page',
  async function () {
    const wwtw = this.selectedWasteWaterTreatmentWorks
    assert.ok(
      wwtw,
      'No waste water treatment works was previously selected in this scenario'
    )
    const cya = this.pageObjects.checkYourAnswersPage

    async function assertSummaryRow(page, key, expectedValue) {
      const rowValue = cya.summaryRowValue(key)
      await rowValue.waitFor({ state: 'visible' })
      const text = await rowValue.textContent()
      assert.ok(
        text.includes(expectedValue),
        `Expected "${key}" row to contain "${expectedValue}" but got "${text.trim()}"`
      )
    }

    await assertSummaryRow(this.page, 'Red line boundary', 'Uploaded')
    await assertSummaryRow(this.page, 'Development type', 'Housing')
    await assertSummaryRow(this.page, 'Development type', 'Other residential')
    await assertSummaryRow(this.page, 'Number of residential units', '10')
    await assertSummaryRow(this.page, 'Waste water treatment works', wwtw)
    await assertSummaryRow(this.page, 'Email address', 'test@example.com')
  }
)

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

Then('I should be on the start page', async function () {
  const heading = this.pageObjects.homePage.pageHeading
  await heading.waitFor({ state: 'visible' })
  assert.equal((await heading.textContent()).trim(), 'Nature Restoration Fund')
})
