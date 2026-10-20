import assert from 'node:assert/strict'
import { When, Then } from '@cucumber/cucumber'
import { waitForVisible } from '../support/wait-for-visible.js'
import { findNotifyEmail } from '../support/find-notify-email.js'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

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

Then(
  'I should be taken to {string}',
  /** @this {PlaywrightWorld} */
  async function (path) {
    await this.page.waitForURL((url) => url.pathname === path)
  }
)

Then(
  'I have been sent the retrieve quote email',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
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
      this.quoteSubmittedAt ?? this.scenarioStartedAt
    )

    assert.ok(
      body,
      `No retrieve quote email to ${this.submittedEmail} contained "${expectedText}" after all retries — see attached attempt log`
    )
    this.retrieveQuoteEmailBody = body
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
