import { Page } from './page.js'

class BoundaryTypePage extends Page {
  open() {
    return super.open('/quote/boundary-type')
  }

  async selectBoundaryType(type) {
    await this.page.getByRole('radio', { name: type }).click()
  }
}

export { BoundaryTypePage }
