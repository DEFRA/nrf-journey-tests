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
import { UploadBoundaryPage } from '../page-objects/upload-boundary.page.js'
import { UploadPreviewMapPage } from '../page-objects/upload-preview-map.page.js'
import { WasteWaterPage } from '../page-objects/waste-water.page.js'
import { NoEdpPage } from '../page-objects/no-edp.page.js'
import { DrawBoundaryPage } from '../page-objects/draw-boundary.page.js'
import { QuoteDetailsPage } from '../page-objects/quote-details.page.js'

setDefaultTimeout(15000)

const baseUrl = process.env.ENVIRONMENT
  ? `https://nrf-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`
  : process.env.BASE_URL || 'http://localhost:3000'

const headless = process.env.E2E_HEADFUL !== 'true'

const browsers = { chromium, firefox, webkit }
const browserName = process.env.BROWSER || 'chromium'
const browserEngine = browsers[browserName] ?? chromium

// Set BROWSER_CHANNEL=chrome locally to use the system Chrome installation,
// which supports WebGL in headless mode. The Playwright-bundled headless shell
// has no GPU and the interactive map's WebGL check shows a fallback message,
// preventing the draw boundary journey from running. CI uses the full Playwright
// Chromium (installed with --with-deps) which has SwiftShader and does not need
// this override.
const browserChannel = process.env.BROWSER_CHANNEL || undefined

// Headless Chromium's default UA contains "HeadlessChrome", which the quote
// access link treats as a bot/previewer and serves a dataless stub. Present a
// real Chrome UA so journeys that follow a quote link see the actual page.
const realChromeUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'

class PlaywrightWorld extends World {
  async openBrowser() {
    this.browser = await browserEngine.launch({
      headless,
      ...(browserChannel ? { channel: browserChannel } : {})
    })
    this.context = await this.browser.newContext(
      browserName === 'chromium' ? { userAgent: realChromeUserAgent } : {}
    )

    if (process.env.PROFILE === 'prod') {
      await this.context.setExtraHTTPHeaders({
        'x-nrf-profile': 'prod'
      })
    }

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
      ),
      uploadBoundaryPage: new UploadBoundaryPage(this.page, baseUrl),
      uploadPreviewMapPage: new UploadPreviewMapPage(this.page, baseUrl),
      wasteWaterPage: new WasteWaterPage(this.page, baseUrl),
      noEdpPage: new NoEdpPage(this.page, baseUrl),
      drawBoundaryPage: new DrawBoundaryPage(this.page, baseUrl),
      quoteDetailsPage: new QuoteDetailsPage(this.page, baseUrl)
    }
  }

  async closeBrowser() {
    await this.browser?.close()
  }
}

setWorldConstructor(PlaywrightWorld)
