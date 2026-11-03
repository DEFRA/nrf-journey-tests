import { Page } from './page.js'

class OriginalReferencePage extends Page {
  open(pathAndQuery = '/request-to-use/original-reference') {
    return super.open(pathAndQuery)
  }

  get originalReferenceInput() {
    return this.page.getByLabel(
      'Enter the NRL reference for the original planning permission'
    )
  }

  async fillOriginalReference(reference) {
    await this.originalReferenceInput.waitFor({ state: 'visible' })
    await this.originalReferenceInput.fill(reference)
  }
}

export { OriginalReferencePage }
