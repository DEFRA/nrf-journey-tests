import { Page } from './page.js'

class EmailConfirmationPage extends Page {
  open() {
    return super.open('/request-to-use/email-confirmation')
  }

  get panelTitle() {
    return this.page.locator('.govuk-panel__title')
  }
}

export { EmailConfirmationPage }
