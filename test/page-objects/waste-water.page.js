import { Page } from './page.js'

class WasteWaterPage extends Page {
  open() {
    return super.open('/quote/waste-water')
  }

  async selectOption(label) {
    await this.page.getByLabel(label).check()
  }

  async getOptionLabels() {
    const items = this.page.locator('.govuk-radios__label')
    return items.allTextContents()
  }

  async getOptionHints() {
    const hints = this.page.locator('.govuk-radios__hint')
    return hints.allTextContents()
  }

  async selectFirstAvailableOption() {
    const labels = await this.getOptionLabels()
    const firstOption = labels
      .map((label) => label.trim())
      .find((label) => label && !label.includes("I don't know"))
    if (!firstOption) {
      throw new Error(
        'No waste water treatment works options available to select'
      )
    }
    await this.selectOption(firstOption)
    return firstOption
  }
}

export { WasteWaterPage }
