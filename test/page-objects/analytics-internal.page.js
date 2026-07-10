import { Page } from './page.js'

class AnalyticsInternalPage extends Page {
  open() {
    return super.open('/analytics-internal')
  }

  async disableAnalytics() {
    await this.page.getByRole('radio', { name: 'No' }).click()
    await this.page.getByRole('button', { name: 'Save' }).click()
  }
}

export { AnalyticsInternalPage }
