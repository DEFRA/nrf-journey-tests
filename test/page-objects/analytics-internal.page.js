import { Page } from './page.js'

class AnalyticsInternalPage extends Page {
  open() {
    return this.page.goto(`${this.baseUrl}/analytics-internal`, {
      waitUntil: 'domcontentloaded'
    })
  }

  async disableAnalytics() {
    await this.page.getByRole('radio', { name: 'No' }).click()
    await this.page.getByRole('button', { name: 'Save' }).click()
  }
}

export { AnalyticsInternalPage }
