import { Page } from './page.js'

class AcceptLevyPage extends Page {
  open() {
    return super.open('/request-to-use/accept-levy')
  }

  async acceptAmount() {
    await this.page
      .getByRole('radio', { name: 'Yes, accept this amount' })
      .click()
  }

  async declineAmount() {
    await this.page
      .getByRole('radio', { name: 'No, delete my quote details' })
      .click()
  }

  get provisionalAmountHeading() {
    return this.page.getByRole('heading', {
      name: /^Provisional nature restoration levy amount:/
    })
  }

  get inflationAdjustedAmountHeading() {
    return this.page.getByRole('heading', {
      name: /^Inflation-adjusted nature restoration levy amount:/
    })
  }
}

export { AcceptLevyPage }
