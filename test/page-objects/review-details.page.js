import { Page } from './page.js'

class ReviewDetailsPage extends Page {
  open() {
    return super.open('/request-to-use/review-details')
  }

  confirm() {
    return this.page.getByRole('button', { name: 'Confirm' }).click()
  }
}

export { ReviewDetailsPage }
