# Prompt: NRF2-458 — Quote Deletion Confirmation

## Context

Ticket: NRF2-458 — Deletion Confirmation
Flow file: `flows/quote-deletion-confirmation.md`
Branch: NRF2-458-Deletion-Confirmation

## Scope

Implement two active Cucumber BDD scenarios and one @pending scenario:

1. **Delete a quote — happy path** (`@smoke @regression`)

   - Full journey to CYA → click Delete → delete-quote page shown → click Yes → deletion confirmation page shown

2. **Cancel deletion** (`@smoke @regression`)

   - Full journey to CYA → click Delete → delete-quote page → click No → back on check-your-answers

3. **Browser back from confirmation** (`@pending`)
   - Same blocker as NRF2-459 pending scenarios — middleware not in published Docker image

## Files to create

- `test/page-objects/delete-quote.page.js`
- `test/page-objects/delete-quote-confirmation.page.js`
- `test/features/quote-deletion-confirmation.feature`
- `test/step-definitions/quote-deletion-confirmation.steps.js`

## Files to modify

- `test/page-objects/check-your-answers.page.js` — add `deleteLink` getter and `delete()` method
- `test/support/world.js` — import and register `DeleteQuotePage` and `DeleteQuoteConfirmationPage`

## Files already available (no changes needed)

- `test/page-objects/boundary-type.page.js` — session setup
- `test/page-objects/development-types.page.js`
- `test/page-objects/residential.page.js`
- `test/page-objects/email.page.js`

## Steps already defined (do not redefine)

From `quote-submission-confirmation.steps.js`:

- `When I navigate back in the browser`
- `Then I should be on the start page`

## New steps to implement

```
Given I have a quote ready to submit
When I click the Delete button
Then I should see the delete quote page
When I click Yes to confirm deletion
Then I should see the deletion confirmation page
When I click No
Then I should be on the check your answers page
```

## Key selectors

| Element                     | Selector                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Delete on CYA               | `getByRole('button', { name: 'Delete' })` — `govukButton` with `href` renders as `<a role="button">` |
| Yes on delete-quote         | `getByRole('button', { name: 'Yes' })`                                                               |
| No on delete-quote          | `getByRole('link', { name: 'No' })` — raw `<a>` tag (not govukButton macro), default role is link    |
| Panel title on confirmation | `.govuk-panel__title`                                                                                |

## Implementation notes

- Do not add assertions inside page objects.
- No `page.waitForTimeout()`.
