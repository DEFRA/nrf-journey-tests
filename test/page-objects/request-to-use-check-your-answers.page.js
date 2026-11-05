import { Page } from './page.js'

class RequestToUseCheckYourAnswersPage extends Page {
  open() {
    return super.open('/request-to-use/check-your-answers')
  }

  get submitButton() {
    return this.page.getByRole('button', { name: 'Confirm and submit' })
  }

  async submit() {
    await this.submitButton.click()
  }
}

export { RequestToUseCheckYourAnswersPage }
