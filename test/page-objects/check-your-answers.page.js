import { Page } from './page.js'

class CheckYourAnswersPage extends Page {
  open() {
    return super.open('/quote/check-your-answers')
  }

  get submitButton() {
    return this.page.getByRole('button', { name: 'Confirm and submit' })
  }

  get deleteLink() {
    return this.page.getByRole('link', { name: 'Delete' })
  }

  async submit() {
    await this.submitButton.click()
  }

  async delete() {
    await this.deleteLink.click()
  }
}

export { CheckYourAnswersPage }
