import assert from 'node:assert/strict'
import { Then, When } from '@cucumber/cucumber'

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

Then('I should see the {string} option', async function (optionText) {
  const label = this.page.getByLabel(optionText)
  await label.waitFor({ state: 'visible' })
  assert.ok(
    await label.isVisible(),
    `Expected "${optionText}" option to be visible`
  )
})
