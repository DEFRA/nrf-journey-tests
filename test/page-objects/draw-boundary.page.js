import { Page } from './page.js'

class DrawBoundaryPage extends Page {
  open() {
    return super.open('/quote/draw-boundary')
  }

  get searchInput() {
    return this.page.getByRole('combobox', { name: 'Search' })
  }

  get doneButton() {
    return this.page
      .getByRole('button', { name: 'Done' })
      .and(this.page.locator(':not([disabled])'))
  }

  get saveAndContinueButton() {
    return this.page
      .getByRole('button', { name: 'Save and continue' })
      .and(this.page.locator(':not([disabled])'))
  }

  get mapContainer() {
    return this.page.locator('#draw-boundary-map')
  }

  async searchLocation(query) {
    const openSearch = this.page.locator('[aria-label="Open search"]')
    await openSearch.waitFor({ state: 'visible' })
    await openSearch.evaluate((el) => el.click())
    await this.searchInput.waitFor({ state: 'visible' })
    await this.searchInput.pressSequentially(query)
    await this.searchInput.press('ArrowDown')
    await this.searchInput.press('Enter')
  }

  async drawTriangleOnMap() {
    const drawButton = this.page.getByRole('button', { name: 'Draw' })
    await drawButton.waitFor({ state: 'visible' })
    await drawButton.focus()
    await this.page.keyboard.press('Enter')

    await this.page
      .getByRole('button', { name: 'Cancel' })
      .waitFor({ state: 'visible' })
    await this.page
      .locator('#draw-boundary-map-viewport')
      .waitFor({ state: 'visible' })
    // this is necessary as after Draw is pressed with a key, the map isn't
    // automatically focussed, so the keyboard plotting crosshair doesn't appear
    await this.page.evaluate(() =>
      document.getElementById('draw-boundary-map-viewport').focus()
    )

    // Place 3 points at map centre using Enter, panning between each with arrow keys
    await this.page.keyboard.press('Enter')
    for (let i = 0; i < 10; i++) await this.page.keyboard.press('ArrowRight')
    await this.page.keyboard.press('Enter')
    for (let i = 0; i < 10; i++) await this.page.keyboard.press('ArrowDown')
    await this.page.keyboard.press('Enter')

    await this.doneButton.waitFor({ state: 'visible', timeout: 10_000 })
    await this.doneButton.click()

    await this.saveAndContinueButton.waitFor({
      state: 'visible',
      timeout: 20_000
    })
    await this.saveAndContinueButton.click()
  }
}

export { DrawBoundaryPage }
