import { Page } from './page.js'

// Number of arrow-key presses used to pan the map between vertices. Kept
// modest so the drawn triangle stays reasonably close to the searched
// location — too large a pan risks carrying a vertex outside the seeded EDP
// boundary data, incorrectly routing the journey to the "Not in EDP" page
// instead of the "Email address" page.
const PAN_STEPS = 15

// Where to hover, as fractions of the map's size, when looking for a
// hydrated boundary. The map is fitted to the boundary, so it fills the
// middle of the map; the centre is tried first.
const HOVER_X_FRACTIONS = [0.5, 0.45, 0.55, 0.4, 0.6]
const HOVER_Y_FRACTIONS = [0.5, 0.55, 0.45, 0.6, 0.4, 0.65, 0.35, 0.7]

// How long to keep trying to select a hydrated boundary while the map's style,
// and with it the draw layers, is still loading
const SELECT_BOUNDARY_TIMEOUT_MS = 15_000

/**
 * @param {{ x: number, y: number, width: number, height: number }} box
 * @returns {{ x: number, y: number }[]}
 */
function getHoverPoints({ x, y, width, height }) {
  return HOVER_Y_FRACTIONS.flatMap((yFraction) =>
    HOVER_X_FRACTIONS.map((xFraction) => ({
      x: x + width * xFraction,
      y: y + height * yFraction
    }))
  )
}

// The exact text the boundary information panel shows when the drawn area
// isn't eligible via an EDP — no EDP match, or inside an exclusion zone.
const UNSUPPORTED_AREA_MESSAGE =
  'An area not supported by an Environmental Delivery Plan (EDP)'

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

  get boundaryInfoIntersections() {
    return this.page.locator('[data-boundary-info-intersections]')
  }

  get boundaryInfoUnsupportedAreaMessage() {
    return this.boundaryInfoIntersections.getByText(UNSUPPORTED_AREA_MESSAGE)
  }

  get boundaryInfoEditButton() {
    return this.page.locator('[data-boundary-action="edit"]')
  }

  get backButton() {
    return this.page.getByRole('button', { name: 'Back' })
  }

  get keyButton() {
    return this.page.getByRole('button', { name: 'Key', exact: true })
  }

  // The styles button is icon-only (showLabel: false), but the library still
  // gives it the accessible name "Styles" via aria-labelledby
  get stylesButton() {
    return this.page.getByRole('button', { name: 'Styles', exact: true })
  }

  // Each key entry is a <dt> symbol / <dd> label pair, so the <dd>s
  // (role "definition") are the entries' labels
  get keyEntryLabels() {
    return this.page.locator('.im-c-map-key').getByRole('definition')
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
    await this.startDrawing()
    await this.placeTriangle()
  }

  // Replaces a boundary hydrated from a previous session: select it by
  // clicking it on the map (that's what enables the menu's "Delete feature"
  // item), delete it, then draw a fresh triangle. Waits for the info panel's
  // Edit button first as the signal that hydration has finished.
  async amendTriangleOnMap() {
    await this.boundaryInfoEditButton.waitFor({
      state: 'visible',
      timeout: 20_000
    })
    await this.deleteExistingBoundary()
    await this.startDrawing()
    await this.placeTriangle()
  }

  async startDrawing() {
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
  }

  get drawToolsButton() {
    return this.page.getByRole('button', { name: 'Draw tools' })
  }

  get deleteFeatureMenuItem() {
    return this.page.getByRole('menuitem', { name: 'Delete feature' })
  }

  // Selecting the hydrated boundary is what enables "Delete feature". The map
  // is fitted to the boundary's bounds, but its centre isn't reliably inside
  // the polygon: the fit centres it within the map's padding rather than the
  // canvas, and the bounding-box centre of the drawn right-angled triangle
  // sits on its hypotenuse. So try points around the centre until one
  // selects it. Retries until a time limit, as the Edit button can appear
  // before the base map style has loaded, and the draw layers are only added
  // once it has.
  async deleteExistingBoundary() {
    const points = getHoverPoints(await this.mapContainer.boundingBox())
    const deadline = Date.now() + SELECT_BOUNDARY_TIMEOUT_MS
    do {
      for (const point of points) {
        if (await this.selectBoundaryAt(point)) {
          await this.deleteFeatureMenuItem.click()
          return
        }
      }
      await this.page.waitForTimeout(500)
    } while (Date.now() < deadline)
    throw new Error(
      `Could not select the existing boundary on the map within ${SELECT_BOUNDARY_TIMEOUT_MS}ms`
    )
  }

  // Clicks only where the map shows a pointer cursor, which it does near
  // selectable draw features, then opens the draw tools menu and checks
  // whether "Delete feature" has enabled. Leaves the menu open on success
  // so the caller can click it.
  async selectBoundaryAt({ x, y }) {
    await this.page.mouse.move(x, y)
    const cursor = await this.mapContainer
      .locator('canvas.maplibregl-canvas')
      .evaluate((el) => el.style.cursor)
    if (cursor !== 'pointer') return false

    await this.page.mouse.click(x, y)
    await this.drawToolsButton.click()
    // The menu item is an <li> carrying aria-disabled, not a disabled form
    // control, so read the attribute directly
    const isDeleteEnabled =
      (await this.deleteFeatureMenuItem.getAttribute('aria-disabled')) === null
    if (!isDeleteEnabled) await this.page.keyboard.press('Escape')
    return isDeleteEnabled
  }

  async placeTriangle() {
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
    await this.page.waitForURL(/\/quote\/(email|not-in-edp|excluded-area)/, {
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

export { DrawBoundaryPage, UNSUPPORTED_AREA_MESSAGE }
