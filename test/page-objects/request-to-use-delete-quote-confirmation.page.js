import { Page } from './page.js'

class RequestToUseDeleteQuoteConfirmationPage extends Page {
  open() {
    return super.open('/request-to-use/delete-quote-confirmation')
  }

  get panelTitle() {
    return this.page.locator('.govuk-panel__title')
  }
}

export { RequestToUseDeleteQuoteConfirmationPage }
