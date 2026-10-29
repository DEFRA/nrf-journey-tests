import {
  setWorldConstructor,
  World,
  setDefaultTimeout
} from '@cucumber/cucumber'
import { chromium, firefox, webkit } from 'playwright'
import { HomePage } from '../page-objects/home.page.js'
import { WhatWouldYouLikeToDoPage } from '../page-objects/what-would-you-like-to-do.page.js'
import { HaveNrlReferencePage } from '../page-objects/have-nrl-reference.page.js'
import { EnterNrlReferencePage } from '../page-objects/enter-nrl-reference.page.js'
import { LinkExpiredPage } from '../page-objects/link-expired.page.js'
import { EmailConfirmationPage } from '../page-objects/email-confirmation.page.js'
import { PlanningTypePage } from '../page-objects/planning-type.page.js'
import { BoundaryTypePage } from '../page-objects/boundary-type.page.js'
import { ConfirmHousingPage } from '../page-objects/confirm-housing.page.js'
import { ResidentialPage } from '../page-objects/residential.page.js'
import { EmailPage } from '../page-objects/email.page.js'
import { CheckYourAnswersPage } from '../page-objects/check-your-answers.page.js'
import { ConfirmationPage } from '../page-objects/confirmation.page.js'
import { DeleteQuotePage } from '../page-objects/delete-quote.page.js'
import { DeleteQuoteConfirmationPage } from '../page-objects/delete-quote-confirmation.page.js'
import { UploadBoundaryPage } from '../page-objects/upload-boundary.page.js'
import { UploadPreviewMapPage } from '../page-objects/upload-preview-map.page.js'
import { NoEdpPage } from '../page-objects/no-edp.page.js'
import { DrawBoundaryPage } from '../page-objects/draw-boundary.page.js'
import { ReviewQuoteDetailsPage } from '../page-objects/review-quote-details.page.js'
import { AcceptLevyPage } from '../page-objects/accept-levy.page.js'
import { DefraAccountUserTypePage } from '../page-objects/defra-account-user-type.page.js'
import { DefraAccountIndividualPage } from '../page-objects/defra-account-individual.page.js'
import { DefraAccountOrganisationPage } from '../page-objects/defra-account-organisation.page.js'
import { DefraAccountAgentPage } from '../page-objects/defra-account-agent.page.js'
import { EnterAddressPage } from '../page-objects/enter-address.page.js'
import { AnalyticsInternalPage } from '../page-objects/analytics-internal.page.js'
import {
  isBrowserStack,
  connectBrowserStack,
  enableIosAutoWait
} from './browserstack.js'
import { baseUrl } from './base-url.js'

// Real remote devices are slower than a local headless browser.
setDefaultTimeout(isBrowserStack ? 60000 : 15000)

const headless = process.env.E2E_HEADFUL !== 'true'

const browsers = { chromium, firefox, webkit }
const browserName = process.env.BROWSER || 'chromium'
const browserEngine = browsers[browserName] ?? chromium

// Optional: set BROWSER_CHANNEL=chrome to use the system Chrome installation
// instead of Playwright's bundled Chromium. Not the default: on macOS the system
// Chrome took ~14s to load the draw map page versus <1s in bundled Chromium,
// which renders the WebGL map fine both headed (GPU) and headless (SwiftShader).
const browserChannel = process.env.BROWSER_CHANNEL || undefined

// Headless Chromium's default UA contains "HeadlessChrome", which the quote
// access link treats as a bot/previewer and serves a dataless stub. Present a
// real Chrome UA so journeys that follow a quote link see the actual page.
const realChromeUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'

// In headful debug runs, Chrome throttles rendering/timers for windows it
// considers backgrounded or occluded (e.g. when the Inspector or another
// window has focus), which makes the paused map feel sluggish even though
// the machine has spare capacity. These flags are debug-only — CI runs
// headless and never sets them — so they can't affect the real test runs.
const debugPerformanceArgs = [
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-background-timer-throttling',
  '--disable-features=CalculateNativeWinOcclusion'
]

// CDP test containers reach the internet (Defra ID) only through HTTP_PROXY, but
// the CDP-hosted frontend must be reached directly.
function browserProxy() {
  if (!process.env.HTTP_PROXY || process.env.ENVIRONMENT === undefined) {
    return {}
  }
  const { origin, username, password } = new URL(process.env.HTTP_PROXY)
  return {
    proxy: {
      server: origin,
      username: decodeURIComponent(username),
      password: decodeURIComponent(password),
      bypass: '*.cdp-int.defra.cloud'
    }
  }
}

export class PlaywrightWorld extends World {
  async openBrowser(sessionName) {
    if (isBrowserStack) {
      const remote = await connectBrowserStack(sessionName)
      this.context = remote.context
      this.closeRemote = remote.close
    } else {
      this.browser = await browserEngine.launch({
        headless,
        args: headless ? [] : debugPerformanceArgs,
        ...(browserChannel ? { channel: browserChannel } : {}),
        ...browserProxy()
      })
      this.context = await this.browser.newContext({
        ...(browserName === 'chromium'
          ? { userAgent: realChromeUserAgent }
          : {}),
        viewport: { width: 1024, height: 800 }
      })
    }

    this.page = await this.context.newPage()
    this.page.setDefaultNavigationTimeout(isBrowserStack ? 90_000 : 60_000)
    enableIosAutoWait(this.page)
    this.pageObjects = {
      homePage: new HomePage(this.page, baseUrl),
      whatWouldYouLikeToDoPage: new WhatWouldYouLikeToDoPage(
        this.page,
        baseUrl
      ),
      haveNrlReferencePage: new HaveNrlReferencePage(this.page, baseUrl),
      enterNrlReferencePage: new EnterNrlReferencePage(this.page, baseUrl),
      emailConfirmationPage: new EmailConfirmationPage(this.page, baseUrl),
      linkExpiredPage: new LinkExpiredPage(this.page, baseUrl),
      planningTypePage: new PlanningTypePage(this.page, baseUrl),
      boundaryTypePage: new BoundaryTypePage(this.page, baseUrl),
      confirmHousingPage: new ConfirmHousingPage(this.page, baseUrl),
      residentialPage: new ResidentialPage(this.page, baseUrl),
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
      noEdpPage: new NoEdpPage(this.page, baseUrl),
      drawBoundaryPage: new DrawBoundaryPage(this.page, baseUrl),
      reviewQuoteDetailsPage: new ReviewQuoteDetailsPage(this.page, baseUrl),
      acceptLevyPage: new AcceptLevyPage(this.page, baseUrl),
      defraAccountUserTypePage: new DefraAccountUserTypePage(
        this.page,
        baseUrl
      ),
      defraAccountIndividualPage: new DefraAccountIndividualPage(
        this.page,
        baseUrl
      ),
      defraAccountOrganisationPage: new DefraAccountOrganisationPage(
        this.page,
        baseUrl
      ),
      defraAccountAgentPage: new DefraAccountAgentPage(this.page, baseUrl),
      enterAddressPage: new EnterAddressPage(this.page, baseUrl),
      analyticsInternalPage: new AnalyticsInternalPage(this.page, baseUrl)
    }
  }

  async closeBrowser() {
    await this.browser?.close()
    await this.closeRemote?.()
  }
}

setWorldConstructor(PlaywrightWorld)
