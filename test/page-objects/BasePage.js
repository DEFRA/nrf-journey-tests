export class BasePage {
  constructor(page, baseUrl) {
    this.page = page
    this.baseUrl = baseUrl
  }

  async goto(path) {
    await this.page.goto(`${this.baseUrl}${path}`)
  }

  async click(selector) {
    await this.page.locator(selector).click()
  }

  async fill(selector, value) {
    await this.page.locator(selector).fill(value)
  }

  async text(selector) {
    return this.page.locator(selector).textContent()
  }

  async waitFor(selector, state = 'visible') {
    await this.page.locator(selector).waitFor({ state })
  }

  async title() {
    return this.page.title()
  }
}
