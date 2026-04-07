# Quote Journey

## Overview

A developer calculates an NRF levy estimate by providing their site boundary, development type(s), unit/people counts, and email address. At the end they can submit their quote or delete it. The journey has two boundary entry paths (upload and draw) and two terminal branches (EDP intersection → full quote, no EDP intersection → informational dead-end).

---

## Branch status summary

| Branch                                | Status                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| Upload boundary path                  | `[IMPLEMENTED]`                                                                    |
| Draw boundary on map                  | `[BLOCKED: map drawing not yet implemented in nrf-frontend]`                       |
| No EDP intersection                   | `[IMPLEMENTED]`                                                                    |
| Development types → Housing           | `[IMPLEMENTED]`                                                                    |
| Development types → Other residential | `[IMPLEMENTED]`                                                                    |
| Development types → Both              | `[IMPLEMENTED]`                                                                    |
| Submit → Confirmation                 | `[IMPLEMENTED]`                                                                    |
| Delete → Confirmation                 | `[IMPLEMENTED]`                                                                    |
| Browser back from confirmation        | `[BLOCKED: session guard on quote routes not yet in published nrf-frontend image]` |
| Direct nav to CYA post-submission     | `[BLOCKED: session guard on quote routes not yet in published nrf-frontend image]` |

---

## Pages

### `/` — Home `[IMPLEMENTED]`

| Property          | Value                         |
| ----------------- | ----------------------------- |
| Page heading (h1) | `Nature Restoration Fund`     |
| Start button      | Link → `/quote/boundary-type` |

---

### `/quote/boundary-type` — Boundary type `[IMPLEMENTED]`

| Property          | Value                                        |
| ----------------- | -------------------------------------------- |
| Page heading (h1) | `How do you want to add your site boundary?` |
| Field name        | `boundaryEntryType`                          |
| Options           | `draw` (radio), `upload` (radio)             |
| Routing — draw    | → `/quote/draw-boundary` `[BLOCKED]`         |
| Routing — upload  | → `/quote/upload-boundary`                   |

---

### Upload path `[IMPLEMENTED]`

#### `/quote/upload-boundary`

| Property          | Value                                   |
| ----------------- | --------------------------------------- |
| Page heading (h1) | `Upload your red line boundary`         |
| Field name        | `file`                                  |
| Input type        | File (multipart, posts to CDP Uploader) |
| Accepted formats  | `.shp`, `.geojson`, `.json`, `.kml`     |
| Max size          | 2 MB                                    |
| Routing           | → `/quote/upload-received`              |

#### `/quote/upload-received`

Polling page — no form. Waits until the CDP Uploader completes (virus scan + S3 storage) then redirects automatically to `/quote/upload-preview-map`. The user sees a loading indicator; no action required.

#### `/quote/upload-preview-map`

| Property                      | Value                        |
| ----------------------------- | ---------------------------- |
| Page heading (h1)             | `Check your boundary`        |
| Action                        | `Save and continue` button   |
| Routing — EDP intersection    | → `/quote/development-types` |
| Routing — no EDP intersection | → `/quote/no-edp`            |

---

### Draw on map path `[BLOCKED: map drawing not yet implemented in nrf-frontend]`

#### `/quote/draw-boundary`

Not yet implemented. When available it will allow the user to draw a polygon on a map. On save it will route to `/quote/development-types` (EDP intersection) or `/quote/no-edp` (no intersection), the same as the upload path.

---

### `/quote/no-edp` — No EDP branch `[IMPLEMENTED]`

Dead-end informational page shown when the uploaded boundary does not intersect any EDP coverage area.

| Property          | Value                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Page heading (h1) | `Nature Restoration Fund levy is not available in this area`                                                                                     |
| Body text         | `Other ways to mitigate environmental impact are:`                                                                                               |
| List items        | Habitat Regulations Assessment (HRA); Consent from Natural England for SSSIs; Marine impact assessments; Species licensing for protected species |
| Back link         | `/quote/upload-preview-map`                                                                                                                      |

**Test fixture:** `test/fixtures/no_edp_intersection.geojson` — polygon in central London (WGS84). Does not intersect the seeded EDP boundary in the Docker Compose stack (EPSG:27700, ~582800–582840 Easting, ~328180–328220 Northing).

**What to assert:** page heading and body text visible — these together confirm the routing decision and correct page render.

---

### `/quote/development-types` — Development types `[IMPLEMENTED]`

| Property                         | Value                                                 |
| -------------------------------- | ----------------------------------------------------- |
| Page heading (h1)                | `What type of development is it?`                     |
| Field name                       | `developmentTypes`                                    |
| Options                          | `Housing` (checkbox), `Other residential` (checkbox)  |
| Hint                             | `Select all that apply`                               |
| Routing — Housing only           | → `/quote/residential`                                |
| Routing — Other residential only | → `/quote/people-count`                               |
| Routing — Both                   | → `/quote/residential` (then → `/quote/people-count`) |

---

### `/quote/residential` — Residential units `[IMPLEMENTED]`

Shown only when Housing is selected.

| Property                                  | Value                                             |
| ----------------------------------------- | ------------------------------------------------- |
| Page heading (h1)                         | `How many residential units in this development?` |
| Field name                                | `residentialBuildingCount`                        |
| Input type                                | Numeric                                           |
| Routing — Other residential also selected | → `/quote/people-count`                           |
| Routing — Housing only                    | → `/quote/email`                                  |

---

### `/quote/people-count` — People count `[IMPLEMENTED]`

Shown only when Other residential is selected.

| Property          | Value                                                              |
| ----------------- | ------------------------------------------------------------------ |
| Page heading (h1) | `What is the maximum number of people the development will serve?` |
| Field name        | `peopleCount`                                                      |
| Input type        | Numeric                                                            |
| Routing           | Always → `/quote/email`                                            |

---

### `/quote/email` — Email `[IMPLEMENTED]`

| Property                                 | Value                                |
| ---------------------------------------- | ------------------------------------ |
| Page heading (h1)                        | `Enter your email address`           |
| Field name                               | `email`                              |
| Input type                               | Email, max 254 characters            |
| Routing                                  | Always → `/quote/check-your-answers` |
| Back link — Other residential in session | → `/quote/people-count`              |
| Back link — Housing only                 | → `/quote/residential`               |

---

### `/quote/check-your-answers` — Check your answers `[IMPLEMENTED]`

| Property          | Value                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Page heading (h1) | `Check your answers`                                                                                                                           |
| Summary rows      | Red line boundary, Development types, Number of residential units (if housing), Maximum number of people (if other residential), Email address |
| Change links      | Each row links back to its input page                                                                                                          |
| Submit button     | `Submit` → POST → `/quote/confirmation`                                                                                                        |
| Delete button     | Warning-style link → `/quote/delete-quote`                                                                                                     |
| Back link         | `/quote/email`                                                                                                                                 |

Rows for residential units and people count are shown only when the corresponding development type was selected.

---

### `/quote/confirmation` — Submission confirmation `[IMPLEMENTED]`

| Property             | Value                                                             |
| -------------------- | ----------------------------------------------------------------- |
| Panel heading        | `Your details have been submitted`                                |
| NRF reference        | Shown in panel body: `NRF reference: {reference}`                 |
| Section heading (h2) | `What happens next`                                               |
| Email message        | `You will receive an email with details of the quote.`            |
| Back link            | None                                                              |
| Reference source     | Query param `?reference=<ref>` + backend `GET /quote/{reference}` |

**Session behaviour:** `clearQuoteDataFromCache` is called immediately on successful POST to `/quote/check-your-answers`. The session is empty after submission.

**What to assert:** NRF reference visible; "What happens next" section and email message visible.

**Browser back from confirmation** `[BLOCKED: session guard not yet in published image]` — when unblocked, pressing back should route to the start page.

---

### Delete path `[IMPLEMENTED]`

#### `/quote/delete-quote`

| Property          | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Page heading (h1) | `Are you sure you want to delete this quote?`                |
| Yes button        | Submit → clears session → `/quote/delete-quote-confirmation` |
| No button         | Secondary link → `/quote/check-your-answers`                 |

#### `/quote/delete-quote-confirmation`

| Property      | Value                            |
| ------------- | -------------------------------- |
| Panel heading | `Your details have been deleted` |

---

## Entry paths

### Upload → EDP → Full quote → Submit

`/` → Start → `/quote/boundary-type` → Upload → `/quote/upload-boundary` → `/quote/upload-received` → `/quote/upload-preview-map` → Save and continue → `/quote/development-types` → ... → `/quote/check-your-answers` → Submit → `/quote/confirmation`

### Upload → No EDP

`/` → Start → `/quote/boundary-type` → Upload → `/quote/upload-boundary` → `/quote/upload-received` → `/quote/upload-preview-map` → Save and continue → `/quote/no-edp`

### Draw → EDP → Full quote `[BLOCKED]`

`/` → Start → `/quote/boundary-type` → Draw → `/quote/draw-boundary` → `/quote/development-types` → ...

### CYA → Delete

`/quote/check-your-answers` → Delete → `/quote/delete-quote` → Yes → `/quote/delete-quote-confirmation`

### CYA → Cancel delete

`/quote/check-your-answers` → Delete → `/quote/delete-quote` → No → `/quote/check-your-answers`

---

## Out of scope (covered at nrf-frontend unit/integration level)

- Validation errors on all pages — required fields, format, numeric constraints
- Back link value pre-population
- Session persistence after cancel
- Conditional answer clearing when a development type is removed
- Individual list items on the no-EDP page
- h1, page title, and back link assertions (beyond routing)
- Session cleared on deletion — `delete-quote/controller-post.test.js`

---

## Dependencies

- `nrf-backend` must be running — the confirmation page calls `GET /quote/{reference}` to retrieve the generated reference
- CDP Uploader must be running — the upload path posts files to the uploader service
- LocalStack must be running — the uploader uses S3 for file storage
- EDP seed data must be loaded in PostGIS — determines EDP vs no-EDP routing on the preview map page
