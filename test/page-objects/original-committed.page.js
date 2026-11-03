import { Page } from './page.js'

class OriginalCommittedPage extends Page {
  open() {
    return super.open('/request-to-use/original-committed')
  }

  async selectAnswer(answer) {
    await this.page.getByRole('radio', { name: answer, exact: true }).click()
  }

  async chooseNo() {
    await this.selectAnswer('No')
  }
}

export { OriginalCommittedPage }
