import { NotifyClient } from './notify-client.js'
import { bootstrap } from 'global-agent'

const retryDelayMs = 5_000
const maxAttempts = 3
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function findNotifyEmail(apiKey, emailAddress, expectedText) {
  if (process.env.HTTP_PROXY) {
    bootstrap()
    global.GLOBAL_AGENT.HTTP_PROXY = process.env.HTTP_PROXY
  }
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
