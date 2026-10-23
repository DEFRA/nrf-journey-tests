import assert from 'node:assert/strict'
import { baseUrl } from './base-url.js'

export const SEED_EMAIL = 'nrfjourneytests@gmail.com'

// A small WGS84 (lon/lat) triangle near Aylsham, Norfolk — the area the draw
// journeys search for — that intersects a locally seeded EDP, so the boundary
// check passes and the seeded quote looks like any EDP-intersecting one. The
// check API rejects projected coordinates with coordinates_out_of_range, so
// this must stay in WGS84 (verified against backend/src/routes/boundary.test.js).
const POLYGON = {
  type: 'Polygon',
  coordinates: [
    [
      [1.248, 52.793],
      [1.254, 52.793],
      [1.251, 52.798],
      [1.248, 52.793]
    ]
  ]
}

// Creates a complete quote by driving the frontend's own routes over HTTP —
// the same requests the browser makes when a user walks the quote journey,
// just without rendering pages, uploading a file through the CDP uploader or
// waiting for the confirmation email. The frontend adds the backend
// credentials server-side, so no API keys are needed here, and the resulting
// quote is indistinguishable from a UI-created one at the request-to-use
// stage. Leaves the world state the request-to-use steps expect:
// submittedEmail, nrfReference and quoteSubmittedAt.
/**
 * @param {import('./world.js').PlaywrightWorld} world
 */
async function seedQuoteViaFrontend(world) {
  const cookies = new Map()

  const storeCookies = (response) => {
    for (const cookie of response.headers.getSetCookie()) {
      cookies.set(cookie.split('=')[0], cookie.split(';')[0])
    }
  }

  const cookieHeader = () => [...cookies.values()].join('; ')

  const request = async (path, options = {}) => {
    const response = await fetch(`${baseUrl}${path}`, {
      redirect: 'manual',
      ...options,
      headers: { cookie: cookieHeader(), ...options.headers }
    })
    storeCookies(response)
    return response
  }

  // @hapi/crumb mints the CSRF token into a cookie and the hidden form field
  // on the first GET; both must be replayed on every subsequent POST.
  const page = await request('/manage/what-would-you-like-to-do')
  assert.equal(page.status, 200, 'Expected the start of the quote journey')
  const csrfToken = (await page.text()).match(
    /name="csrfToken" value="([^"]+)"/
  )?.[1]
  assert.ok(csrfToken, 'No csrfToken found on the quote journey start page')

  const postForm = async (path, fields, description) => {
    const body = new URLSearchParams({ csrfToken, ...fields })
    const response = await request(path, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body
    })
    assert.equal(
      response.status,
      303,
      `Expected submitting ${description} to redirect, got ${response.status} ${response.headers.location ?? ''}`
    )
    return response
  }

  const postJson = async (path, json, description) => {
    const response = await request(path, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': csrfToken
      },
      body: JSON.stringify(json)
    })
    assert.equal(
      response.status,
      200,
      `Expected ${description} to succeed, got ${response.status}`
    )
    return response
  }

  await postForm(
    '/manage/what-would-you-like-to-do',
    {
      whatWouldYouLikeToDo: 'quote'
    },
    'what would you like to do'
  )
  await postForm(
    '/quote/planning-type',
    { planningType: 'full-planning-permission' },
    'planning type'
  )
  await postForm('/quote/confirm-housing', { isHousing: 'yes' }, 'housing')
  await postForm('/quote/unit-number', { housingUnits: '10' }, 'housing units')
  await postForm(
    '/quote/boundary-type',
    { boundaryEntryType: 'draw' },
    'boundary type'
  )

  // The map's check API returns the boundary blob the save API expects
  // verbatim — the same hand-off the draw map performs in the browser.
  const check = await postJson(
    '/quote/draw-boundary/check',
    { geometry: POLYGON },
    'the boundary check'
  )
  const boundaryGeojson = await check.json()
  assert.ok(
    boundaryGeojson.boundaryGeometryWgs84,
    'The boundary check response has no boundaryGeometryWgs84 — the polygon may fall outside every EDP'
  )
  // Save is a restful JSON endpoint but replies like a page POST: a 303 to
  // /quote/email on success (drawn boundaries skip the file preview — that
  // page belongs to the upload chain), or to an outcome dropout otherwise.
  const save = await request('/quote/draw-boundary/save', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': csrfToken
    },
    body: JSON.stringify({ boundaryGeojson })
  })
  assert.equal(
    save.status,
    303,
    `Expected the boundary save to redirect, got ${save.status}`
  )
  assert.equal(
    save.headers.get('location'),
    '/quote/email',
    `Expected the boundary save to lead to the email page, got ${save.headers.get('location') ?? ''}`
  )

  world.submittedEmail = SEED_EMAIL
  await postForm('/quote/email', { email: SEED_EMAIL }, 'the email address')

  world.quoteSubmittedAt = new Date().toISOString()
  const submit = await postForm(
    '/quote/check-your-answers',
    {},
    'the quote answers'
  )

  const confirmation = await request(submit.headers.get('location'))
  assert.equal(confirmation.status, 200, 'Expected the quote confirmation')
  const referenceMatch = (await confirmation.text()).match(/NRL-\d{6}/)
  assert.ok(
    referenceMatch,
    'No NRL reference found on the quote confirmation page'
  )
  world.nrfReference = referenceMatch[0]
}

export { seedQuoteViaFrontend }
