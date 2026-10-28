/**
 * Signs in with a real non-prod Defra ID account through GOV.UK One Login.
 * The non-prod accounts don't challenge for MFA on sign-in.
 * @param {object} options
 * @param {import('playwright').Page} options.page
 * @param {string} options.email
 * @param {string} options.password
 */
export async function signInWithRealDefraId({ page, email, password }) {
  await page
    .getByRole('radio', { name: 'Sign in with GOV UK One Login' })
    .click()
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('button', { name: 'Sign in', exact: true }).click()

  await page.locator('#email').fill(email)
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.locator('#password').fill(password)
  await page.locator('button[type="submit"]').click()
}
