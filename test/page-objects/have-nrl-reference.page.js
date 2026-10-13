import { Page } from './page.js'

class HaveNrlReferencePage extends Page {
  open() {
    return super.open('/request-to-use/have-nrl-reference')
  }

  async selectOption(label) {
    await this.page.getByRole('radio', { name: label }).click()
  }
}

export { HaveNrlReferencePage }
