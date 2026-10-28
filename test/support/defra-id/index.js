// The only module step definitions and hooks import for Defra ID sign-in. It
// picks the defra-id-stub or the real Defra ID from DEFRA_ID_MODE (default
// "real"); everything specific to one of them lives in its own subfolder.
import { baseUrl } from '../base-url.js'
import { getDefraIdUser } from './users.js'
import { registerStubUser, expireStubUser } from './stub/api.js'
import { signInWithStub } from './stub/sign-in.js'
import { signInWithRealDefraId } from './real/sign-in.js'

const mode = process.env.DEFRA_ID_MODE || 'real'
if (mode !== 'real' && mode !== 'stub') {
  throw new Error(`DEFRA_ID_MODE must be "real" or "stub", got "${mode}"`)
}

export const isStubMode = mode === 'stub'

/** @typedef {import('../world.js').PlaywrightWorld} PlaywrightWorld */

// Shared password of the non-prod test accounts (listed on the NRF "Test users
// (non-prod)" Confluence page). Not a secret.
const DEFAULT_USER_PASSWORD = 'P4ssw0rd!$'

/**
 * Chooses the Defra ID user for this scenario and stores it on the world.
 * In stub mode it registers the user with the stub, so call it before the
 * browser navigates to the sign-in page (the stub lists users when it renders).
 * @param {object} options
 * @param {PlaywrightWorld} options.world
 * @param {import('./users.js').DefraIdUserType} options.userType
 */
export async function prepareDefraIdUser({ world, userType }) {
  const user = getDefraIdUser(userType)
  let email
  if (isStubMode) {
    const stubUser = await registerStubUser(user)
    world.stubUserId = stubUser.userId
    email = stubUser.email
  } else {
    email = process.env[user.emailEnvVar] || user.realEmail
  }
  world.defraIdUser = { ...user, email }
}

/**
 * Completes sign-in on the Defra ID page the browser has been redirected to,
 * then waits for the redirect back to the service.
 * @param {PlaywrightWorld} world
 */
export async function signInToDefraId(world) {
  const { page, defraIdUser } = world
  if (!defraIdUser) {
    throw new Error('No Defra ID user: call prepareDefraIdUser first')
  }

  if (isStubMode) {
    await signInWithStub({ page, email: defraIdUser.email })
  } else {
    await signInWithRealDefraId({
      page,
      email: defraIdUser.email,
      password: process.env.DEFRA_ID_USER_PASSWORD || DEFAULT_USER_PASSWORD
    })
  }

  const serviceOrigin = new URL(baseUrl).origin
  await page.waitForURL((url) => url.origin === serviceOrigin, {
    timeout: 60_000
  })
}

/**
 * Removes the scenario's stub user. Does nothing in real mode.
 * @param {PlaywrightWorld} world
 */
export async function cleanUpDefraIdUser(world) {
  if (world.stubUserId) {
    await expireStubUser(world.stubUserId)
  }
}
