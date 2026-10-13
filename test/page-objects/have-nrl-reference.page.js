import { Page } from './page.js'

class HaveNrlReferencePage extends Page {
  open() {
    return super.open('/request-to-use/have-nrl-reference')
  }

  async selectAnswer(answer) {
    await this.page.getByRole('radio', { name: answer }).click()
  }
}

export { HaveNrlReferencePage }
