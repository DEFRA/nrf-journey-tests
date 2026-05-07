import { createRequire } from 'node:module'

const { NotifyClient } = createRequire(import.meta.url)(
  'notifications-node-client/client/notification.js'
)

export { NotifyClient }
