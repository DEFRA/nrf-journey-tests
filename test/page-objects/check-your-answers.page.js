import { Page } from './page.js'

class CheckYourAnswersPage extends Page {
  open() {
    return super.open('/quote/check-your-answers')
  }

  get submitButton() {
    return this.page.getByRole('button', { name: 'Submit' })
  }

  async submit() {
    await this.submitButton.click()
  }
}

export { CheckYourAnswersPage }
