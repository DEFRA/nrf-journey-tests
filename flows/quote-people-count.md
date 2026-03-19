# Flow: Other Residential — People Count (NRF2-454)

## Journey overview

A developer selects "Other residential" on the development types page, enters the maximum number of people the development will serve, and continues to the email page. Navigating back via the page Back link should pre-populate the previously entered value.

## Screens

| #   | Route                      | Page title                                                       |
| --- | -------------------------- | ---------------------------------------------------------------- |
| 1   | `/quote/development-types` | What type of development are you applying for?                   |
| 2   | `/quote/people-count`      | What is the maximum number of people the development will serve? |
| 3   | `/quote/email`             | Enter your email address                                         |

## Session prerequisite

The people-count page requires a valid quote session. The session is established when the user selects a boundary type (`/quote/boundary-type`) before reaching development types.

## Happy path (AC 1–4)

1. Navigate to `/quote/development-types` (with boundary type session in place)
2. Select **Other residential** → Continue
3. `/quote/people-count` is shown
4. Enter **250** → Continue
5. `/quote/email` is shown
6. Click the **Back** link (not browser back) on the email page
7. `/quote/people-count` is shown with **250** pre-filled in the input

## Form fields

| Page         | Field                    | HTML name     | Type   |
| ------------ | ------------------------ | ------------- | ------ |
| People count | Maximum number of people | `peopleCount` | number |

## Validation rules (people-count POST)

| Input                  | Error message                                    |
| ---------------------- | ------------------------------------------------ |
| Empty / missing        | `Enter the maximum number of people to continue` |
| Zero (`0`)             | `Enter a whole number greater than zero`         |
| Negative (e.g. `-100`) | `Enter a whole number greater than zero`         |
| Decimal (e.g. `90.5`)  | `Enter a whole number greater than zero`         |

## Back link behaviour

The email page back link resolves dynamically:

- Development types includes `other-residential` → back to `/quote/people-count`
- Otherwise → back to `/quote/residential`

## Acceptance criteria in scope

| AC  | Description                                                             |
| --- | ----------------------------------------------------------------------- |
| 1   | Selecting Other residential leads to the people-count page              |
| 2   | Valid entry navigates to email page                                     |
| 3   | Back link from email page returns to people-count with value pre-filled |
| 4   | Empty submission shows validation error                                 |
| 5   | Zero / negative / decimal shows validation error                        |

## Out of scope

- Full journey through to confirmation (covered by NRF2-459)
- Email page validation (separate ticket)
