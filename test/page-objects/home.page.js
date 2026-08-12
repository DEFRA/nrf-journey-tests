import { Page } from './page.js'

class HomePage extends Page {
  open() {
    return super.open('/manage/start-page')
  }

  get startNowButton() {
    return this.page.getByRole('button', { name: 'Start now' })
  }

  get rejectCookiesButton() {
    return this.page.getByRole('button', { name: 'Reject analytics cookies' })
  }

  async rejectCookies() {
    await this.rejectCookiesButton.waitFor({ state: 'visible' })
    await this.rejectCookiesButton.click()
  }

  async startNow() {
    await this.startNowButton.click()
  }
}

export { HomePage }
