import { Page } from './page.js'

class DefraAccountIndividualPage extends Page {
  open() {
    return super.open('/request-to-use/defra-account-individual')
  }
}

export { DefraAccountIndividualPage }
