import { Given, When, Then } from '@cucumber/cucumber'
import {
  chooseOrganisation,
  prepareDefraIdUser,
  signInToDefraId
} from '../support/defra-id/index.js'
import { waitForVisible } from '../support/wait-for-visible.js'
import { baseUrl } from '../support/base-url.js'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

Given(
  'I have a Defra ID account as an {word}',
  { timeout: 30_000 },
  /** @this {PlaywrightWorld} */
  async function (userType) {
    await prepareDefraIdUser({ world: this, userType })
  }
)

When(
  'I sign in to Defra ID',
  { timeout: 120_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await signInToDefraId(this)
  }
)

When(
  'I sign in to Defra ID and am shown the organisation picker',
  { timeout: 120_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await signInToDefraId(this, { expectOrganisationPicker: true })
  }
)

When(
  'I choose {string} on the organisation picker',
  { timeout: 120_000 },
  /** @this {PlaywrightWorld} */
  async function (organisationName) {
    await chooseOrganisation(this, organisationName)
  }
)

Given(
  'I am signed in to Defra ID as an {word}',
  { timeout: 120_000 },
  /** @this {PlaywrightWorld} */
  async function (userType) {
    await prepareDefraIdUser({ world: this, userType })
    await this.pageObjects.enterAddressPage.open()
    await signInToDefraId(this)
  }
)

Then(
  'I should be signed in and can enter my address',
  /** @this {PlaywrightWorld} */
  async function () {
    const { organisationName, relationshipRole } = this.defraIdUser

    await this.page.waitForURL(
      (url) => url.pathname === '/request-to-use/enter-address'
    )
    const headingText = !organisationName
      ? 'What is your address?'
      : relationshipRole === 'Agent'
        ? `What are the details for ${organisationName}?`
        : `What is the address for ${organisationName}?`
    const heading = this.page.locator('h1', { hasText: headingText })
    await waitForVisible(this.page, heading, 'the enter address heading')
  }
)

Then(
  'I should see the sign out link',
  /** @this {PlaywrightWorld} */
  async function () {
    await waitForVisible(
      this.page,
      this.pageObjects.enterAddressPage.signOutLink,
      'the sign out link'
    )
  }
)

When(
  'I sign out',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.enterAddressPage.signOutLink.click()
    // Defra ID returns to the service in stub mode, or its own page in real mode
    await this.page.waitForLoadState('load')
  }
)

Then(
  'I should be signed out of the service and Defra ID',
  { timeout: 60_000 },
  /** @this {PlaywrightWorld} */
  async function () {
    await this.pageObjects.enterAddressPage.open()
    const serviceOrigin = new URL(baseUrl).origin
    // A signed-out user is sent to Defra ID rather than to the page
    await this.page.waitForURL((url) => url.origin !== serviceOrigin, {
      timeout: 30_000
    })
  }
)
