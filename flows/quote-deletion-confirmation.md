# Flow: Quote Deletion Confirmation (NRF2-458)

## Journey overview

A developer with an in-progress quote navigates to the Check Your Answers page and chooses to delete their quote. They are presented with a confirmation prompt and can either confirm or cancel the deletion.

## Screens

| #   | Route                              | Page heading (h1)                               |
| --- | ---------------------------------- | ----------------------------------------------- |
| 1   | `/quote/check-your-answers`        | `Check your answers`                            |
| 2   | `/quote/delete-quote`              | `Are you sure you want to delete this quote?`   |
| 3   | `/quote/delete-quote-confirmation` | `Your details have been deleted` (GOV.UK panel) |

## Happy path — Delete (Scenario A)

1. Complete the quote journey through to `/quote/check-your-answers`
2. Click **Delete** → navigates to `/quote/delete-quote`
3. Click **Yes** → navigates to `/quote/delete-quote-confirmation`

## Cancel path (Scenario B)

1. Complete the quote journey through to `/quote/check-your-answers`
2. Click **Delete** → navigates to `/quote/delete-quote`
3. Click **No** → returns to `/quote/check-your-answers`

## Form fields / controls

| Page               | Control | Type                                    | Behaviour                                                                 |
| ------------------ | ------- | --------------------------------------- | ------------------------------------------------------------------------- |
| Check your answers | Delete  | Link styled as warning button (`<a>`)   | Navigates to `/quote/delete-quote`                                        |
| Delete quote       | Yes     | Submit button                           | POSTs `confirmDeleteQuote=Yes`, clears session, redirects to confirmation |
| Delete quote       | No      | Link styled as secondary button (`<a>`) | Returns to `/quote/check-your-answers`                                    |

## Acceptance criteria in scope

| AC  | Description                                           |
| --- | ----------------------------------------------------- |
| A   | Delete button from CYA leads to the delete-quote page |
| B   | Clicking Yes leads to the deletion confirmation page  |
| C   | Clicking No returns to check-your-answers             |

## Out of scope (covered by nrf-frontend integration/unit tests)

- Session data cleared on deletion — `delete-quote/controller-post.test.js`
- Previously entered answers still shown after cancel — session persistence, `page.test.js`
- Restart journey with empty session after deletion — session/integration level
- h1, page title, back link validation — `delete-quote/page.test.js` and `delete-quote-confirmation/page.test.js`

## Pending

- Browser back from deletion confirmation → redirects to start page — blocked until the published nrf-frontend image includes the session guard on quote routes (same blocker as NRF2-459 pending scenarios)
