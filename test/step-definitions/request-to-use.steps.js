import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'
import { waitForVisible } from '../support/wait-for-visible.js'
import { clickContinue } from '../support/click-continue.js'
import { findNotifyEmail } from '../support/find-notify-email.js'
import { assertSummaryRow } from '../support/assert-summary-row.js'
import {
  seedQuoteViaFrontend,
  SEED_EMAIL,
  LARGER_POLYGON
} from '../support/seed-quote.js'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

Given(
  'I have created a quote for Nature Restoration Levy',
  { timeout: 120_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await seedQuoteViaFrontend(this)
  }
)

Given(
  'I have created another quote for Nature Restoration Levy with a different boundary',
  { timeout: 120_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await seedQuoteViaFrontend(this, LARGER_POLYGON)
  }
)

// Submitting from Check your answers is what gives the quote its commitment
// certificate, which the original NRL reference lookup requires. The session
// survives the submission, so the review page can be reopened afterwards.
Given(
  'I have submitted my request to use the levy',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.requestToUseCheckYourAnswersPage.open()
    await this.pageObjects.requestToUseCheckYourAnswersPage.submit()
    await this.page.waitForURL(/\/request-to-use\/confirmation/)
    this.submittedNrfReference = this.nrfReference
    await this.pageObjects.reviewQuoteDetailsPage.open(
      '/request-to-use/review-quote-details'
    )
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
    await clickContinue(this.page)
  }
)

When(
  'I enter {string} as my NRL reference',
  /** @this {PlaywrightWorld} */
  async function (reference) {
    await this.pageObjects.enterNrlReferencePage.fillNrlReference(reference)
    await clickContinue(this.page)
  }
)

When(
  'I enter my NRL reference',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.haveNrlReferencePage.selectAnswer('Yes')
    await clickContinue(this.page)
    await this.pageObjects.enterNrlReferencePage.fillNrlReference(
      this.nrfReference
    )
    await clickContinue(this.page)
  }
)

When(
  'I enter {string} as the original NRL reference',
  /** @this {PlaywrightWorld} */
  async function (reference) {
    await this.pageObjects.originalReferencePage.fillOriginalReference(
      reference
    )
    await clickContinue(this.page)
  }
)

When(
  'I enter the NRL reference of my submitted request as the original NRL reference',
  /** @this {PlaywrightWorld} */
  async function () {
    assert.ok(
      this.submittedNrfReference,
      'No request to use was submitted earlier in this scenario'
    )
    await this.pageObjects.originalReferencePage.fillOriginalReference(
      this.submittedNrfReference
    )
    await clickContinue(this.page)
  }
)

When(
  'I accept the levy amount',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.acceptLevyPage.acceptAmount()
    await clickContinue(this.page)
  }
)

When(
  'I say the development is not an amendment',
  /** @this {PlaywrightWorld} */
  async function () {
    const heading = this.pageObjects.variationPage.pageHeading
    await waitForVisible(this.page, heading, 'the variation heading')
    assert.equal(
      (await heading.textContent()).trim(),
      'Is the development an amendment to an existing planning permission?'
    )
    await this.pageObjects.variationPage.chooseNo()
    await clickContinue(this.page)
  }
)

When(
  'I enter the address details',
  /** @this {PlaywrightWorld} */
  async function () {
    const { enterAddressPage } = this.pageObjects
    await enterAddressPage.fillAddressDetails()
    await enterAddressPage.confirm()
  }
)

When(
  'I enter the developer details',
  /** @this {PlaywrightWorld} */
  async function () {
    const { enterAddressPage } = this.pageObjects
    await enterAddressPage.fillDeveloperDetails()
    await enterAddressPage.confirm()
  }
)

Then(
  'I should be taken to the review details page',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.page.waitForURL(
      (url) => url.pathname === '/request-to-use/review-details'
    )
  }
)

When(
  'I say the development is an amendment',
  /** @this {PlaywrightWorld} */
  async function () {
    const heading = this.pageObjects.variationPage.pageHeading
    await waitForVisible(this.page, heading, 'the variation heading')
    await this.pageObjects.variationPage.chooseYes()
    await clickContinue(this.page)
  }
)

When(
  'I say the original planning permission was not committed',
  /** @this {PlaywrightWorld} */
  async function () {
    const heading = this.pageObjects.originalCommittedPage.pageHeading
    await waitForVisible(
      this.page,
      heading,
      'the original planning permission committed heading'
    )
    assert.equal(
      (await heading.textContent()).trim(),
      'Was the original planning permission committed to using the nature restoration levy?'
    )
    await this.pageObjects.originalCommittedPage.chooseNo()
    await clickContinue(this.page)
  }
)

When(
  'I say the original planning permission was committed',
  /** @this {PlaywrightWorld} */
  async function () {
    const heading = this.pageObjects.originalCommittedPage.pageHeading
    await waitForVisible(
      this.page,
      heading,
      'the original planning permission committed heading'
    )
    assert.equal(
      (await heading.textContent()).trim(),
      'Was the original planning permission committed to using the nature restoration levy?'
    )
    await this.pageObjects.originalCommittedPage.chooseYes()
    await clickContinue(this.page)
  }
)

When(
  'I decline the levy amount',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.acceptLevyPage.declineAmount()
    await clickContinue(this.page)
  }
)

Then(
  'I should see the are you sure you want to delete this quote page',
  /** @this {PlaywrightWorld} */
  async function () {
    const heading = this.pageObjects.requestToUseDeleteQuotePage.pageHeading
    await waitForVisible(this.page, heading, 'the delete quote heading')
    assert.equal(
      (await heading.textContent()).trim(),
      'Are you sure you want to delete this quote?'
    )
    const warning = this.page.getByText(
      'This will permanently delete your quote. You can create a new quote.'
    )
    await waitForVisible(this.page, warning, 'the permanent deletion warning')
  }
)

When(
  'I delete my quote',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.requestToUseDeleteQuotePage.deleteButton.click()
  }
)

Then(
  'I should see the your details have been deleted page',
  /** @this {PlaywrightWorld} */
  async function () {
    const panelTitle =
      this.pageObjects.requestToUseDeleteQuoteConfirmationPage.panelTitle
    await waitForVisible(
      this.page,
      panelTitle,
      'the deletion confirmation panel'
    )
    assert.equal(
      (await panelTitle.textContent()).trim(),
      'Your details have been deleted'
    )
  }
)

When(
  'I request to use the levy for {string}',
  /** @this {PlaywrightWorld} */
  async function (answer) {
    const heading = this.page.locator('h1', {
      hasText: 'Who are you requesting to use the nature restoration levy for?'
    })
    await waitForVisible(
      this.page,
      heading,
      'the who are you requesting heading'
    )
    await this.pageObjects.defraAccountUserTypePage.selectAnswer(answer)
    await clickContinue(this.page)
  }
)

When(
  'I follow the request to use link in the quote email',
  /** @this {PlaywrightWorld} */
  async function () {
    await followRequestToUseLink.call(this)
  }
)

Then(
  'the NRL reference from my quote is pre-filled',
  /** @this {PlaywrightWorld} */
  async function () {
    await continueWithPrefilledReference.call(this)
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
  // The quote confirmation email does not contain a magic link, so the link
  // path identifies the retrieve your quote email.
  const expectedText = `/request-to-use/retrieve/${this.nrfReference}/`
  const body = await findNotifyEmail(
    this,
    this.submittedEmail,
    expectedText,
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
    await followMagicLink.call(this)
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

/** @this {PlaywrightWorld} */
async function followRequestToUseLink() {
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

/** @this {PlaywrightWorld} */
async function continueWithPrefilledReference() {
  await this.pageObjects.enterNrlReferencePage.nrlReferenceInput.waitFor({
    state: 'visible'
  })
  assert.equal(
    await this.pageObjects.enterNrlReferencePage.prefilledReference,
    this.nrfReference
  )
  await clickContinue(this.page)
}

/** @this {PlaywrightWorld} */
async function followMagicLink() {
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

Given(
  'I am on the review and amend quote details page for my quote',
  { timeout: 120_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await followRequestToUseLink.call(this)
    await continueWithPrefilledReference.call(this)
    this.submittedEmail = SEED_EMAIL
    await this.pageObjects.emailPage.fillEmail(SEED_EMAIL)
    await clickContinue(this.page)
    await captureRetrieveQuoteEmail.call(this)
    await followMagicLink.call(this)
    const heading = this.pageObjects.reviewQuoteDetailsPage.pageHeading
    await waitForVisible(
      this.page,
      heading,
      'the review and amend quote details heading'
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
  'I follow the {string} link',
  /** @this {PlaywrightWorld} */
  async function (name) {
    await this.page.getByRole('link', { name }).click()
  }
)

When(
  'I click Change for {string} on the review and amend quote details page',
  /** @this {PlaywrightWorld} */
  async function (key) {
    await this.pageObjects.reviewQuoteDetailsPage.changeLink(key).click()
  }
)

const BASE_CHARGE_PER_UNIT = 2675

When(
  'I note the number of housing units',
  /** @this {PlaywrightWorld} */
  async function () {
    const value = this.pageObjects.reviewQuoteDetailsPage.summaryRowValue(
      'Number of housing units'
    )
    await waitForVisible(this.page, value, 'the number of housing units')
    const units = Number((await value.textContent()).trim())
    assert.ok(
      Number.isInteger(units) && units > 0,
      `Expected a positive whole number of housing units but got "${await value.textContent()}"`
    )
    this.housingUnits = units
  }
)

// Until inflation is applied, the inflation-adjusted amount equals the
// provisional amount: both are the base charge per unit times the units.
Then(
  'I should see the levy amounts for my number of housing units',
  /** @this {PlaywrightWorld} */
  async function () {
    assert.ok(
      this.housingUnits,
      'No number of housing units was noted earlier in this scenario'
    )
    const expectedAmount = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(BASE_CHARGE_PER_UNIT * this.housingUnits)
    const { provisionalAmountHeading, inflationAdjustedAmountHeading } =
      this.pageObjects.acceptLevyPage

    await waitForVisible(
      this.page,
      this.page.locator('h1', {
        hasText: 'Do you accept this nature restoration levy amount?'
      }),
      'the accept levy heading'
    )

    await waitForVisible(
      this.page,
      provisionalAmountHeading,
      'the provisional levy amount'
    )
    assert.equal(
      (await provisionalAmountHeading.textContent()).trim(),
      `Provisional nature restoration levy amount: ${expectedAmount} (excluding VAT)`
    )
    assert.equal(
      (await inflationAdjustedAmountHeading.textContent()).trim(),
      `Inflation-adjusted nature restoration levy amount: ${expectedAmount} (excluding VAT)`
    )
  }
)

Then(
  'I continue from the {string} page',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function (heading) {
    const h1 = this.page.locator('h1', { hasText: heading })
    await waitForVisible(this.page, h1, `heading "${heading}"`, {
      timeoutMs: 30_000
    })
    await clickContinue(this.page)
  }
)
