import { setWorldConstructor, World } from '@cucumber/cucumber'
import { chromium, firefox, webkit } from 'playwright'
import { HomePage } from '../page-objects/home.page.js'

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
      homePage: new HomePage(this.page, baseUrl)
    }
  }

  async closeBrowser() {
    await this.browser?.close()
  }
}

setWorldConstructor(PlaywrightWorld)
