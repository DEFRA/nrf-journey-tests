import { Page } from './page.js'

class EnterNrlReferencePage extends Page {
  open(pathAndQuery = '/request-to-use/enter-nrl-reference') {
    return super.open(pathAndQuery)
  }

  get prefilledReference() {
    return this.nrlReferenceInput.inputValue()
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
