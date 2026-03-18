import { Page } from './page.js'

class ConfirmationPage extends Page {
  open() {
    return super.open('/quote/confirmation')
  }

  get panelTitle() {
    return this.page.locator('.govuk-panel__title')
  }

  get panelBody() {
    return this.page.locator('.govuk-panel__body')
  }

  get whatHappensNextHeading() {
    return this.page.locator('h2', { hasText: 'What happens next' })
  }

  get emailMessage() {
    return this.page.getByText(
      'You will receive an email with details of the quote.'
    )
  }
}

export { ConfirmationPage }
