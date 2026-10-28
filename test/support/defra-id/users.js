// The Defra ID test users, one per user type. The same people exist as real
// non-prod accounts (see the "Test users (non-prod)" Confluence page) and are
// mirrored as on-the-fly users in the defra-id-stub, so a scenario can assert
// the same name and organisation in either DEFRA_ID_MODE. The real email can
// be overridden with the user's emailEnvVar.
/**
 * @typedef {object} DefraIdUser
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} emailEnvVar - env var that overrides the real account email
 * @property {string} realEmail - email of the real non-prod account
 * @property {string} [organisationName] - organisation the user acts for
 * @property {string} [relationshipRole] - relationship to the organisation, e.g. Employee
 */

/** @typedef {'individual' | 'employee' | 'agent'} DefraIdUserType */

/** @type {Record<DefraIdUserType, DefraIdUser>} */
export const defraIdUsers = {
  individual: {
    firstName: 'Chas',
    lastName: 'Chandler',
    emailEnvVar: 'DEFRA_ID_INDIVIDUAL_EMAIL',
    realEmail: 'nrfnonprod+chaschandler@gmail.com'
  },
  employee: {
    firstName: 'Helen',
    lastName: 'Hanks',
    emailEnvVar: 'DEFRA_ID_EMPLOYEE_EMAIL',
    realEmail: 'nrfnonprod+hamblinhousebuildersemployee@gmail.com',
    organisationName: 'Hamblin Housebuilders',
    relationshipRole: 'Employee'
  },
  agent: {
    firstName: 'Amy',
    lastName: 'Allen',
    emailEnvVar: 'DEFRA_ID_AGENT_EMAIL',
    realEmail: 'nrfnonprod+argentagentsemployee@gmail.com',
    organisationName: 'Argent Agents',
    relationshipRole: 'Agent'
  }
}

/**
 * @param {string} userType
 * @returns {DefraIdUser}
 */
export function getDefraIdUser(userType) {
  const user = defraIdUsers[userType]
  if (!user) {
    throw new Error(
      `Unknown Defra ID user type "${userType}". Expected one of: ${Object.keys(defraIdUsers).join(', ')}`
    )
  }
  return user
}
