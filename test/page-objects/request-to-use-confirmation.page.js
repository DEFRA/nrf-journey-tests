import { Page } from './page.js'

class RequestToUseConfirmationPage extends Page {
  open() {
    return super.open('/request-to-use/confirmation')
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

  get signOutLink() {
    return this.page.getByRole('link', { name: 'Sign out' })
  }
}

export { RequestToUseConfirmationPage }
