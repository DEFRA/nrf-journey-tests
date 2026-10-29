import { Page } from './page.js'

class DefraAccountOrganisationPage extends Page {
  open() {
    return super.open('/request-to-use/defra-account-organisation')
  }
}

export { DefraAccountOrganisationPage }
