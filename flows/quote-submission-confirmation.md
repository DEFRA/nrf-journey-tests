# Flow: Quote Submission Confirmation

**Jira:** NRF2-459
**Status:** ACs 1–3 (happy paths) and ACs 4–5 (post-submission routing and session) in scope.

---

## Overview

A developer completes the quote journey and submits their answers on the Check Your Answers page. On submission the backend generates an NRF reference. The user is redirected to a confirmation page showing the reference and a "What happens next" message.

---

## Two journeys in scope

### Journey A — Housing

| Step | Route                            | Action                                                                         |
| ---- | -------------------------------- | ------------------------------------------------------------------------------ |
| 1    | `GET /quote/development-types`   | Select "Housing" checkbox                                                      |
| 2    | `POST /quote/development-types`  | → redirects to `/quote/residential`                                            |
| 3    | `GET /quote/residential`         | Enter number of residential units                                              |
| 4    | `POST /quote/residential`        | → redirects to `/quote/email`                                                  |
| 5    | `GET /quote/email`               | Enter email address                                                            |
| 6    | `POST /quote/email`              | → redirects to `/quote/check-your-answers`                                     |
| 7    | `GET /quote/check-your-answers`  | Review answers, click Submit                                                   |
| 8    | `POST /quote/check-your-answers` | API call → clears session → redirects to `/quote/confirmation?reference=<ref>` |
| 9    | `GET /quote/confirmation`        | Confirmation page shown                                                        |

### Journey B — Other residential

| Step | Route                            | Action                                                                         |
| ---- | -------------------------------- | ------------------------------------------------------------------------------ |
| 1    | `GET /quote/development-types`   | Select "Other residential" checkbox                                            |
| 2    | `POST /quote/development-types`  | → redirects to `/quote/people-count`                                           |
| 3    | `GET /quote/people-count`        | Enter maximum number of people                                                 |
| 4    | `POST /quote/people-count`       | → redirects to `/quote/email`                                                  |
| 5    | `GET /quote/email`               | Enter email address                                                            |
| 6    | `POST /quote/email`              | → redirects to `/quote/check-your-answers`                                     |
| 7    | `GET /quote/check-your-answers`  | Review answers, click Submit                                                   |
| 8    | `POST /quote/check-your-answers` | API call → clears session → redirects to `/quote/confirmation?reference=<ref>` |
| 9    | `GET /quote/confirmation`        | Confirmation page shown                                                        |

---

## Pages

### Development Types — `/quote/development-types`

| Property          | Value                                                                      |
| ----------------- | -------------------------------------------------------------------------- |
| Page heading (h1) | `What type of development is it?`                                          |
| Field name        | `developmentTypes`                                                         |
| Options           | `Housing` (checkbox), `Other residential` (checkbox)                       |
| Hint              | "Select all that apply"                                                    |
| Routing           | Housing selected → `/quote/residential`; otherwise → `/quote/people-count` |

### Residential — `/quote/residential`

| Property          | Value                                                                               |
| ----------------- | ----------------------------------------------------------------------------------- |
| Page heading (h1) | `How many residential units in this development?`                                   |
| Field name        | `residentialBuildingCount`                                                          |
| Input             | Numeric, id=`residentialBuildingCount`                                              |
| Routing           | If `other-residential` also selected → `/quote/people-count`; else → `/quote/email` |

### People Count — `/quote/people-count`

| Property          | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Page heading (h1) | `What is the maximum number of people the development will serve?` |
| Field name        | `peopleCount`                                                      |
| Input             | Numeric                                                            |
| Routing           | Always → `/quote/email`                                            |

### Email — `/quote/email`

| Property          | Value                                |
| ----------------- | ------------------------------------ |
| Page heading (h1) | `Enter your email address`           |
| Field name        | `email`                              |
| Input             | Email type                           |
| Routing           | Always → `/quote/check-your-answers` |

### Check Your Answers — `/quote/check-your-answers`

| Property          | Value                                                    |
| ----------------- | -------------------------------------------------------- |
| Page heading (h1) | `Check your answers`                                     |
| Submit button     | `Submit`                                                 |
| Delete button     | `Delete` (warning style, links to `/quote/delete-quote`) |
| Back link         | `/quote/email`                                           |
| On submit         | Navigates to the confirmation page                       |

### Confirmation — `/quote/confirmation`

| Property         | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| Page heading     | `Your details have been submitted` (inside GOV.UK panel)             |
| NRF reference    | Shown in panel body as `NRF reference: <strong>{reference}</strong>` |
| Section heading  | `What happens next` (h2)                                             |
| Email message    | `You will receive an email with details of the quote.`               |
| Back link        | None rendered (no `beforeContent` block in template)                 |
| Reference source | Query param `?reference=<ref>` + backend GET `/quote/{reference}`    |

---

## Session behaviour

- Session data is stored in `yar` cache under key `quote`
- On successful POST to `/quote/check-your-answers`, `clearQuoteDataFromCache` is called immediately
- Accessing `/quote/check-your-answers` after submission renders with empty session data (no redirect currently implemented)

---

## Acceptance criteria in scope

| AC  | Description                                    | Covered by                                                                                                      |
| --- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | NRF quote reference is shown                   | `Then I should see an NRF reference number`                                                                     |
| 2   | "What happens next" section with email message | `Then I should see the "What happens next" section` + `And I should see a message that I will receive an email` |
| 3   | Header and footer present                      | Implicit in GOV.UK layout — not explicitly asserted                                                             |
| 4   | Browser back from confirmation → start page    | `When I navigate back in the browser` + `Then I should be on the start page`                                    |
| 5   | Direct nav to check-your-answers → start page  | `When I navigate to the check your answers page` + `Then I should be on the start page`                         |

## Acceptance criteria in scope (ACs 4–5)

### AC 4 — Browser back from confirmation redirects to start page

After landing on `/quote/confirmation`, the user presses the browser back button.

- User lands on the start page (h1: `"Nature Restoration Fund"`)

### AC 5 — Direct navigation to check-your-answers post-submission redirects to start page

After submission, if the user navigates directly to `/quote/check-your-answers`:

- User is redirected to the start page
- No previous answers are shown

## Acceptance criteria parked

| AC  | Description                      | Reason                        |
| --- | -------------------------------- | ----------------------------- |
| 6   | Session cleared after submission | Covered implicitly by ACs 4–5 |

---

## Dependencies

- `nrf-backend` must be running and reachable — the confirmation page calls the backend to retrieve the generated quote reference
