import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'
import { waitForVisible } from '../support/wait-for-visible.js'
import { findNotifyEmail } from '../support/find-notify-email.js'
import { assertSummaryRow } from '../support/assert-summary-row.js'
import { reachReviewQuoteDetailsPage } from '../support/reach-review-quote-details-page.js'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

// The composite seeds the quote over HTTP (fast) but the request-to-use half
// runs in the browser, where the Notify retrieve-email lookup alone can take
// most of a minute — well over the per-step default.
Given(
  'I have reached the review and amend quote details page through the request to use journey',
  { timeout: 120_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await reachReviewQuoteDetailsPage(this)
  }
)

Then(
  'I should see the email confirmation page',
  /** @this {PlaywrightWorld} */
  async function () {
    const panelTitle = this.pageObjects.emailConfirmationPage.panelTitle
    await waitForVisible(this.page, panelTitle, 'the email confirmation panel')
    assert.equal(
      (await panelTitle.textContent()).trim(),
      'We have sent you an email'
    )
  }
)

When(
  'I answer {string} to having an NRL reference',
  /** @this {PlaywrightWorld} */
  async function (answer) {
    await this.pageObjects.haveNrlReferencePage.selectAnswer(answer)
  }
)

When(
  'I enter {string} as my NRL reference',
  /** @this {PlaywrightWorld} */
  async function (reference) {
    await this.pageObjects.enterNrlReferencePage.fillNrlReference(reference)
  }
)

When(
  'I enter the NRL reference from my quote as my NRL reference',
  /** @this {PlaywrightWorld} */
  async function () {
    assert.ok(
      this.nrfReference,
      'No NRL reference was captured earlier in this scenario'
    )
    await this.pageObjects.enterNrlReferencePage.fillNrlReference(
      this.nrfReference
    )
  }
)

When(
  'I follow the request to use link in the quote email',
  /** @this {PlaywrightWorld} */
  async function () {
    assert.ok(
      this.confirmationEmailBody,
      'No confirmation email body was captured earlier in this scenario'
    )

    // Only the path and query are used, so the link works whatever host the email names.
    const linkMatch = this.confirmationEmailBody.match(
      /https?:\/\/[^\s)\]>]*?(\/request-to-use\/enter-nrl-reference\?[^\s)\]>]+)/
    )
    assert.ok(
      linkMatch,
      `Expected the quote email to contain a request to use link but found none:\n${this.confirmationEmailBody}`
    )

    await this.pageObjects.enterNrlReferencePage.open(linkMatch[1])
  }
)

Then(
  'the NRL reference from my quote should be pre-filled',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.enterNrlReferencePage.nrlReferenceInput.waitFor({
      state: 'visible'
    })
    assert.equal(
      await this.pageObjects.enterNrlReferencePage.prefilledReference,
      this.nrfReference
    )
  }
)

Then(
  'I should be taken to {string}',
  /** @this {PlaywrightWorld} */
  async function (path) {
    await this.page.waitForURL((url) => url.pathname === path)
  }
)

/**
 * @this {PlaywrightWorld}
 * @param {string} [excludeBody] - an earlier email body to skip, so a new email is not confused with it
 */
async function captureRetrieveQuoteEmail(excludeBody) {
  assert.ok(
    this.nrfReference,
    'No NRL reference was captured earlier in this scenario'
  )
  const apiKey = process.env.NOTIFY_API_KEY
  assert.ok(apiKey, 'NOTIFY_API_KEY env var is required')

  // The quote confirmation email does not contain a magic link, so the link
  // path identifies the retrieve your quote email.
  const expectedText = `/request-to-use/retrieve/${this.nrfReference}/`
  const log = (message) => this.attach(message, 'text/plain')
  const body = await findNotifyEmail(
    apiKey,
    this.submittedEmail,
    expectedText,
    log,
    this.quoteSubmittedAt ?? this.scenarioStartedAt,
    excludeBody
  )

  assert.ok(
    body,
    `No retrieve quote email to ${this.submittedEmail} contained "${expectedText}" after all retries — see attached attempt log`
  )
  this.retrieveQuoteEmailBody = body
}

Then(
  'I have been sent the retrieve quote email',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await captureRetrieveQuoteEmail.call(this)
  }
)

Then(
  'I have been sent a new retrieve quote email',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await captureRetrieveQuoteEmail.call(this, this.retrieveQuoteEmailBody)
  }
)

When(
  'I get a new link',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.linkExpiredPage.getNewLink()
  }
)

When(
  'I follow the magic link in the email',
  /** @this {PlaywrightWorld} */
  async function () {
    assert.ok(
      this.retrieveQuoteEmailBody,
      'No retrieve quote email body was captured earlier in this scenario'
    )

    // Only the path is used, so the link works whatever host the email names.
    const linkMatch = this.retrieveQuoteEmailBody.match(
      new RegExp(
        `https?://[^\\s)\\]>]*?(/request-to-use/retrieve/${this.nrfReference}/[\\w-]+)`
      )
    )
    assert.ok(
      linkMatch,
      `Expected the email body to contain a magic link for ${this.nrfReference} but found none:\n${this.retrieveQuoteEmailBody}`
    )

    await this.pageObjects.reviewQuoteDetailsPage.open(linkMatch[1])
  }
)

Then(
  'I should see the review and amend quote details page',
  /** @this {PlaywrightWorld} */
  async function () {
    const heading = this.pageObjects.reviewQuoteDetailsPage.pageHeading
    await waitForVisible(
      this.page,
      heading,
      'the review and amend quote details heading'
    )
    assert.equal(
      (await heading.textContent()).trim(),
      `Review and amend the quote details for ${this.nrfReference}`
    )
  }
)

Then(
  'I should see {string} for {string} on the review and amend quote details page',
  /** @this {PlaywrightWorld} */
  async function (value, key) {
    await assertSummaryRow(this.pageObjects.reviewQuoteDetailsPage, key, value)
  }
)

When(
  'I click Change for {string} on the review and amend quote details page',
  /** @this {PlaywrightWorld} */
  async function (key) {
    await this.pageObjects.reviewQuoteDetailsPage.changeLink(key).click()
  }
)

Then(
  'I should see the provisional and inflation-adjusted levy amounts on the accept levy page',
  /** @this {PlaywrightWorld} */
  async function () {
    const headings = this.pageObjects.acceptLevyPage.levyAmountHeadings
    await waitForVisible(
      this.page,
      headings.first(),
      'the levy amount headings'
    )
    const text = await headings.allTextContents()
    assert.match(
      text.join('\n'),
      /Provisional nature restoration levy amount: £[\d,]+(\.\d{2})? \(excluding VAT\)/
    )
    assert.match(
      text.join('\n'),
      /Inflation-adjusted nature restoration levy amount: £[\d,]+(\.\d{2})? \(excluding VAT\)/
    )
  }
)

When(
  'I choose {string} on the accept levy page',
  /** @this {PlaywrightWorld} */
  async function (answer) {
    await this.pageObjects.acceptLevyPage.selectAnswer(answer)
  }
)
