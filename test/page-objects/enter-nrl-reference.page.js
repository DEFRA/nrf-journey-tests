import { Page } from './page.js'

class EnterNrlReferencePage extends Page {
  open() {
    return super.open('/request-to-use/enter-nrl-reference')
  }

  get nrlReferenceInput() {
    return this.page.getByLabel('Enter your NRL reference')
  }

  async fillNrlReference(reference) {
    await this.nrlReferenceInput.waitFor({ state: 'visible' })
    await this.nrlReferenceInput.fill(reference)
  }
}

export { EnterNrlReferencePage }
