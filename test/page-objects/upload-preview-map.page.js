import { Page } from './page.js'

class UploadPreviewMapPage extends Page {
  open() {
    return super.open('/quote/upload-preview-map')
  }

  get saveAndContinueButton() {
    return this.page.getByRole('button', { name: 'Save and continue' })
  }

  async saveAndContinue() {
    await this.saveAndContinueButton.click()
  }
}

export { UploadPreviewMapPage }
