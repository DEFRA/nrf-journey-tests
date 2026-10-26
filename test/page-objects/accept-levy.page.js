import { Page } from './page.js'

class AcceptLevyPage extends Page {
  get levyAmountHeadings() {
    return this.page.getByRole('heading', { level: 3 })
  }

  async selectAnswer(answer) {
    await this.page.getByRole('radio', { name: answer }).click()
  }
}

export { AcceptLevyPage }
