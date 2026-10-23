import assert from 'node:assert/strict'
import { findNotifyEmail } from './find-notify-email.js'
import { waitForVisible } from './wait-for-visible.js'
import { seedQuoteViaFrontend, SEED_EMAIL } from './seed-quote.js'

// Reaches the review and amend quote details page the way a real user would.
// The quote journey is simulated over HTTP (seed-quote.js) because its pages
// already have their own UI coverage in upload/quote-full-journey.feature;
// the request-to-use half is driven in the browser because that is the flow
// under test. It ends by asserting the review page loaded, so a broken setup
// fails here with a clear message rather than in the first step that follows.
/**
 * @param {import('./world.js').PlaywrightWorld} world
 */
async function reachReviewQuoteDetailsPage(world) {
  const po = world.pageObjects
  const log = (message) => world.attach(message, 'text/plain')
  const continueButton = world.page.getByRole('button', { name: 'Continue' })

  assert.ok(process.env.NOTIFY_API_KEY, 'NOTIFY_API_KEY env var is required')

  await seedQuoteViaFrontend(world)

  // Request to use with the reference the seeded quote was given. The email
  // must match the quote's own email, so the seed and this step share
  // SEED_EMAIL.
  await po.homePage.open()
  await po.homePage.startNow()
  await po.whatWouldYouLikeToDoPage.selectOption(
    'I am ready to request to use the nature restoration levy'
  )
  await continueButton.click()
  await po.haveNrlReferencePage.selectAnswer('Yes')
  await continueButton.click()
  await po.enterNrlReferencePage.fillNrlReference(world.nrfReference)
  await continueButton.click()
  await po.emailPage.fillEmail(SEED_EMAIL)
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
    `No retrieve quote email to ${world.submittedEmail} containing "/request-to-use/retrieve/${world.nrfReference}/" after all retries — see attached attempt log`
  )

  // Only the path is used, so the link works whatever host the email names.
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

export { reachReviewQuoteDetailsPage }
