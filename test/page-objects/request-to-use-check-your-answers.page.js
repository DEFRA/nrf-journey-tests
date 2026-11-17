import { Page } from './page.js'

class RequestToUseCheckYourAnswersPage extends Page {
  open() {
    return super.open('/request-to-use/check-your-answers')
  }

  get submitButton() {
    return this.page.getByRole('button', { name: 'Confirm and submit' })
  }

  get confirmationCheckbox() {
    return this.page.getByRole('checkbox')
  }

  get deleteQuoteDetailsLink() {
    // The accessible name concatenates without the space around the
    // visually-hidden span, so match with a regex.
    return this.page.getByRole('link', { name: /^Delete\s*quote details$/ })
  }

  async submit() {
    await this.submitButton.click()
  }

  async confirm() {
    await this.confirmationCheckbox.check()
    await this.submitButton.click()
  }
}

export { RequestToUseCheckYourAnswersPage }
