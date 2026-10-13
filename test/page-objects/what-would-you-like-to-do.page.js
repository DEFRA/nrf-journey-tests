import { Page } from './page.js'

class WhatWouldYouLikeToDoPage extends Page {
  open() {
    return super.open('/manage/what-would-you-like-to-do')
  }

  async selectOption(label) {
    await this.page.getByRole('radio', { name: label }).click()
  }
}

export { WhatWouldYouLikeToDoPage }
