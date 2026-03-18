import { Page } from './page.js'

class ResidentialPage extends Page {
  open() {
    return super.open('/quote/residential')
  }

  get residentialUnitsInput() {
    return this.page.locator('#residentialBuildingCount')
  }

  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue' })
  }

  async fillResidentialUnits(count) {
    await this.residentialUnitsInput.fill(count)
  }

  async continue() {
    await this.continueButton.click()
  }
}

export { ResidentialPage }
