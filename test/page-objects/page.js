import { BasePage } from './BasePage.js'

class Page extends BasePage {
  get pageHeading() {
    return this.page.locator('h1')
  }

  get phaseBanner() {
    return this.page.getByRole('region', { name: 'Service phase' })
  }

  async open(path) {
    return this.goto(path)
  }
}

export { Page }
