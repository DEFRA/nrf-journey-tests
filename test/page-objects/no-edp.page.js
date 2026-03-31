import { Page } from './page.js'

class NoEdpPage extends Page {
  open() {
    return super.open('/quote/no-edp')
  }

  get bodyText() {
    return this.page.getByText(
      'Other ways to mitigate environmental impact are:'
    )
  }
}

export { NoEdpPage }
