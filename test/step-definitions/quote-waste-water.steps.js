import assert from 'node:assert/strict'
import path from 'node:path'
import { Given, When, Then } from '@cucumber/cucumber'

Given(
  'I have navigated to the waste water treatment works page',
  { timeout: 60_000 },
  async function () {
    const geojsonPath = path.resolve(
      'test/fixtures/BnW_small_under_1_hectare.geojson'
    )

    await this.pageObjects.boundaryTypePage.open()
    await this.pageObjects.boundaryTypePage.selectBoundaryType('Upload a file')
    await this.page.getByRole('button', { name: 'Continue' }).click()
    await this.pageObjects.uploadBoundaryPage.uploadFile(geojsonPath)

    await this.pageObjects.uploadPreviewMapPage.saveAndContinueButton.waitFor({
      state: 'visible'
    })
    await this.pageObjects.uploadPreviewMapPage.saveAndContinue()

    await this.pageObjects.developmentTypesPage.selectDevelopmentType('Housing')
    await this.pageObjects.developmentTypesPage.continue()

    await this.pageObjects.residentialPage.fillResidentialUnits('10')
    await this.page.getByRole('button', { name: 'Continue' }).click()

    await this.pageObjects.wasteWaterPage.pageHeading.waitFor({
      state: 'visible'
    })
  }
)

Then(
  'the waste water treatment works options should be listed',
  async function () {
    const labels = await this.pageObjects.wasteWaterPage.getOptionLabels()
    assert.ok(
      labels.length > 0,
      'Expected at least one waste water treatment works option'
    )
  }
)

Then(
  'I should see more than {int} waste water treatment works option',
  async function (minCount) {
    const labels = await this.pageObjects.wasteWaterPage.getOptionLabels()
    const wwtwOptions = labels.filter(
      (label) =>
        !label.includes("I don't know the waste water treatment works yet")
    )
    assert.ok(
      wwtwOptions.length > minCount,
      `Expected more than ${minCount} WWTW options but found ${wwtwOptions.length}`
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

Then('only one option can be selected at a time', async function () {
  const radioInputs = this.pageObjects.wasteWaterPage.radioInputs
  const count = await radioInputs.count()
  for (let i = 0; i < count; i++) {
    const type = await radioInputs.nth(i).getAttribute('type')
    assert.equal(type, 'radio', 'Expected all inputs to be radio buttons')
  }
  const names = new Set()
  for (let i = 0; i < count; i++) {
    names.add(await radioInputs.nth(i).getAttribute('name'))
  }
  assert.equal(
    names.size,
    1,
    'Expected all radio buttons to share the same name'
  )
})

Then('I should see the {string} option', async function (optionText) {
  const label = this.page.getByLabel(optionText)
  await label.waitFor({ state: 'visible' })
  assert.ok(
    await label.isVisible(),
    `Expected "${optionText}" option to be visible`
  )
})

When(
  'I select the first waste water treatment works option',
  async function () {
    const labels = await this.pageObjects.wasteWaterPage.getOptionLabels()
    const wwtwOptions = labels.filter(
      (label) =>
        !label.includes("I don't know the waste water treatment works yet")
    )
    assert.ok(
      wwtwOptions.length > 0,
      'Expected at least one WWTW option to select'
    )
    this.selectedWwtw = wwtwOptions[0].trim()
    await this.pageObjects.wasteWaterPage.selectOption(this.selectedWwtw)
  }
)

Then(
  'I should see a validation error {string}',
  async function (expectedMessage) {
    await this.page.waitForLoadState('load')
    const errorSummary = this.pageObjects.wasteWaterPage.errorSummary
    await errorSummary.waitFor({ state: 'visible' })
    const errorText =
      await this.pageObjects.wasteWaterPage.errorSummaryBody.textContent()
    assert.ok(
      errorText.includes(expectedMessage),
      `Expected error message "${expectedMessage}" but got "${errorText.trim()}"`
    )
  }
)

Then('the {string} option should be selected', async function (expectedOption) {
  const selected = await this.pageObjects.wasteWaterPage.getSelectedOption()
  assert.ok(selected !== null, 'Expected an option to be selected')
  assert.ok(
    selected.trim().includes(expectedOption),
    `Expected "${expectedOption}" to be selected but got "${selected.trim()}"`
  )
})

Then('the {string} option should not be selected', async function (optionText) {
  const radio = this.page.getByLabel(optionText)
  await radio.waitFor({ state: 'visible' })
  const isChecked = await radio.isChecked()
  assert.equal(isChecked, false, `Expected "${optionText}" to not be selected`)
})

When(
  'I upload a different boundary file',
  { timeout: 60_000 },
  async function () {
    await this.pageObjects.boundaryTypePage.open()
    await this.pageObjects.boundaryTypePage.selectBoundaryType('Upload a file')
    await this.page.getByRole('button', { name: 'Continue' }).click()

    const filePath = path.resolve(
      'test/fixtures/BnW_small_under_1_hectare.geojson'
    )
    await this.pageObjects.uploadBoundaryPage.uploadFile(filePath)

    await this.pageObjects.uploadPreviewMapPage.saveAndContinueButton.waitFor({
      state: 'visible'
    })
    await this.pageObjects.uploadPreviewMapPage.saveAndContinue()
  }
)

When(
  'I navigate through the quote to the waste water treatment works page',
  async function () {
    await this.pageObjects.developmentTypesPage.selectDevelopmentType('Housing')
    await this.pageObjects.developmentTypesPage.continue()

    await this.pageObjects.residentialPage.fillResidentialUnits('10')
    await this.page.getByRole('button', { name: 'Continue' }).click()

    await this.pageObjects.wasteWaterPage.pageHeading.waitFor({
      state: 'visible'
    })
  }
)

Then(
  'no waste water treatment works option should be selected',
  async function () {
    const selected = await this.pageObjects.wasteWaterPage.getSelectedOption()
    assert.equal(selected, null, 'Expected no option to be selected')
  }
)

Then(
  'the previously selected waste water treatment works should be cleared',
  async function () {
    assert.ok(
      this.selectedWwtw,
      'No WWTW was previously selected in this scenario'
    )
    const radio = this.page.getByLabel(this.selectedWwtw)
    await radio.waitFor({ state: 'visible' })
    const isChecked = await radio.isChecked()
    assert.equal(
      isChecked,
      false,
      `Expected "${this.selectedWwtw}" to no longer be selected after boundary change`
    )
  }
)
