# Quote: Check Your Answers

## Journey overview

After completing all quote questions the user lands on the Check Your Answers page. They can review their answers, use change links to amend any answer, and submit their quote.

---

## Pages in this journey

### `/quote/check-your-answers`

**Heading:** Check your answers

**Summary rows:**

| Row key                     | Value shown                                          | Change link destination                                                           |
| --------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| Red line boundary           | Added                                                | `/quote/upload-preview-map` (draw path) or `/quote/upload-boundary` (upload path) |
| Development types           | Housing / Other residential (one or both, as a list) | `/quote/development-types`                                                        |
| Number of residential units | Entered value                                        | `/quote/residential`                                                              |
| Maximum number of people    | Entered value                                        | `/quote/people-count`                                                             |
| Email address               | Entered email                                        | `/quote/email`                                                                    |

Rows for "Number of residential units" and "Maximum number of people" are shown only when the corresponding development type was selected.

**Actions:**

- Submit button → navigates to the confirmation page (currently blocked — see Pending section)
- Delete button → `/quote/delete-quote`

---

## Entry paths

### Draw on map (testable in Docker Compose)

`/quote/boundary-type` → select "Draw on a map" → Continue → `/quote/development-types` → ... → `/quote/check-your-answers`

### Upload file (not testable in Docker Compose)

`/quote/boundary-type` → select "Upload a file" → Continue → `/quote/upload-boundary` → submit file to external uploader → `/quote/upload-received` (polls until upload processed) → `/quote/upload-preview-map` → Save and continue → `/quote/development-types` → ... → `/quote/check-your-answers`

---

## Change link behaviour

Clicking a Change link navigates to the relevant page with the previously entered value pre-filled. After updating and clicking Continue the user is routed through any required subsequent questions before returning to the Check Your Answers page.

| Changed field                                  | Next question after Continue                                         |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| Red line boundary                              | Development types page                                               |
| Development types (Housing selected)           | Number of residential units page                                     |
| Development types (Other residential selected) | Maximum number of people page                                        |
| Development types (both selected)              | Number of residential units page, then maximum number of people page |
| Email address                                  | Check your answers page (email is the last question)                 |

---

## Pending / blocked

- **Submit → Confirmation**: The frontend does not yet send `boundaryGeojson` in the POST /quotes request. The backend requires this field, so submission currently fails. Covered by existing scenarios in `quote-submission-confirmation.feature` once unblocked.
- **File upload boundary summary**: Requires the CDP Uploader service, which is not included in the Docker Compose stack. Testable in CDP cloud environments only.
- **Conditional answer clearing**: When a development type is removed, its related answer is cleared from the summary. Covered by nrf-frontend integration tests; not duplicated at E2E level.
