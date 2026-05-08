import { NotifyClient } from './notify-client.js'

const retryDelayMs = 2_000
const maxAttempts = 3
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function findNotifyEmail(apiKey, emailAddress, expectedText) {
  const client = new NotifyClient(apiKey)

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await sleep(retryDelayMs)

    const response = await client.getNotifications('email', 'delivered')
    const notifications = response.data?.notifications ?? []

    const match = notifications.find(
      (n) => n.email_address === emailAddress && n.body?.includes(expectedText)
    )

    if (match) return match
  }

  return null
}

export { findNotifyEmail }
