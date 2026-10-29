import { randomUUID } from 'node:crypto'

// Node-side URL of the defra-id-stub (its published port), not the origin the
// browser is redirected to.
const stubUrl = process.env.DEFRA_ID_STUB_URL || 'http://localhost:3200'
const registerUrl = `${stubUrl}/cdp-defra-id-stub/API/register`
const attempts = 3

/** @typedef {import('../users.js').DefraIdUser} DefraIdUser */

/**
 * @param {DefraIdUser} user
 */
function buildStubRelationships(user) {
  const links = [
    ...(user.otherRelationships ?? []),
    ...(user.organisationName
      ? [
          {
            organisationName: user.organisationName,
            relationshipRole: user.relationshipRole
          }
        ]
      : [])
  ]
  return links.map(({ organisationName, relationshipRole }) => ({
    organisationName,
    relationshipRole,
    roleName: relationshipRole,
    roleStatus: '1'
  }))
}

/**
 * @param {DefraIdUser} user
 */
function buildStubUser(user) {
  const userId = randomUUID()
  const relationships = buildStubRelationships(user)
  return {
    userId,
    email: `${userId}@example.com`,
    firstName: user.firstName,
    lastName: user.lastName,
    loa: '1',
    aal: '1',
    enrolmentCount: Math.max(relationships.length, 1),
    enrolmentRequestCount: 1,
    relationships
  }
}

/**
 * Registers a fresh stub user (unique id and email, so parallel scenarios
 * don't clash) for the given user definition.
 * @param {DefraIdUser} user
 * @returns {Promise<{userId: string, email: string}>}
 */
export async function registerStubUser(user) {
  const stubUser = buildStubUser(user)
  let lastError

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stubUser)
      })
      if (response.ok) {
        return { userId: stubUser.userId, email: stubUser.email }
      }
      lastError = new Error(`HTTP ${response.status} ${response.statusText}`)
    } catch (error) {
      lastError = error
    }
    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  throw new Error(
    `Could not register a user with the defra-id-stub at ${registerUrl} after ${attempts} attempts: ${lastError.message}. Is the stub running?`
  )
}

export async function expireStubUser(userId) {
  try {
    await fetch(`${registerUrl}/${userId}/expire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
  } catch {
    // Clean-up only: the stub is throwaway, so a failure must not fail the scenario
  }
}
