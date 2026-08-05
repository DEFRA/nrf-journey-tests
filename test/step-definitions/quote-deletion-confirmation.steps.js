import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'
import { waitForVisible } from '../support/wait-for-visible.js'

Given(
  'I have a quote ready to submit',
  // This chains ~10 prior actions before the final wait below, so the
  // default 15s step timeout leaves little headroom for that wait alone —
  // give the whole setup more room.
  { timeout: 30_000 },
  async function () {
    await this.pageObjects.homePage.open()
    await this.pageObjects.homePage.startNow()
    await this.pageObjects.planningTypePage.selectPlanningType(
      'Full planning permission'
    )
    await this.page.getByRole('button', { name: 'Continue' }).click()
    await this.pageObjects.confirmHousingPage.selectYes()
    await this.page.getByRole('button', { name: 'Continue' }).click()
    await this.pageObjects.residentialPage.fillResidentialUnits('10')
    await this.page.getByRole('button', { name: 'Continue' }).click()
    await this.pageObjects.boundaryTypePage.selectBoundaryType('Draw on a map')
    await this.page.getByRole('button', { name: 'Continue' }).click()
    // Skip the map drawing step by navigating directly to email
    await this.pageObjects.emailPage.open()
    await this.pageObjects.emailPage.fillEmail('test@example.com')
    await this.page.getByRole('button', { name: 'Continue' }).click()
    await waitForVisible(
      this.page,
      this.pageObjects.checkYourAnswersPage.pageHeading,
      'the Check Your Answers page heading',
      { timeoutMs: 20_000 }
    )
  }
)

When('I click the Delete button', async function () {
  await this.pageObjects.checkYourAnswersPage.delete()
})

When('I click Delete to confirm deletion', async function () {
  await this.pageObjects.deleteQuotePage.clickYes()
})

Then('I should see the deletion confirmation page', async function () {
  const panel = this.pageObjects.deleteQuoteConfirmationPage.panelTitle
  await waitForVisible(this.page, panel, 'the deletion confirmation panel')
  assert.equal(
    (await panel.textContent()).trim(),
    'Your details have been deleted'
  )
})
