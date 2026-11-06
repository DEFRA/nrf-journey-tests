import assert from 'node:assert/strict'
import { Then } from '@cucumber/cucumber'

/** @typedef {import('../support/world.js').PlaywrightWorld} PlaywrightWorld */

const SURVEY_URL_BY_JOURNEY = {
  quote:
    'https://defragroup.eu.qualtrics.com/jfe/form/SV_9yRhrdtbb3vmw86?Journey=Quote',
  'request to use':
    'https://defragroup.eu.qualtrics.com/jfe/form/SV_9yRhrdtbb3vmw86?Journey=RequestToUse'
}

Then(
  'the beta banner should link to the {string} survey',
  /** @this {PlaywrightWorld} */
  async function (journey) {
    const expectedUrl = SURVEY_URL_BY_JOURNEY[journey]
    assert.ok(expectedUrl, `Unknown journey "${journey}"`)
    const banner = this.page.getByRole('region', { name: 'Give feedback' })
    const feedbackLink = banner.getByRole('link', {
      name: 'give your feedback (opens in new tab)'
    })
    await feedbackLink.waitFor({ state: 'visible' })
    assert.equal(
      await feedbackLink.getAttribute('href'),
      expectedUrl,
      `Expected the beta banner survey link to point at the ${journey} survey`
    )
    assert.equal(await feedbackLink.getAttribute('target'), '_blank')
  }
)
