import { Page } from './page.js'

class ReadThisPage extends Page {
  open() {
    return super.open('/request-to-use/read-this')
  }

  get provisionalAmountHeading() {
    return this.page.getByRole('heading', {
      name: /^Provisional nature restoration levy amount:/
    })
  }

  get inflationAdjustedAmountHeading() {
    return this.page.getByRole('heading', {
      name: /^Inflation-adjusted nature restoration levy amount:/
    })
  }

  get emailLink() {
    return this.page.getByRole('link', {
      name: 'enquiries@naturalengland.org.uk'
    })
  }

  get habitatsLink() {
    return this.page.getByRole('link', {
      name: 'habitats regulations assessment (opens in new tab)'
    })
  }

  get callChargesLink() {
    return this.page.getByRole('link', {
      name: 'Find out about call charges (opens in new tab)'
    })
  }

  get instalmentPlansLink() {
    return this.page.getByRole('link', {
      name: 'Read about nature restoration levy instalment plans (opens in new tab)'
    })
  }
}

export { ReadThisPage }
