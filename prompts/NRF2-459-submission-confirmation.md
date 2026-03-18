# Prompt: NRF2-459 Submission Confirmation — UI Test Implementation

## Context

Implement Playwright + Cucumber E2E tests for the NRF quote submission confirmation journey.

Read the following before writing any code:

- `flows/quote-submission-confirmation.md` — full flow description, routes, field names, page headings
- `.ai/coding-rules.md` — coding conventions
- `test/page-objects/page.js` and `test/page-objects/BasePage.js` — base classes to extend
- `test/support/world.js` — where to register new page objects

## Scope

Four scenarios from `test/features/quote-submission-confirmation.feature`:

- **Scenario A** — Housing happy path (ACs 1–3)
- **Scenario B** — Other residential happy path (ACs 1–3)
- **Scenario C** — Browser back from confirmation → redirected to start page (AC 4)
- **Scenario D** — Direct navigation to check-your-answers post-submission → redirected to start page (AC 5)

Do NOT implement validation error scenarios — they are out of scope for this ticket.

## Files to create

### 1. `test/page-objects/development-types.page.js`

Extend `Page`. Route: `/quote/development-types`.

Expose:

- `get housingCheckbox()` → `page.getByRole('checkbox', { name: 'Housing' })`
- `get otherResidentialCheckbox()` → `page.getByRole('checkbox', { name: 'Other residential' })`
- `get continueButton()` → `page.getByRole('button', { name: 'Continue' })`
- `async selectDevelopmentType(type)` — checks the matching checkbox by label text
- `async continue()` — clicks Continue
- `open()` → `super.open('/quote/development-types')`

### 2. `test/page-objects/residential.page.js`

Extend `Page`. Route: `/quote/residential`.

Expose:

- `get residentialUnitsInput()` → `page.locator('#residentialBuildingCount')`
- `get continueButton()` → `page.getByRole('button', { name: 'Continue' })`
- `async fillResidentialUnits(count)` — fills the input
- `async continue()` — clicks Continue
- `open()` → `super.open('/quote/residential')`

### 3. `test/page-objects/people-count.page.js`

Extend `Page`. Route: `/quote/people-count`.

Expose:

- `get peopleCountInput()` → `page.locator('[name="peopleCount"]')`
- `get continueButton()` → `page.getByRole('button', { name: 'Continue' })`
- `async fillPeopleCount(count)` — fills the input
- `async continue()` — clicks Continue
- `open()` → `super.open('/quote/people-count')`

### 4. `test/page-objects/email.page.js`

Extend `Page`. Route: `/quote/email`.

Expose:

- `get emailInput()` → `page.getByLabel('Enter your email address')`
- `get continueButton()` → `page.getByRole('button', { name: 'Continue' })`
- `async fillEmail(email)` — fills the input
- `async continue()` — clicks Continue
- `open()` → `super.open('/quote/email')`

### 5. `test/page-objects/check-your-answers.page.js`

Extend `Page`. Route: `/quote/check-your-answers`.

Expose:

- `get submitButton()` → `page.getByRole('button', { name: 'Submit' })`
- `async submit()` — clicks Submit
- `open()` → `super.open('/quote/check-your-answers')`

### 6. `test/page-objects/confirmation.page.js`

Extend `Page`. Route: `/quote/confirmation`.

Expose:

- `get panelTitle()` → `page.locator('.govuk-panel__title')`
- `get panelBody()` → `page.locator('.govuk-panel__body')`
- `get whatHappensNextHeading()` → `page.locator('h2', { hasText: 'What happens next' })`
- `get emailMessage()` → `page.getByText('You will receive an email with details of the quote.')`

### 7. Update `test/support/world.js`

Add imports for all 6 new page objects and register them in `this.pageObjects`:

```js
developmentTypesPage: new DevelopmentTypesPage(this.page, baseUrl),
residentialPage: new ResidentialPage(this.page, baseUrl),
peopleCountPage: new PeopleCountPage(this.page, baseUrl),
emailPage: new EmailPage(this.page, baseUrl),
checkYourAnswersPage: new CheckYourAnswersPage(this.page, baseUrl),
confirmationPage: new ConfirmationPage(this.page, baseUrl)
```

### 8. `test/features/quote-submission-confirmation.feature`

```gherkin
@smoke @regression
Feature: Quote submission confirmation

  Scenario: Developer submits a quote for a Housing development
    Given I am on the development types page
    When I select "Housing"
    And I continue
    And I enter "10" residential units
    And I continue
    And I enter "test@example.com" as my email
    And I continue
    And I submit my answers
    Then I should see the confirmation page
    And I should see an NRF reference number
    And I should see the "What happens next" section
    And I should see a message that I will receive an email

  Scenario: Developer submits a quote for an Other residential development
    Given I am on the development types page
    When I select "Other residential"
    And I continue
    And I enter "50" as the maximum number of people
    And I continue
    And I enter "test@example.com" as my email
    And I continue
    And I submit my answers
    Then I should see the confirmation page
    And I should see an NRF reference number
    And I should see the "What happens next" section
    And I should see a message that I will receive an email
```

### 9. `test/step-definitions/quote-submission-confirmation.steps.js`

Implement these steps using `node:assert/strict`. Access page objects via `this.pageObjects.<name>` and the raw page via `this.page`.

Steps to implement:

- `Given('I am on the development types page')` → `this.pageObjects.developmentTypesPage.open()`
- `When('I select {string}')` → `this.pageObjects.developmentTypesPage.selectDevelopmentType(type)`
- `When('I continue')` → `this.page.getByRole('button', { name: 'Continue' }).click()`
- `When('I enter {string} residential units')` → `this.pageObjects.residentialPage.fillResidentialUnits(count)`
- `When('I enter {string} as the maximum number of people')` → `this.pageObjects.peopleCountPage.fillPeopleCount(count)`
- `When('I enter {string} as my email')` → `this.pageObjects.emailPage.fillEmail(email)`
- `When('I submit my answers')` → `this.pageObjects.checkYourAnswersPage.submit()`
- `Then('I should see the confirmation page')` → assert `this.pageObjects.confirmationPage.panelTitle` is visible and contains "Your details have been submitted"
- `Then('I should see an NRF reference number')` → assert `this.pageObjects.confirmationPage.panelBody` contains "NRF reference:"
- `Then('I should see the {string} section')` → assert the h2 matching the string is visible
- `Then('I should see a message that I will receive an email')` → assert `this.pageObjects.confirmationPage.emailMessage` is visible

### Additional steps for Scenarios C and D (add to step-definitions file)

- `Given('I have submitted a Housing development quote')` — composite step: opens development types, selects Housing, fills residential units with "10", fills email with "test@example.com", submits, waits for confirmation panel
- `When('I navigate back in the browser')` → `this.page.goBack()`
- `When('I navigate to the check your answers page')` → `this.pageObjects.checkYourAnswersPage.open()`
- `Then('I should be on the start page')` → wait for h1, assert text equals "Nature Restoration Fund"

**Post-submission redirect behaviour (confirmed):**

- `checkForValidQuoteSession` middleware intercepts all GET `/quote/*` requests (except `confirmationPath` which is exempt)
- After submission, `request.yar.clear('quote')` removes the quote session key
- Middleware finds `boundaryEntryType` undefined → redirects to `startPath = '/'`
- Start page h1: `"Nature Restoration Fund"`

## Conventions

- ESM only — `import`/`export`, never `require()`
- No `console.log` — use `this.attach()` for debug output
- No assertions inside page objects
- No `page.waitForTimeout()` — use Playwright auto-waiting
- Prettier: 2-space indent, no semicolons, single quotes, no trailing commas
