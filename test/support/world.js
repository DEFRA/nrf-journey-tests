import {
  setWorldConstructor,
  World,
  setDefaultTimeout
} from '@cucumber/cucumber'
import { chromium, firefox, webkit } from 'playwright'
import { HomePage } from '../page-objects/home.page.js'
import { BoundaryTypePage } from '../page-objects/boundary-type.page.js'
import { DevelopmentTypesPage } from '../page-objects/development-types.page.js'
import { ResidentialPage } from '../page-objects/residential.page.js'
import { PeopleCountPage } from '../page-objects/people-count.page.js'
import { EmailPage } from '../page-objects/email.page.js'
import { CheckYourAnswersPage } from '../page-objects/check-your-answers.page.js'
import { ConfirmationPage } from '../page-objects/confirmation.page.js'
import { DeleteQuotePage } from '../page-objects/delete-quote.page.js'
import { DeleteQuoteConfirmationPage } from '../page-objects/delete-quote-confirmation.page.js'

setDefaultTimeout(15000)

const baseUrl = process.env.ENVIRONMENT
  ? `https://nrf-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`
  : process.env.BASE_URL || 'http://localhost:3000'

const headless = process.env.E2E_HEADFUL !== 'true'

const browsers = { chromium, firefox, webkit }
const browserName = process.env.BROWSER || 'chromium'
const browserEngine = browsers[browserName] ?? chromium

class PlaywrightWorld extends World {
  async openBrowser() {
    this.browser = await browserEngine.launch({ headless })
    this.context = await this.browser.newContext()
    this.page = await this.context.newPage()
    this.pageObjects = {
      homePage: new HomePage(this.page, baseUrl),
      boundaryTypePage: new BoundaryTypePage(this.page, baseUrl),
      developmentTypesPage: new DevelopmentTypesPage(this.page, baseUrl),
      residentialPage: new ResidentialPage(this.page, baseUrl),
      peopleCountPage: new PeopleCountPage(this.page, baseUrl),
      emailPage: new EmailPage(this.page, baseUrl),
      checkYourAnswersPage: new CheckYourAnswersPage(this.page, baseUrl),
      confirmationPage: new ConfirmationPage(this.page, baseUrl),
      deleteQuotePage: new DeleteQuotePage(this.page, baseUrl),
      deleteQuoteConfirmationPage: new DeleteQuoteConfirmationPage(
        this.page,
        baseUrl
      )
    }
  }

  async closeBrowser() {
    await this.browser?.close()
  }
}

setWorldConstructor(PlaywrightWorld)
