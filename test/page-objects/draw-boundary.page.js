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
    return this.page
      .getByRole('button', { name: 'Save and continue' })
      .and(this.page.locator(':not([disabled])'))
  }

  get mapContainer() {
    return this.page.locator('#draw-boundary-map')
  }

  async searchLocation(query) {
    // Playwright resolves the accessible name whether it's set via aria-label
    // or aria-labelledby (the library currently uses the latter, associating
    // the button with a separate tooltip element) — more robust than an
    // aria-label attribute selector, which only matches the former.
    const openSearch = this.page.getByRole('button', {
      name: 'Search',
      exact: true
    })
    await openSearch.waitFor({ state: 'visible' })
    await openSearch.evaluate((el) => el.click())
    await this.searchInput.waitFor({ state: 'visible' })
    await this.searchInput.pressSequentially(query)
    await this.searchInput.press('ArrowDown')
    await this.searchInput.press('Enter')
  }

  async drawTriangleOnMap() {
    const drawButton = this.page.getByRole('button', {
      name: 'Draw',
      exact: true
    })
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

    // Done can trigger more than one boundary-validation request in quick
    // succession, and each cycle hides Save and continue while it shows
    // "Checking boundary..." again. A click landing in that in-between
    // window hits nothing (the button isn't in the DOM's hit-testable state),
    // so no request fires and the page just sits on draw-boundary. Wait for
    // the check requests to go quiet before treating the button as settled.
    await this.waitForBoundaryChecksToSettle()

    await this.saveAndContinueButton.click()
    await this.page.waitForURL(/\/quote\/(email|no-edp)/, {
      timeout: 30_000
    })
  }

  async waitForBoundaryChecksToSettle() {
    const quietPeriodMs = 750
    let lastCheckAt = Date.now()
    const onResponse = (response) => {
      if (response.url().includes('/quote/draw-boundary/check')) {
        lastCheckAt = Date.now()
      }
    }

    this.page.on('response', onResponse)
    try {
      await this.saveAndContinueButton.waitFor({
        state: 'visible',
        timeout: 20_000
      })

      while (Date.now() - lastCheckAt < quietPeriodMs) {
        await this.page.waitForTimeout(100)
      }

      // A later check cycle may have hidden the button again since it was
      // first seen above; confirm it's (still, or once more) settled.
      await this.saveAndContinueButton.waitFor({
        state: 'visible',
        timeout: 20_000
      })
    } finally {
      this.page.off('response', onResponse)
    }
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
