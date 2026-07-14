import { Page } from './page.js'

class NoEdpPage extends Page {
  open() {
    return super.open('/quote/no-edp')
  }

  get bodyText() {
    return this.page.getByText(
      'Please use the existing Habitat Regulations to meet your environmental obligations.'
    )
  }
}

export { NoEdpPage }
