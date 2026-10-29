import { Page } from './page.js'

class DefraAccountAgentPage extends Page {
  open() {
    return super.open('/request-to-use/defra-account-agent')
  }
}

export { DefraAccountAgentPage }
