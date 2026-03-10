---
name: ui-test
description: Generate Playwright + Cucumber E2E tests for a NRF frontend user journey
---

You are generating Playwright + Cucumber E2E tests for the **Nature Restoration Fund (NRF)** frontend service (`nrf-frontend`, Hapi.js + Nunjucks + GOV.UK Frontend).

Before writing any code, read `.ai/coding-rules.md` for conventions, patterns, and what to avoid.

---

## Application domain

**NRF (Nature Restoration Fund)** is a UK government scheme that allows property developers to calculate and pay an environmental impact levy. The frontend guides developers through a quote journey to estimate their levy.

Key terms:

- **EDP (Environmental Delivery Plan):** A pre-computed plan that the levy calculation depends on. If no EDP exists for the area, the service routes users to an alternative info page.
- **Boundary:** The spatial extent of a development — entered by drawing on a map or uploading a file (shapefile, GeoJSON, KML).
- **Development types:** Categories of development (housing, other-residential) that determine which sub-pages are shown.
- **RLB (Relevant Local Body):** Local Planning Authority that must approve the application.

---

## User journeys in scope

| Journey | Status  | Description                        |
| ------- | ------- | ---------------------------------- |
| Quote   | Active  | Developer calculates levy estimate |
| Apply   | Planned | Full application submission        |
| Verify  | Planned | LPA staff verify RLB details       |

---

## Pages — routes, headings, form fields

These are the actual routes and form field names from the source. Always use these exact names.

### Home page

| Property          | Value                                 |
| ----------------- | ------------------------------------- |
| Route             | `GET /`                               |
| Page title        | `Nature Restoration Fund - Gov.uk`    |
| Page heading (h1) | `Nature Restoration Fund`             |
| Key element       | Start button → `/quote/boundary-type` |

### Boundary type

| Property          | Value                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| Route             | `GET /quote/boundary-type`, `POST /quote/boundary-type`                 |
| Page heading (h1) | `Choose how you would like to show us the boundary of your development` |
| Field name        | `boundaryEntryType`                                                     |
| Options           | `draw` (radio), `upload` (radio)                                        |
| Validation        | Required                                                                |
| Next page         | `/quote/next` (placeholder — map/upload pages not yet wired)            |

### Development types

| Property   | Value                                                            |
| ---------- | ---------------------------------------------------------------- |
| Route      | `GET /quote/development-types`, `POST /quote/development-types`  |
| Field name | `developmentTypes`                                               |
| Options    | `housing` (checkbox), `other-residential` (checkbox)             |
| Validation | At least one required                                            |
| Next page  | If housing selected → `/quote/residential`; else → `/quote/next` |

### Residential

| Property   | Value                                                         |
| ---------- | ------------------------------------------------------------- |
| Route      | `GET /quote/residential`, `POST /quote/residential`           |
| Field name | `residentialBuildingCount`                                    |
| Input type | Numeric, pattern `[0-9]*`, width class `govuk-input--width-1` |
| Validation | Required                                                      |
| Next page  | `/quote/next` (placeholder)                                   |

### Email

| Property   | Value                                                  |
| ---------- | ------------------------------------------------------ |
| Route      | `GET /quote/email`, `POST /quote/email`                |
| Field name | `email`                                                |
| Input type | Email, max 254 characters                              |
| Validation | Required, valid email format, no spaces, max 254 chars |
| Next page  | `/quote/next` (placeholder)                            |

### Upload boundary

| Property         | Value                                                       |
| ---------------- | ----------------------------------------------------------- |
| Route            | `GET /quote/upload-boundary`, `POST /quote/upload-boundary` |
| Field name       | `file`                                                      |
| Input type       | File (multipart form)                                       |
| Accepted formats | `.shp`, `.geojson`, `.json`, `.kml`                         |
| Max size         | 2MB                                                         |
| Validation       | Required, file type, file size                              |
| Next page        | TBD                                                         |

### No EDP

| Property | Value                                             |
| -------- | ------------------------------------------------- |
| Route    | `GET /quote/no-edp`                               |
| Type     | Informational — no form                           |
| Purpose  | Shown when no EDP exists for the development area |

### Upload received

| Property | Value                                        |
| -------- | -------------------------------------------- |
| Route    | `GET /quote/upload-received`                 |
| Type     | Success/confirmation panel — no form         |
| Purpose  | Confirmation that boundary file was received |

---

## GOV.UK component selectors

Use role-based selectors first. These are the standard GOV.UK Frontend patterns:

```js
// Radio buttons
page.getByRole('radio', { name: 'Draw the boundary on a map' })
page.getByRole('radio', { name: 'Upload a file' })

// Checkboxes
page.getByRole('checkbox', { name: 'Housing' })
page.getByRole('checkbox', { name: 'Other residential' })

// Text/email/number inputs — use label text
page.getByLabel('Email address')
page.getByLabel('Number of residential buildings')

// File upload
page.getByLabel('Upload a boundary file')

// Continue/Submit button
page.getByRole('button', { name: 'Continue' })

// Start button on home page
page.getByRole('link', { name: 'Start now' })

// Error summary (GOV.UK pattern)
page.locator('.govuk-error-summary')
page.locator('.govuk-error-message')

// Page heading
page.locator('h1')

// Back link
page.locator('.govuk-back-link')
```

Always check the actual Nunjucks template in `../nrf-frontend/src/server/<page>/` for exact label text before writing selectors.

---

## Session and state

- Sessions are server-side (memory in dev, Redis in prod). Do not manipulate cookies.
- CSRF tokens are injected automatically — forms submit via POST with the token; Playwright handles this transparently.
- `ENABLE_DEFRA_ID=false` disables authentication for tests. Do not test the OIDC flow unless explicitly asked.

---

## Implementation checklist

For every new page under test:

1. Check `flows/<journey>.md` — if it does not exist, stop and ask the user to create it
2. Read the Nunjucks template and controller in `../nrf-frontend/src/server/<page>/` for exact field names and label text
3. Create `test/page-objects/<name>.page.js` — extend `Page`, expose locators as getters and actions as async methods, no assertions
4. Register the page object in `test/support/world.js` under `this.pageObjects`
5. Create `test/features/<journey>.feature` — tag every scenario `@smoke` and/or `@regression`
6. Create `test/step-definitions/<journey>.steps.js` — assertions go here, not in page objects
7. Run headed: `npm run test:e2e:debug`
8. Lint and format: `npm run lint && npm run format:check`

---

## Page object template

```js
import { Page } from './page.js'

export class BoundaryTypePage extends Page {
  constructor(page, baseUrl) {
    super(page, baseUrl)
  }

  async open() {
    await this.goto('/quote/boundary-type')
  }

  get drawRadio() {
    return this.page.getByRole('radio', { name: 'Draw the boundary on a map' })
  }

  get uploadRadio() {
    return this.page.getByRole('radio', { name: 'Upload a file' })
  }

  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue' })
  }

  get errorSummary() {
    return this.page.locator('.govuk-error-summary')
  }

  async selectBoundaryType(type) {
    if (type === 'draw') await this.drawRadio.click()
    if (type === 'upload') await this.uploadRadio.click()
  }

  async continue() {
    await this.continueButton.click()
  }
}
```

---

## Feature file template

```gherkin
@smoke @regression
Feature: Boundary type selection

  Scenario: Developer selects upload boundary type and continues
    Given I am on the boundary type page
    When I select "upload"
    And I continue
    Then I should be on the upload boundary page

  Scenario: Developer submits without selecting a boundary type
    Given I am on the boundary type page
    When I continue without selecting a boundary type
    Then I should see a validation error
```

---

## Step definition template

```js
import assert from 'node:assert/strict'
import { Given, When, Then } from '@cucumber/cucumber'

Given('I am on the boundary type page', async function () {
  await this.pageObjects.boundaryTypePage.open()
})

When('I select {string}', async function (type) {
  await this.pageObjects.boundaryTypePage.selectBoundaryType(type)
})

When('I continue', async function () {
  await this.pageObjects.boundaryTypePage.continue()
})

When('I continue without selecting a boundary type', async function () {
  await this.pageObjects.boundaryTypePage.continue()
})

Then('I should see a validation error', async function () {
  const errorSummary = this.pageObjects.boundaryTypePage.errorSummary
  await errorSummary.waitFor({ state: 'visible' })
  assert.ok(await errorSummary.isVisible())
})
```
