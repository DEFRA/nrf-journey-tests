import { Page } from './page.js'

class LinkExpiredPage extends Page {
  async getNewLink() {
    await this.page.getByRole('button', { name: 'Get a new link' }).click()
  }
}

export { LinkExpiredPage }
