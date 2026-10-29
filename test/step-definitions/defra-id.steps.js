import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'
import {
  prepareDefraIdUser,
  signInToDefraId
} from '../support/defra-id/index.js'
import { waitForVisible } from '../support/wait-for-visible.js'

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
    const { firstName, lastName, organisationName } = this.defraIdUser
    const { enterAddressPage } = this.pageObjects

    await this.page.waitForURL(
      (url) => url.pathname === '/request-to-use/enter-address'
    )
    const heading = this.page.locator('h1', {
      hasText: organisationName
        ? 'What is the business or organisation address?'
        : 'What is your address?'
    })
    await waitForVisible(this.page, heading, 'the enter address heading')

    await waitForVisible(
      this.page,
      enterAddressPage.signedInAs,
      'the signed in user'
    )
    assert.equal(
      (await enterAddressPage.signedInAs.textContent()).trim(),
      `You are signed in as ${firstName} ${lastName}.`
    )
  }
)

Then(
  'I should see that I am representing my organisation as an {word}',
  /** @this {PlaywrightWorld} */
  async function (relationship) {
    const { organisationName } = this.defraIdUser
    const representing = this.pageObjects.enterAddressPage.representing
    await waitForVisible(
      this.page,
      representing,
      'the represented organisation'
    )
    assert.equal(
      (await representing.textContent()).trim(),
      `You are representing ${organisationName} as an ${relationship}.`
    )
  }
)
