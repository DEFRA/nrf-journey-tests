import { NotifyClient } from './notify-client.js'
import { bootstrap } from 'global-agent'

const retryDelayMs = 5_000
const maxAttempts = 10
const acceptedStatuses = ['sending', 'delivered']
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function findNotifyEmail(
  apiKey,
  emailAddress,
  expectedText,
  log,
  sentAfter
) {
  if (process.env.HTTP_PROXY) {
    bootstrap()
    global.GLOBAL_AGENT.HTTP_PROXY = process.env.HTTP_PROXY
  }
  const client = new NotifyClient(apiKey)
  // NRL references are short and hash-derived, so they can repeat across runs
  // against the shared Notify account. Only accept an email created during this
  // run, otherwise a previous run's email with the same reference (whose token
  // is invalid against the current database) could be matched. The caller passes
  // the moment just before the email is triggered, so a small buffer is enough
  // to absorb clock skew between the runner and Notify without re-admitting an
  // earlier run's emails (which are minutes or more older).
  const clockSkewBufferMs = 30 * 1000
  const afterTime = sentAfter
    ? new Date(sentAfter).getTime() - clockSkewBufferMs
    : 0

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await client.getNotifications('email')
    const notifications = response.data?.notifications ?? []

    const recipientEmails = notifications.filter(
      (n) =>
        n.email_address === emailAddress &&
        new Date(n.created_at).getTime() >= afterTime
    )
    let matchedEmailBody
    const match = recipientEmails.find((n) => {
      if (
        acceptedStatuses.includes(n.status) &&
        n.body?.includes(expectedText)
      ) {
        matchedEmailBody = n.body
        return true
      }
      return false
    })

    if (match) {
      log?.(
        `attempt ${attempt}/${maxAttempts}: matched email to ${emailAddress} (status: ${match.status})`
      )
      return matchedEmailBody
    }

    const statuses = recipientEmails.map((n) => n.status).join(', ')
    log?.(
      `attempt ${attempt}/${maxAttempts}: no match for ${emailAddress} containing "${expectedText}". ` +
        `Emails to recipient: ${recipientEmails.length}${
          statuses ? ` (statuses: ${statuses})` : ''
        }`
    )

    if (attempt < maxAttempts) {
      await sleep(retryDelayMs)
    }
  }

  log?.(
    `gave up after ${maxAttempts} attempts (~${
      (maxAttempts * retryDelayMs) / 1000
    }s) ` + `looking for email to ${emailAddress} containing "${expectedText}"`
  )
  return null
}

export { findNotifyEmail }
