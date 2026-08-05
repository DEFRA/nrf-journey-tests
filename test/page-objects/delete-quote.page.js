import { Page } from './page.js'

class DeleteQuotePage extends Page {
  open() {
    return super.open('/quote/delete-quote')
  }

  get deleteButton() {
    return this.page.getByRole('button', { name: 'Delete' })
  }

  get cancelLink() {
    return this.page.getByRole('link', { name: 'Cancel' })
  }

  async clickYes() {
    await this.deleteButton.click()
  }

  async clickNo() {
    await this.cancelLink.click()
  }
}

export { DeleteQuotePage }
