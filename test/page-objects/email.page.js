import { Page } from './page.js'

class EmailPage extends Page {
  open() {
    return super.open('/quote/email')
  }

  get emailInput() {
    return this.page.getByLabel('Enter your email address')
  }

  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue' })
  }

  async fillEmail(email) {
    await this.emailInput.fill(email)
  }

  async continue() {
    await this.continueButton.click()
  }
}

export { EmailPage }
