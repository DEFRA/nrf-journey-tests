import assert from 'node:assert/strict'
import path from 'node:path'
import { findNotifyEmail } from './find-notify-email.js'
import { waitForVisible } from './wait-for-visible.js'

const EMAIL = 'nrfjourneytests@gmail.com'
const BOUNDARY_FILE = path.resolve(
  'test/fixtures/BnW_small_under_1_hectare.geojson'
)

// Re-drives the journey the "Complete full quote and request to use journey
// via file upload" scenario in upload/quote-full-journey.feature spells out
// step by step, using the same page objects and setting the same world state
// along the way, so features that only need to start from the review and
// amend quote details page can share it instead of duplicating its preamble.
// It ends by asserting that page loaded, so a broken setup fails here with a
// clear message rather than in the first step that follows it.
/**
 * @param {import('./world.js').PlaywrightWorld} world
 */
async function completeQuoteAndRequestToUseJourney(world) {
  const po = world.pageObjects
  const log = (message) => world.attach(message, 'text/plain')
  const continueButton = world.page.getByRole('button', { name: 'Continue' })

  assert.ok(process.env.NOTIFY_API_KEY, 'NOTIFY_API_KEY env var is required')

  await po.homePage.open()
  await po.homePage.startNow()
  await po.whatWouldYouLikeToDoPage.selectOption(
    'I want a quote for the nature restoration levy'
  )
  await continueButton.click()
  await po.planningTypePage.selectPlanningType('Full planning permission')
  await continueButton.click()
  await po.confirmHousingPage.selectYes()
  await continueButton.click()
  await po.residentialPage.fillResidentialUnits('10')
  await continueButton.click()
  await po.boundaryTypePage.selectBoundaryType('Upload a file')
  await continueButton.click()
  await po.uploadBoundaryPage.uploadFile(BOUNDARY_FILE)
  // The "Checking file" page polls until the uploader has scanned the file,
  // which can be slow — wait for most of the step's timeout rather than
  // Playwright's 30s default (see the matching step in
  // quote-full-journey.steps.js).
  await po.uploadPreviewMapPage.saveAndContinueButton.waitFor({
    state: 'visible',
    timeout: 50_000
  })
  await po.uploadPreviewMapPage.saveAndContinue()

  world.submittedEmail = EMAIL
  await po.emailPage.fillEmail(EMAIL)
  await continueButton.click()

  // The confirmation email is sent on submission. Record the moment just
  // before submitting so the Notify lookups below only match emails from this
  // run — a stale email with a colliding NRL reference would otherwise pass.
  world.quoteSubmittedAt = new Date().toISOString()
  await po.checkYourAnswersPage.submit()

  await waitForVisible(
    world.page,
    po.confirmationPage.panelTitle,
    'the confirmation panel'
  )
  await waitForVisible(
    world.page,
    po.confirmationPage.panelBody,
    'the confirmation panel body'
  )
  const panelBodyText = await po.confirmationPage.panelBody.textContent()
  const referenceMatch = panelBodyText.match(/NRL-\d+/)
  assert.ok(
    referenceMatch,
    `Expected panel body to contain an NRL-<number> reference but got "${panelBodyText.trim()}"`
  )
  world.nrfReference = referenceMatch[0]

  world.confirmationEmailBody = await findNotifyEmail(
    process.env.NOTIFY_API_KEY,
    world.submittedEmail,
    `NRL reference: ${world.nrfReference}`,
    log,
    world.quoteSubmittedAt
  )
  assert.ok(
    world.confirmationEmailBody,
    `No confirmation email to ${world.submittedEmail} containing "NRL reference: ${world.nrfReference}" after all retries — see attached attempt log`
  )

  // Only the path and query are used, so the link works whatever host the
  // email names.
  const requestToUseLink = world.confirmationEmailBody.match(
    /https?:\/\/[^\s)\]>]*?(\/request-to-use\/enter-nrl-reference\?[^\s)\]>]+)/
  )
  assert.ok(
    requestToUseLink,
    `Expected the quote email to contain a request to use link but found none:\n${world.confirmationEmailBody}`
  )
  await po.enterNrlReferencePage.open(requestToUseLink[1])

  await po.enterNrlReferencePage.nrlReferenceInput.waitFor({
    state: 'visible'
  })
  assert.equal(
    await po.enterNrlReferencePage.prefilledReference,
    world.nrfReference
  )
  await continueButton.click()

  await po.emailPage.fillEmail(EMAIL)
  await continueButton.click()
  await waitForVisible(
    world.page,
    po.emailConfirmationPage.panelTitle,
    'the email confirmation panel'
  )

  // The quote confirmation email does not contain a magic link, so the link
  // path identifies the retrieve your quote email.
  world.retrieveQuoteEmailBody = await findNotifyEmail(
    process.env.NOTIFY_API_KEY,
    world.submittedEmail,
    `/request-to-use/retrieve/${world.nrfReference}/`,
    log,
    world.quoteSubmittedAt
  )
  assert.ok(
    world.retrieveQuoteEmailBody,
    `No retrieve quote email to ${world.submittedEmail} contained "/request-to-use/retrieve/${world.nrfReference}/" after all retries — see attached attempt log`
  )

  const magicLink = world.retrieveQuoteEmailBody.match(
    new RegExp(
      `https?://[^\\s)\\]>]*?(/request-to-use/retrieve/${world.nrfReference}/[\\w-]+)`
    )
  )
  assert.ok(
    magicLink,
    `Expected the email body to contain a magic link for ${world.nrfReference} but found none:\n${world.retrieveQuoteEmailBody}`
  )
  await po.reviewQuoteDetailsPage.open(magicLink[1])

  const heading = po.reviewQuoteDetailsPage.pageHeading
  await waitForVisible(
    world.page,
    heading,
    'the review and amend quote details heading'
  )
  assert.equal(
    (await heading.textContent()).trim(),
    `Review and amend the quote details for ${world.nrfReference}`
  )
}

export { completeQuoteAndRequestToUseJourney }
