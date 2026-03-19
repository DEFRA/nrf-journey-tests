# Prompt: NRF2-454 — Other residential / People Count tests

## Context

Ticket: NRF2-454 — Other residential - Max People
Flow file: `flows/quote-people-count.md`
Branch: feature/NRF2-454

## Scope

Implement Cucumber BDD scenarios for the `/quote/people-count` page covering:

1. **Happy path + back link value persistence** (`@smoke @regression`)

   - Select Other residential → people-count → enter 250 → email → click Back link → people-count input shows 250

2. **Validation: empty** (`@regression`)

   - Submit without a value → error: "Enter the maximum number of people to continue"

3. **Validation: zero** (`@regression`)

   - Enter 0 → error: "Enter a whole number greater than zero"

4. **Validation: negative** (`@regression`)

   - Enter -100 → error: "Enter a whole number greater than zero"

5. **Validation: decimal** (`@regression`)
   - Enter 90.5 → error: "Enter a whole number greater than zero"

## Files to create

- `test/features/quote-people-count.feature`
- `test/step-definitions/quote-people-count.steps.js`

## Files already available (no changes needed)

- `test/page-objects/development-types.page.js` — `selectDevelopmentType()`, `continue()`
- `test/page-objects/people-count.page.js` — `fillPeopleCount()`, `continue()`, `peopleCountInput`
- `test/page-objects/email.page.js` — email input, continue button
- `test/page-objects/boundary-type.page.js` — session setup

## Steps already defined (do not redefine)

From `quote-submission-confirmation.steps.js`:

- `Given I am on the development types page`
- `When I select {string}`
- `When I continue`
- `When I enter {string} as the maximum number of people`

## New steps to implement

```
Given I am on the people count page for an Other residential development
When I click the Back link
Then the people count field should contain {string}
Then I should see the error {string}
```

## Implementation notes

- Session prerequisite: boundary type must be selected before development types. Use the same
  setup as `Given I am on the development types page` (open boundaryTypePage, select "Draw on a map", continue, then open developmentTypesPage).
- Error assertion: use `.govuk-error-summary` — wait for visible, then assert textContent includes the expected string.
- Back link: use `this.page.getByRole('link', { name: 'Back' })` — works on any GOV.UK page.
- Value persistence: use `this.pageObjects.peopleCountPage.peopleCountInput.inputValue()`.
- Do not add assertions inside page objects.
- No `page.waitForTimeout()`.
