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
}

export { WasteWaterPage }
