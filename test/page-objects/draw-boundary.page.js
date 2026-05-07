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

  async #clickUntilDoneEnabled(cx, cy) {
    const maxAttempts = 5
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.page.mouse.click(cx, cy - 100)
      await this.page.mouse.click(cx + 100, cy + 100)
      await this.page.mouse.click(cx - 100, cy + 100)

      const enabled = await this.doneButton
        .waitFor({ state: 'visible', timeout: 3_000 })
        .then(() => true)
        .catch(() => false)

      if (enabled) return

      await this.page.keyboard.press('Escape')
      await this.page
        .getByRole('button', { name: 'Cancel' })
        .waitFor({ state: 'hidden' })
      const drawButton = this.page.getByRole('button', { name: 'Draw' })
      await drawButton.waitFor({ state: 'visible' })
      await drawButton.focus()
      await this.page.keyboard.press('Enter')
      await this.page
        .getByRole('button', { name: 'Cancel' })
        .waitFor({ state: 'visible' })
    }
  }

  get mapDrawContainer() {
    return this.page.locator('.maplibregl-map.mode-draw_polygon')
  }

  async drawTriangleOnMap() {
    const drawButton = this.page.getByRole('button', { name: 'Draw' })
    await drawButton.waitFor({ state: 'visible' })
    await drawButton.focus()
    await this.page.keyboard.press('Enter')

    await this.page
      .getByRole('button', { name: 'Cancel' })
      .waitFor({ state: 'visible' })

    await this.mapDrawContainer.waitFor({ state: 'visible', timeout: 10_000 })

    const box = await this.mapContainer.boundingBox()
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    await this.#clickUntilDoneEnabled(cx, cy)

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
