import { Page } from './page.js'

class ReviewQuoteDetailsPage extends Page {
  // The key must match exactly: "Housing" is a substring of
  // "Number of housing units", which would resolve to two rows.
  row(key) {
    const exactKey = new RegExp(
      `^\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`
    )
    return this.page.locator('.govuk-summary-list__row').filter({
      has: this.page
        .locator('.govuk-summary-list__key')
        .filter({ hasText: exactKey })
    })
  }

  summaryRowValue(key) {
    return this.row(key).locator('.govuk-summary-list__value')
  }

  changeLink(key) {
    return this.row(key).getByRole('link', { name: /Change/ })
  }
}

export { ReviewQuoteDetailsPage }
