import { Page } from './page.js'

class DrawBoundaryPage extends Page {
  open() {
    return super.open('/quote/draw-boundary')
  }

  get searchInput() {
    return this.page.getByRole('combobox', { name: 'Search' })
  }

  // The library sets aria-disabled="true" on the Done button until the drawn
  // polygon is valid (>= 3 distinct vertices forming a positive-area ring), and
  // removes the attribute entirely once valid. This is the app's own signal
  // that enough points have registered.
  get doneButtonEnabled() {
    return this.page
      .getByRole('button', { name: 'Done' })
      .and(this.page.locator(':not([aria-disabled="true"])'))
  }

  get saveAndContinueButton() {
    return this.page.getByRole('button', { name: 'Save and continue' })
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

    // Wait for the map to finish flying to the searched location before drawing.
    // Without this the triangle can be placed while the map is still at its
    // previous centre — which varies with test order — occasionally landing
    // outside any EDP and routing to the "levy not available" page. Waiting for
    // the tile requests triggered by the fly-to to settle anchors the draw to
    // the searched EDP location deterministically.
    await this.page.waitForLoadState('networkidle')
  }

  async drawTriangleOnMap() {
    const drawButton = this.page.getByRole('button', { name: 'Draw' })
    await drawButton.waitFor({ state: 'visible' })
    await drawButton.focus()
    await this.page.keyboard.press('Enter')

    await this.page
      .getByRole('button', { name: 'Cancel' })
      .waitFor({ state: 'visible' })

    // Place a triangle by pressing Enter at the map centre and panning between
    // points with arrow keys. A vertex is only accepted if it lands a minimum
    // distance from existing vertices; if the map is still settling after the
    // location search, a pan can be too small and the vertex is silently
    // dropped, leaving the Done button disabled. Pan generously and confirm the
    // Done button enables, adding extra spaced points if it hasn't.
    await this.placePoint()
    await this.panAndPlacePoint('ArrowRight')
    await this.panAndPlacePoint('ArrowDown')

    for (let attempt = 0; attempt < 5; attempt++) {
      if (await this.isDoneEnabled()) break
      await this.panAndPlacePoint(attempt % 2 === 0 ? 'ArrowLeft' : 'ArrowUp')
    }

    await this.doneButtonEnabled.waitFor({ state: 'visible', timeout: 10_000 })
    await this.doneButtonEnabled.click()

    // The Save button is hidden until the drawn boundary is valid and stays
    // disabled (native .disabled property) until the async EDP/boundary-info
    // calculation finishes and sets canContinue. Playwright's click waits for
    // the enabled state, so the button's own actionability gate is enough — no
    // attribute-selector filter (which the property-based disable does not
    // reliably reflect and can slip past).
    await this.saveAndContinueButton.click({ timeout: 30_000 })
  }

  async placePoint() {
    await this.page.keyboard.press('Enter')
  }

  async panAndPlacePoint(direction) {
    for (let i = 0; i < 20; i++) await this.page.keyboard.press(direction)
    await this.placePoint()
  }

  async isDoneEnabled() {
    return (await this.doneButtonEnabled.count()) > 0
  }
}

export { DrawBoundaryPage }
