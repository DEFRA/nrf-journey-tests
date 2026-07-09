import { Page } from './page.js'

class ConfirmHousingPage extends Page {
  open() {
    return super.open('/quote/confirm-housing')
  }

  async selectYes() {
    await this.page.getByRole('radio', { name: 'Yes' }).click()
  }
}

export { ConfirmHousingPage }
