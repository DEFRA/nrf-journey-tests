import { NotifyClient } from './notify-client.js'
import { bootstrap } from 'global-agent'

const retryDelayMs = 5_000
const maxAttempts = 10
const acceptedStatuses = ['sending', 'delivered']
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function findNotifyEmail(apiKey, emailAddress, expectedText, log) {
  if (process.env.HTTP_PROXY) {
    bootstrap()
    global.GLOBAL_AGENT.HTTP_PROXY = process.env.HTTP_PROXY
  }
  const client = new NotifyClient(apiKey)

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await client.getNotifications('email')
    const notifications = response.data?.notifications ?? []

    const recipientEmails = notifications.filter(
      (n) => n.email_address === emailAddress
    )
    const match = recipientEmails.find(
      (n) =>
        acceptedStatuses.includes(n.status) && n.body?.includes(expectedText)
    )

    if (match) {
      log?.(
        `attempt ${attempt}/${maxAttempts}: matched email to ${emailAddress} (status: ${match.status})`
      )
      return match
    }

    const statuses = recipientEmails.map((n) => n.status).join(', ')
    log?.(
      `attempt ${attempt}/${maxAttempts}: no match for ${emailAddress} containing "${expectedText}". ` +
        `Emails to recipient: ${recipientEmails.length}${statuses ? ` (statuses: ${statuses})` : ''}`
    )

    if (attempt < maxAttempts) {
      await sleep(retryDelayMs)
    }
  }

  log?.(
    `gave up after ${maxAttempts} attempts (~${(maxAttempts * retryDelayMs) / 1000}s) ` +
      `looking for email to ${emailAddress} containing "${expectedText}"`
  )
  return null
}

export { findNotifyEmail }
