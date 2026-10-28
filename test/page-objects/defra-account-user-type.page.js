import { Page } from './page.js'

class DefraAccountUserTypePage extends Page {
  open() {
    return super.open('/request-to-use/defra-account-user-type')
  }

  async selectAnswer(answer) {
    await this.page.getByRole('radio', { name: answer }).click()
  }
}

export { DefraAccountUserTypePage }
