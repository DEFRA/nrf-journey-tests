import { Page } from './page.js'

class QuoteDetailsPage extends Page {
  async visit(url) {
    await this.page.goto(url)
  }
}

export { QuoteDetailsPage }
