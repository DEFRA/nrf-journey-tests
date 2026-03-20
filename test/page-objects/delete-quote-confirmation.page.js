import { Page } from './page.js'

class DeleteQuoteConfirmationPage extends Page {
  open() {
    return super.open('/quote/delete-quote-confirmation')
  }

  get panelTitle() {
    return this.page.locator('.govuk-panel__title')
  }
}

export { DeleteQuoteConfirmationPage }
