import { Page } from './page.js'

class QuoteNotMatchedPage extends Page {
  open() {
    return super.open('/request-to-use/quote-not-matched')
  }
}

export { QuoteNotMatchedPage }
