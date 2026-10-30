import { Page } from './page.js'

class RequestToUseDeleteQuotePage extends Page {
  open() {
    return super.open('/request-to-use/delete-quote')
  }

  get deleteButton() {
    return this.page.getByRole('button', { name: 'Delete' })
  }

  get cancelLink() {
    return this.page.getByRole('link', { name: 'Cancel' })
  }
}

export { RequestToUseDeleteQuotePage }
