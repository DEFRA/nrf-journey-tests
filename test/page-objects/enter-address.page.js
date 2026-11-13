import { Page } from './page.js'

class EnterAddressPage extends Page {
  open() {
    return super.open('/request-to-use/enter-address')
  }

  get signOutLink() {
    return this.page.getByRole('link', { name: 'Sign out' })
  }

  get fullNameInput() {
    return this.page.getByLabel('Full name')
  }

  async fillAddressDetails() {
    await this.page.getByLabel('Address line 1').fill('1 Development Road')
    await this.page.getByLabel('Address line 2 (optional)').fill('Building 2')
    await this.page.getByLabel('Town or city').fill('Development')
    await this.page.getByLabel('County (optional)').fill('Devonshire')
    // Lower case with no spacing on purpose: the service should accept and
    // normalise it.
    await this.page.getByLabel('Postcode').fill('dv16rp')
  }

  async fillDeveloperDetails() {
    await this.fullNameInput.fill('Trevor Barker')
    await this.fillAddressDetails()
  }

  confirm() {
    return this.page.getByRole('button', { name: 'Confirm' }).click()
  }
}

export { EnterAddressPage }
