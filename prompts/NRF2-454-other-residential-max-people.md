# Prompt: NRF2-454 — Other residential / People Count tests

## Context

Ticket: NRF2-454 — Other residential - Max People
Flow file: `flows/quote-people-count.md`
Branch: feature/NRF2-454

## Scope

Implement one Cucumber BDD scenario for the `/quote/people-count` page covering the forward happy path only:

1. **Happy path** (`@smoke @regression`)
   - Select Other residential → people-count → enter 250 → continue → land on email page

Back link value persistence and all validation scenarios are covered by nrf-frontend integration tests and are out of scope here.

## Files to create

- `test/features/quote-people-count.feature`
- `test/step-definitions/quote-people-count.steps.js`

## Files already available (no changes needed)

- `test/page-objects/development-types.page.js` — `selectDevelopmentType()`, `continue()`
- `test/page-objects/people-count.page.js` — `fillPeopleCount()`, `continue()`
- `test/page-objects/email.page.js` — `pageHeading`
- `test/page-objects/boundary-type.page.js` — session setup

## Steps already defined (do not redefine)

From `quote-submission-confirmation.steps.js`:

- `Given I am on the development types page`
- `When I select {string}`
- `When I continue`
- `When I enter {string} as the maximum number of people`

## New steps to implement

```
Then I should be on the email page
```

## Implementation notes

- Assert email page by checking `pageHeading` (h1) contains `"Enter your email address"`.
- Do not add assertions inside page objects.
- No `page.waitForTimeout()`.
