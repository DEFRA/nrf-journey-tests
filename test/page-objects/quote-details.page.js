import { Page } from './page.js'

class QuoteDetailsPage extends Page {
  async visit(url) {
    await this.page.goto(url)
  }

  // Open the link in a fresh session: a view is only counted when the request
  // arrives without a valid quote_session cookie, so clearing cookies first
  // forces the access token to consume another of its allotted views.
  async visitInFreshSession(url) {
    await this.page.context().clearCookies()
    await this.page.goto(url)
  }

  async requestNewLink() {
    await this.page.getByRole('button', { name: 'Send me a new link' }).click()
  }

  async requestNewLinkForEmail(email) {
    await this.page
      .getByLabel('Enter the email address you used for the quote')
      .fill(email)
    await this.page.getByRole('button', { name: 'Send new link' }).click()
  }
}

export { QuoteDetailsPage }
