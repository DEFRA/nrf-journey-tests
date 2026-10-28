/**
 * Signs in on the stub's authorize page by choosing the user's link. The user
 * must have been registered before this page was rendered.
 * @param {object} options
 * @param {import('playwright').Page} options.page
 * @param {string} options.email
 */
export async function signInWithStub({ page, email }) {
  await page.locator(`a[href*="user=${email}"]`).click()
}
