import { Page } from './page.js'

class UploadBoundaryPage extends Page {
  open() {
    return super.open('/quote/upload-boundary')
  }

  get fileInput() {
    return this.page.getByLabel('Upload a red line boundary file')
  }

  async uploadFile(filePath) {
    await this.fileInput.setInputFiles(filePath)
    await this.page.getByRole('button', { name: 'Continue' }).click()
  }
}

export { UploadBoundaryPage }
