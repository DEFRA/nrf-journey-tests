import { BasePage } from './BasePage.js'

class Page extends BasePage {
  get pageHeading() {
    return this.page.locator('h1')
  }

  async open(path) {
    return this.goto(path)
  }
}

export { Page }
