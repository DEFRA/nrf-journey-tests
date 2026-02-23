import { setWorldConstructor, World } from '@cucumber/cucumber'
import { chromium } from 'playwright'
import { HomePage } from '../page-objects/home.page.js'

const baseUrl =
  process.env.BASE_URL ||
  (process.env.ENVIRONMENT
    ? `https://nrf-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`
    : 'http://localhost:3000')

const headless = process.env.E2E_HEADFUL !== 'true'

class PlaywrightWorld extends World {
  async openBrowser() {
    this.browser = await chromium.launch({ headless })
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
