/**
 * @param {import('@playwright/test').Page} page
 */
async function clickContinue(page) {
  await page.getByRole('button', { name: 'Continue' }).click()
}

export { clickContinue }
