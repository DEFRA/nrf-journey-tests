import { Page } from './page.js'

class EnterAddressPage extends Page {
  open() {
    return super.open('/request-to-use/enter-address')
  }

  get signOutLink() {
    return this.page.getByRole('link', { name: 'Sign out' })
  }

  get signedInAs() {
    return this.page.getByText(/^You are signed in as /)
  }

  get representing() {
    return this.page.getByText(/^You are representing /)
  }
}

export { EnterAddressPage }
