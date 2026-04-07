import { Page } from './page.js'

class WasteWaterPage extends Page {
  open() {
    return super.open('/quote/waste-water')
  }

  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue' })
  }

  get errorSummary() {
    return this.page.locator('.govuk-error-summary')
  }

  get errorSummaryBody() {
    return this.page.locator('.govuk-error-summary__body')
  }

  get radioItems() {
    return this.page.locator('.govuk-radios__item')
  }

  get radioInputs() {
    return this.page.locator('input[type="radio"]')
  }

  async selectOption(label) {
    await this.page.getByLabel(label).check()
  }

  async continue() {
    await this.continueButton.click()
  }

  async getOptionLabels() {
    const items = this.page.locator('.govuk-radios__label')
    return items.allTextContents()
  }

  async getOptionHints() {
    const hints = this.page.locator('.govuk-radios__hint')
    return hints.allTextContents()
  }

  async getSelectedOption() {
    const checked = this.page.locator('input[type="radio"]:checked')
    if ((await checked.count()) === 0) return null
    const id = await checked.getAttribute('id')
    const label = this.page.locator(`label[for="${id}"]`)
    return label.textContent()
  }
}

export { WasteWaterPage }
