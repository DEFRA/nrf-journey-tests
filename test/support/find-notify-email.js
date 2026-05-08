import { NotifyClient } from './notify-client.js'

const retryDelayMs = 2_000
const maxAttempts = 3
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function findNotifyEmail(apiKey, emailAddress, reference, expectedText) {
  const client = new NotifyClient(apiKey)
  if (process.env.HTTP_PROXY) {
    const proxyConfig = {
      host: 'localhost',
      port: 3128
    }

    client.setProxy(proxyConfig)
  }
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await sleep(retryDelayMs)

    const response = await client.getNotifications(
      'email',
      'delivered',
      reference
    )
    const notifications = response.data?.notifications ?? []

    const match = notifications.find(
      (n) => n.email_address === emailAddress && n.body?.includes(expectedText)
    )

    if (match) return match
  }

  return null
}

export { findNotifyEmail }
