import { Page } from './page.js'

class PeopleCountPage extends Page {
  open() {
    return super.open('/quote/people-count')
  }

  get peopleCountInput() {
    return this.page.locator('[name="peopleCount"]')
  }

  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue' })
  }

  async fillPeopleCount(count) {
    await this.peopleCountInput.fill(count)
  }

  async continue() {
    await this.continueButton.click()
  }
}

export { PeopleCountPage }
