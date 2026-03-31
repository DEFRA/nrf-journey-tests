import { Page } from './page.js'

class HomePage extends Page {
  open() {
    return super.open('/')
  }

  get startNowButton() {
    return this.page.getByRole('button', { name: 'Start now' })
  }

  async startNow() {
    await this.startNowButton.click()
  }
}

export { HomePage }
