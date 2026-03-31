import { Page } from './page.js'

class WasteWaterPage extends Page {
  open() {
    return super.open('/quote/waste-water')
  }

  async selectOption(label) {
    await this.page.getByLabel(label).check()
  }
}

export { WasteWaterPage }
