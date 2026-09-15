import assert from 'node:assert/strict'
import path from 'node:path'
import { Given, When, Then } from '@cucumber/cucumber'
import { findNotifyEmail } from '../support/find-notify-email.js'
import { assertSummaryRow } from '../support/assert-summary-row.js'
import { attachScreenshot } from '../support/attach-screenshot.js'
import { waitForVisible } from '../support/wait-for-visible.js'
import { UNSUPPORTED_AREA_MESSAGE } from '../page-objects/draw-boundary.page.js'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

Given(
  'I am on the start page',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.homePage.open()
  }
)

When(
  'I reject analytics cookies',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.homePage.rejectCookies()
  }
)

When(
  'I start a new quote',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.homePage.startNow()
  }
)

When(
  'I select {string} as my planning type',
  /** @this {PlaywrightWorld} */
  async function (planningType) {
    await this.pageObjects.planningTypePage.selectPlanningType(planningType)
  }
)

When(
  'I select {string} as my boundary type',
  /** @this {PlaywrightWorld} */
  async function (boundaryType) {
    await this.pageObjects.boundaryTypePage.selectBoundaryType(boundaryType)
  }
)

When(
  'I upload {string} as my boundary file',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function (filename) {
    const filePath = path.resolve(filename)
    await this.pageObjects.uploadBoundaryPage.uploadFile(filePath)
  }
)

When(
  'I save and continue on the boundary preview',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.uploadPreviewMapPage.saveAndContinueButton.waitFor({
      state: 'visible'
    })
    await this.pageObjects.uploadPreviewMapPage.saveAndContinue()
  }
)

When(
  'I search the map for {string}',
  /** @this {PlaywrightWorld} */
  async function (query) {
    await this.pageObjects.drawBoundaryPage.searchLocation(query)
    await attachScreenshot(this)
  }
)

When(
  'I draw a boundary on the map',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.drawBoundaryPage.drawTriangleOnMap()
    await attachScreenshot(this)
  }
)

When(
  'I click Save and continue',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.drawBoundaryPage.saveAndContinue()
    await attachScreenshot(this)
  }
)

// Checking the boundary after Done fires an async request to the impact
// assessor, so the panel content can lag behind the draw step — the generous
// wait covers that latency (the save step already blocks on the same check).
// Once the unsupported message is visible the panel is fully rendered from a
// single payload, so the exact-text assertion below is race-free. Asserting
// the panel's whole rendered text means any EDP name alongside or instead of
// the message fails the step, without keying on styling classes.
Then(
  'I should see the unsupported area message in the boundary information panel',
  { timeout: 20_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    const drawBoundaryPage = this.pageObjects.drawBoundaryPage
    await waitForVisible(
      this.page,
      drawBoundaryPage.boundaryInfoUnsupportedAreaMessage,
      'the unsupported area message in the boundary information panel',
      { timeoutMs: 15_000 }
    )
    const intersectionsText = (
      await drawBoundaryPage.boundaryInfoIntersections.innerText()
    )
      .replace(/\s+/g, ' ')
      .trim()
    assert.equal(
      intersectionsText,
      UNSUPPORTED_AREA_MESSAGE,
      'Expected only the unsupported area message in the boundary information panel — an EDP name would mean the boundary was treated as eligible'
    )
  }
)

When(
  'I confirm I am developing housing',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.confirmHousingPage.selectYes()
  }
)

When(
  'I continue',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.page.getByRole('button', { name: 'Continue' }).click()
  }
)

When(
  'I enter {string} units',
  /** @this {PlaywrightWorld} */
  async function (count) {
    await this.pageObjects.residentialPage.fillResidentialUnits(count)
  }
)

When(
  'I enter {string} as my email',
  /** @this {PlaywrightWorld} */
  async function (email) {
    this.submittedEmail = email
    await this.pageObjects.emailPage.fillEmail(email)
  }
)

When(
  'I submit my answers',
  /** @this {PlaywrightWorld} */
  async function () {
    // The confirmation email is sent on submission. Record the moment just before
    // submitting so the Notify lookup only matches an email from this run — quote
    // creation can take a minute, so the scenario-start time is too early and
    // would let a stale email with a colliding NRL reference through.
    this.quoteSubmittedAt = new Date().toISOString()
    await this.pageObjects.checkYourAnswersPage.submit()
  }
)

When(
  'I navigate back in the browser',
  /** @this {PlaywrightWorld} */
  async function () {
    await this.page.goBack()
  }
)

Then(
  'I should see {string} for {string} on the Check Your Answers page',
  /** @this {PlaywrightWorld} */
  async function (value, key) {
    await assertSummaryRow(this.pageObjects.checkYourAnswersPage, key, value)
  }
)

Then(
  'I should see my responses on the Check Your Answers page',
  /** @this {PlaywrightWorld} */
  async function () {
    const cya = this.pageObjects.checkYourAnswersPage

    await assertSummaryRow(
      cya,
      'Planning application type',
      'Full planning permission'
    )
    await assertSummaryRow(cya, 'Number of units', '10')
    await assertSummaryRow(cya, 'Email address', 'nrfjourneytests@gmail.com')
  }
)

Then(
  'I should see the confirmation page',
  { timeout: 20_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    const panelTitle = this.pageObjects.confirmationPage.panelTitle
    await waitForVisible(this.page, panelTitle, 'the confirmation panel', {
      timeoutMs: 15_000
    })
    const titleText = await panelTitle.textContent()
    assert.equal(titleText.trim(), 'Your details have been submitted')
  }
)

Then(
  'I should see an NRL reference number',
  /** @this {PlaywrightWorld} */
  async function () {
    const panelBody = this.pageObjects.confirmationPage.panelBody
    await waitForVisible(this.page, panelBody, 'the confirmation panel body')
    const bodyText = await panelBody.textContent()
    const match = bodyText.match(/NRL-\d+/)
    assert.ok(
      match,
      `Expected panel body to contain an NRL-<number> reference but got "${bodyText.trim()}"`
    )
    this.nrfReference = match[0]
  }
)

Then(
  'I should be on the start page',
  /** @this {PlaywrightWorld} */
  async function () {
    const heading = this.pageObjects.homePage.pageHeading
    await waitForVisible(this.page, heading, 'the start page heading')
    assert.equal(
      (await heading.textContent()).trim(),
      'Nature restoration levy'
    )
  }
)

Then(
  'I have been sent a confirmation email',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    const nrfReference = this.nrfReference
    assert.ok(
      nrfReference,
      'No NRL reference was captured earlier in this scenario'
    )

    const apiKey = process.env.NOTIFY_API_KEY
    assert.ok(apiKey, 'NOTIFY_API_KEY env var is required')

    const expectedText = `NRL reference: ${nrfReference}`
    const levyAmountParagraph =
      /Provisional nature restoration levy amount £[\d,]+(?:\.\d{2})? \(plus VAT charged at 20%\)/
    const inflationAdjustedLevyAmountParagraph =
      /Inflation-adjusted nature restoration levy amount: £[\d,]+(?:\.\d{2})? \(plus VAT charged at 20%\)/
    const log = (message) => this.attach(message, 'text/plain')
    const matchEmailBody = await findNotifyEmail(
      apiKey,
      this.submittedEmail,
      expectedText,
      log,
      this.quoteSubmittedAt ?? this.scenarioStartedAt
    )

    assert.ok(
      matchEmailBody,
      `No email (status sending or delivered) to ${this.submittedEmail} contained "${expectedText}" after all retries — see attached attempt log`
    )
    assert.ok(
      levyAmountParagraph.test(matchEmailBody),
      `Expected email body to match ${levyAmountParagraph} but got:\n${matchEmailBody}`
    )
    assert.ok(
      inflationAdjustedLevyAmountParagraph.test(matchEmailBody),
      `Expected email body to match ${inflationAdjustedLevyAmountParagraph} but got:\n${matchEmailBody}`
    )
  }
)

When(
  'I follow the quote link in the email',
  /** @this {PlaywrightWorld} */
  async function () {
    assert.ok(
      this.confirmationEmailBody,
      'No confirmation email body was captured earlier in this scenario'
    )

    // The email contains several links, so anchor on the access link's text
    // rather than a bare URL pattern. It is a markdown link of the form
    // [Commit to using Nature Restoration Fund](<url>); capture the url in the
    // parentheses.
    const linkMatch = this.confirmationEmailBody.match(
      /\[Commit to using Nature Restoration Fund\]\((https?:\/\/[^)]+)\)/
    )
    assert.ok(
      linkMatch,
      `Expected the email body to contain a "Commit to using Nature Restoration Fund" link but found none:\n${this.confirmationEmailBody}`
    )

    this.quoteLinkUrl = linkMatch[1]
    await this.pageObjects.quoteDetailsPage.visit(this.quoteLinkUrl)
  }
)

Then(
  'I should see the quote details page with my NRL reference',
  { timeout: 20_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    const nrfReference = this.nrfReference
    assert.ok(
      nrfReference,
      'No NRL reference was captured earlier in this scenario'
    )

    const heading = this.pageObjects.quoteDetailsPage.pageHeading
    await waitForVisible(this.page, heading, 'the quote details page heading', {
      timeoutMs: 8_000
    })
    assert.equal(
      (await heading.textContent()).trim(),
      'Your Nature restoration levy quote'
    )

    await waitForVisible(
      this.page,
      this.page.getByText(nrfReference).first(),
      `the NRL reference "${nrfReference}" on the quote details page`,
      { timeoutMs: 8_000 }
    )
  }
)

When(
  'I open the quote link in {int} fresh sessions',
  /** @this {PlaywrightWorld} */
  async function (count) {
    assert.ok(
      this.quoteLinkUrl,
      'No quote link was captured earlier in this scenario'
    )

    for (let session = 1; session <= count; session++) {
      await this.pageObjects.quoteDetailsPage.visitInFreshSession(
        this.quoteLinkUrl
      )
    }
  }
)

Then(
  'I should see that the link is invalid',
  /** @this {PlaywrightWorld} */
  async function () {
    const heading = this.pageObjects.quoteDetailsPage.pageHeading
    await waitForVisible(this.page, heading, 'the "link is invalid" heading')
    assert.equal((await heading.textContent()).trim(), 'The link is invalid')
  }
)

When(
  'I enter my email to receive a new link',
  /** @this {PlaywrightWorld} */
  async function () {
    assert.ok(
      this.submittedEmail,
      'No email was captured earlier in this scenario'
    )
    // Record the time so a later Notify lookup only matches an email sent by this
    // resend, not the original confirmation email.
    this.resendRequestedAt = new Date().toISOString()
    await this.pageObjects.quoteDetailsPage.requestNewLinkForEmail(
      this.submittedEmail
    )
  }
)

Then(
  'I should see that a new link has been sent',
  /** @this {PlaywrightWorld} */
  async function () {
    const heading = this.pageObjects.quoteDetailsPage.pageHeading
    await waitForVisible(this.page, heading, 'the "check your email" heading')
    assert.equal((await heading.textContent()).trim(), 'Check your email')
  }
)

Then(
  'I should receive a new quote link by email',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    const apiKey = process.env.NOTIFY_API_KEY
    assert.ok(apiKey, 'NOTIFY_API_KEY env var is required')

    const expectedText = `NRL reference: ${this.nrfReference}`
    const log = (message) => this.attach(message, 'text/plain')
    const match = await findNotifyEmail(
      apiKey,
      this.submittedEmail,
      expectedText,
      log,
      this.resendRequestedAt
    )

    assert.ok(
      match,
      `No resent email to ${this.submittedEmail} containing "${expectedText}" after all retries — see attached attempt log`
    )

    const linkMatch = match.body.match(
      /\[Commit to using Nature Restoration Fund\]\((https?:\/\/[^)]+)\)/
    )
    assert.ok(
      linkMatch,
      `Expected the resent email to contain a "Commit to using Nature Restoration Fund" link but found none:\n${match.body}`
    )
  }
)
