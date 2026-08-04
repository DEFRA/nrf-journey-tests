import { Page } from './page.js'

// Number of arrow-key presses used to pan the map between vertices. Kept
// modest so the drawn triangle stays reasonably close to the searched
// location — too large a pan risks carrying a vertex outside the seeded EDP
// boundary data, incorrectly routing the journey to /quote/no-edp instead of
// /quote/email.
const PAN_STEPS = 15

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

    // The suggestions dropdown re-fetches on every keystroke, so immediately
    // pressing ArrowDown + Enter can select whatever the dropdown happened to
    // be showing from an earlier, not-yet-superseded keystroke — landing the
    // map on an unrelated place with the same partial text. Waiting for and
    // clicking the option whose name actually starts with the full query
    // (rather than e.g. "<query> Close" — a street sharing the same prefix)
    // guarantees the selected result matches what was searched for.
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const firstMatch = this.page
      .getByRole('option', { name: new RegExp(`^${escapedQuery}(,|$)`, 'i') })
      .first()
    await firstMatch.waitFor({ state: 'visible' })
    await firstMatch.click()
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
    // dropped, leaving the Done button disabled. Confirm the Done button
    // enables, adding extra spaced points if it hasn't.
    await this.placePoint()
    await this.panAndPlacePoint('ArrowRight')
    await this.panAndPlacePoint('ArrowDown')

    for (let attempt = 0; attempt < 5; attempt++) {
      if (await this.isDoneEnabled()) break
      // Extra points continue panning right/down (rather than back toward the
      // centre) — the triangle's vertices must stay spaced far enough apart
      // for the library to accept the polygon, without retracing ground
      // already covered by the first two vertices.
      await this.panAndPlacePoint(
        attempt % 2 === 0 ? 'ArrowRight' : 'ArrowDown'
      )
    }

    await this.doneButtonEnabled.waitFor({ state: 'visible', timeout: 10_000 })
    await this.doneButtonEnabled.click()
  }

  async saveAndContinue() {
    await this.saveAndContinueButton.waitFor({
      state: 'visible',
      timeout: 20_000
    })
    await this.saveAndContinueButton.click()
    // Default waitUntil is 'load', which waits for the destination page's
    // load event. 'domcontentloaded' still isn't enough: leftover tile
    // fetches from panning during drawing can saturate the browser's
    // per-origin connection limit, so the destination page's blocking
    // <script> tag queues behind them and DOMContentLoaded is delayed too.
    // 'commit' resolves as soon as the navigation response for the
    // destination URL starts arriving, before any of its own requests are
    // made — so it can't be blocked by connections held by the old page.
    await this.page.waitForURL(/\/quote\/(email|no-edp|excluded-area)/, {
      timeout: 30_000,
      waitUntil: 'commit'
    })
  }

  async placePoint() {
    await this.page.keyboard.press('Enter')
  }

  async panAndPlacePoint(direction) {
    for (let i = 0; i < PAN_STEPS; i++)
      await this.page.keyboard.press(direction)
    await this.placePoint()
  }

  async isDoneEnabled() {
    return (await this.doneButtonEnabled.count()) > 0
  }
}

export { DrawBoundaryPage }
