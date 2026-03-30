import { Page } from './page.js'

class CheckYourAnswersPage extends Page {
  open() {
    return super.open('/quote/check-your-answers')
  }

  get submitButton() {
    return this.page.getByRole('button', { name: 'Submit' })
  }

  get deleteLink() {
    return this.page.getByRole('button', { name: 'Delete' })
  }

  summaryRowValue(key) {
    return this.page
      .locator('.govuk-summary-list__row', {
        has: this.page.locator('.govuk-summary-list__key', { hasText: key })
      })
      .locator('.govuk-summary-list__value')
  }

  changeLink(key) {
    return this.page
      .locator('.govuk-summary-list__row', {
        has: this.page.locator('.govuk-summary-list__key', { hasText: key })
      })
      .getByRole('link', { name: /Change/ })
  }

  async submit() {
    await this.submitButton.click()
  }

  async delete() {
    await this.deleteLink.click()
  }
}

export { CheckYourAnswersPage }
