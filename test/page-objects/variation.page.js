import { Page } from './page.js'

class VariationPage extends Page {
  open() {
    return super.open('/request-to-use/variation')
  }

  async selectAnswer(answer) {
    await this.page.getByRole('radio', { name: answer, exact: true }).click()
  }

  async chooseNo() {
    await this.selectAnswer('No')
  }
}

export { VariationPage }
