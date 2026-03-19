import assert from 'node:assert/strict'
import { Then } from '@cucumber/cucumber'

Then('I should be on the email page', async function () {
  const heading = this.pageObjects.emailPage.pageHeading
  await heading.waitFor({ state: 'visible' })
  assert.equal((await heading.textContent()).trim(), 'Enter your email address')
})
