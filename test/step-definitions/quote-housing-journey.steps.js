import path from 'node:path'
import { Given, When } from '@cucumber/cucumber'

Given('I am on the start page', async function () {
  await this.pageObjects.homePage.open()
})

When('I start a new quote', async function () {
  await this.pageObjects.homePage.startNow()
})

When('I select {string} as my boundary type', async function (boundaryType) {
  await this.pageObjects.boundaryTypePage.selectBoundaryType(boundaryType)
})

When(
  'I upload {string} as my boundary file',
  { timeout: 60_000 },
  async function (filename) {
    const filePath = path.resolve(filename)
    await this.pageObjects.uploadBoundaryPage.uploadFile(filePath)
  }
)

When(
  'I save and continue on the boundary preview',
  { timeout: 60_000 },
  async function () {
    await this.pageObjects.uploadPreviewMapPage.saveAndContinueButton.waitFor({
      state: 'visible'
    })
    await this.pageObjects.uploadPreviewMapPage.saveAndContinue()
  }
)
