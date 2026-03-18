import { Page } from './page.js'

class DevelopmentTypesPage extends Page {
  open() {
    return super.open('/quote/development-types')
  }

  get housingCheckbox() {
    return this.page.getByRole('checkbox', { name: 'Housing' })
  }

  get otherResidentialCheckbox() {
    return this.page.getByRole('checkbox', { name: 'Other residential' })
  }

  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue' })
  }

  async selectDevelopmentType(type) {
    if (type === 'Housing') await this.housingCheckbox.check()
    if (type === 'Other residential')
      await this.otherResidentialCheckbox.check()
  }

  async continue() {
    await this.continueButton.click()
  }
}

export { DevelopmentTypesPage }
