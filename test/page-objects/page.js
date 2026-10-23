import { BasePage } from './BasePage.js'

class Page extends BasePage {
  get pageHeading() {
    return this.page.locator('h1')
  }

  async open(path) {
    return this.goto(path)
  }

  // Keys must match exactly: one key can be a substring of another
  // ("Housing" is contained in "Number of housing units"), which
  // would otherwise resolve to two rows.
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

export { Page }
