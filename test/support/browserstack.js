import { createRequire } from 'node:module'
import { _android, chromium, firefox, webkit } from 'playwright'
import { Local } from 'browserstack-local'

const require = createRequire(import.meta.url)

// BROWSERSTACK_DEVICE selects an entry from `devices` below. When unset, the
// tests launch a local browser instead.
const deviceKey = process.env.BROWSERSTACK_DEVICE

const engines = { chromium, firefox, webkit }

// Desktop browsers. Playwright connects to Chrome and Edge through chromium,
// and to BrowserStack's patched Firefox and WebKit builds (not the vendors'
// own Firefox and Safari) through firefox and webkit.
const desktop = (name, browser, browserVersion, os, osVersion) => {
  const engine = browser.startsWith('playwright-')
    ? browser.replace('playwright-', '')
    : 'chromium'
  return [
    name,
    {
      kind: 'desktop',
      engine,
      caps: {
        browser,
        browser_version: browserVersion,
        os,
        os_version: osVersion,
        resolution: '1920x1080'
      }
    }
  ]
}

// Real phones, then desktop browsers. There is no Firefox on Windows: its
// BrowserStack machine has no WebGL 2, which the draw map needs. Update device names and OS versions as
// BrowserStack adds newer ones, see
// https://www.browserstack.com/list-of-browsers-and-platforms/automate
const devices = Object.fromEntries([
  [
    'iphone',
    {
      kind: 'ios',
      caps: {
        browser: 'safari',
        browserName: 'safari',
        deviceName: 'iPhone 17',
        osVersion: '26',
        realMobile: 'true'
      }
    }
  ],
  [
    'android',
    {
      kind: 'android',
      caps: {
        browserName: 'chrome',
        deviceName: 'Google Pixel 10',
        osVersion: '16.0',
        realMobile: 'true'
      }
    }
  ],
  [
    'android-galaxy-s23',
    {
      kind: 'android',
      caps: {
        browserName: 'chrome',
        deviceName: 'Samsung Galaxy S23',
        osVersion: '13.0',
        realMobile: 'true'
      }
    }
  ],
  desktop('safari-macos', 'playwright-webkit', 'latest', 'OS X', 'Sequoia'),
  desktop('chrome-windows', 'chrome', 'latest', 'Windows', '11'),
  desktop('chrome-windows-latest-3', 'chrome', 'latest-3', 'Windows', '11'),
  desktop('edge-windows', 'edge', 'latest', 'Windows', '11'),
  desktop('edge-windows-latest-3', 'edge', 'latest-3', 'Windows', '11'),
  desktop('chrome-macos', 'chrome', 'latest', 'OS X', 'Sequoia'),
  desktop('chrome-macos-latest-3', 'chrome', 'latest-3', 'OS X', 'Sequoia'),
  desktop('firefox-macos', 'playwright-firefox', 'latest', 'OS X', 'Sequoia'),
  desktop(
    'firefox-macos-latest-3',
    'playwright-firefox',
    'latest-3',
    'OS X',
    'Sequoia'
  )
])

export const isBrowserStack = Boolean(deviceKey)

const localIdentifier = `nrf-journey-tests-${process.env.GITHUB_RUN_ID || 'local'}-${deviceKey}`

const wsEndpoint = (caps) =>
  `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`

function requireCredentials() {
  const missing = ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY'].filter(
    (name) => !process.env[name]
  )
  if (missing.length > 0) {
    throw new Error(
      `BROWSERSTACK_DEVICE is set but ${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} not`
    )
  }
}

function getDevice() {
  const device = devices[deviceKey]
  if (!device) {
    throw new Error(
      `Unknown BROWSERSTACK_DEVICE "${deviceKey}". Expected one of: ${Object.keys(devices).join(', ')}`
    )
  }
  return device
}

function buildCaps(device, sessionName) {
  return {
    ...device.caps,
    name: sessionName,
    build: `nrf-journey-tests-${process.env.GITHUB_RUN_ID || 'local'}`,
    project: 'Nature Restoration Fund',
    'browserstack.username': process.env.BROWSERSTACK_USERNAME,
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    // The app under test runs on localhost (docker compose), so the remote
    // device reaches it through the BrowserStack Local tunnel.
    'browserstack.local': 'true',
    'browserstack.localIdentifier': localIdentifier,
    'client.playwrightVersion': require('playwright/package.json').version
  }
}

/**
 * Connects to a BrowserStack browser and returns a context plus a close
 * function. Android drives Chrome through Playwright's Android API; iOS drives
 * Safari through a remote WebKit connection; desktop browsers connect through
 * the matching Playwright engine.
 */
export async function connectBrowserStack(sessionName) {
  const device = getDevice()
  const caps = buildCaps(device, sessionName)

  if (device.kind === 'android') {
    const android = await _android.connect(wsEndpoint(caps))
    await android.shell('am force-stop com.android.chrome')
    const context = await android.launchBrowser()
    return { context, close: () => android.close() }
  }

  const engine = device.kind === 'ios' ? webkit : engines[device.engine]
  const browser = await engine.connect({ wsEndpoint: wsEndpoint(caps) })
  const context = await browser.newContext()
  return { context, close: () => browser.close() }
}

// Real iOS devices run Playwright actions through BrowserStack's own
// implementation, which fails a click immediately with "No elements found"
// instead of retrying until the element appears (as local Playwright does).
// Every first action after a navigation is then a race, so wait for the
// element to be visible before acting on it. Only used for the iPhone, and only
// patches Locator actions that target visible elements: don't add actions here
// that are used on hidden elements (e.g. setInputFiles on a visually hidden
// file input), and page-level calls like page.click(selector) are not covered.
const autoWaitActions = ['click', 'fill', 'check', 'press', 'pressSequentially']
let autoWaitPatched = false

export function enableIosAutoWait(page) {
  if (deviceKey !== 'iphone' || autoWaitPatched) return
  const locatorPrototype = Object.getPrototypeOf(page.locator('body'))
  for (const action of autoWaitActions) {
    const original = locatorPrototype[action]
    locatorPrototype[action] = async function (...args) {
      await this.waitFor({ state: 'visible' })
      return original.apply(this, args)
    }
  }
  autoWaitPatched = true
}

export async function setSessionStatus(page, status, reason) {
  const command = `browserstack_executor: ${JSON.stringify({
    action: 'setSessionStatus',
    arguments: { status, reason }
  })}`
  await page.evaluate(() => {}, command)
}

let bsLocal

export function startBrowserStackLocal() {
  requireCredentials()
  bsLocal = new Local()
  return new Promise((resolve, reject) => {
    bsLocal.start(
      {
        key: process.env.BROWSERSTACK_ACCESS_KEY,
        localIdentifier
      },
      (err) => (err ? reject(err) : resolve())
    )
  })
}

export function stopBrowserStackLocal() {
  return new Promise((resolve) => {
    if (!bsLocal) return resolve()
    bsLocal.stop(() => resolve())
  })
}
