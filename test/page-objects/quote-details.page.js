import { Page } from './page.js'

class QuoteDetailsPage extends Page {
  async visit(url) {
    await this.page.goto(url)
  }

  async requestNewLinkForEmail(email) {
    await this.page
      .getByLabel('Enter the email address you used for the quote')
      .fill(email)
    await this.page.getByRole('button', { name: 'Send new link' }).click()
  }
}

export { QuoteDetailsPage }
