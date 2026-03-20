import { Page } from './page.js'

class DeleteQuotePage extends Page {
  open() {
    return super.open('/quote/delete-quote')
  }

  get yesButton() {
    return this.page.getByRole('button', { name: 'Yes' })
  }

  get noLink() {
    return this.page.getByRole('link', { name: 'No' })
  }

  async clickYes() {
    await this.yesButton.click()
  }

  async clickNo() {
    await this.noLink.click()
  }
}

export { DeleteQuotePage }
