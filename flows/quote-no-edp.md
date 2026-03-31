# Quote: No EDP Intersection

## Journey overview

When a user uploads a boundary file that does not intersect any EDP (Ecological Data Platform) coverage area, the service routes them to an informational dead-end page explaining that the Nature Restoration Fund levy is not available in their area. This is the forward happy-path ending for out-of-catchment sites.

---

## Pages in this journey

### `/quote/boundary-type`

**Heading:** How do you want to add your site boundary?

User selects "Upload a file" and clicks Continue.

---

### `/quote/upload-boundary`

**Heading:** Upload your red line boundary

User chooses a GeoJSON file and clicks Continue. The form posts to the CDP Uploader.

---

### `/quote/upload-received`

Polling page. Waits until the upload is processed by the CDP Uploader (virus scan + S3 storage). Redirects automatically to `/quote/upload-preview-map`.

---

### `/quote/upload-preview-map`

**Heading:** Check your boundary

Displays the uploaded boundary on a map. User clicks "Save and continue".

If the boundary intersects EDP coverage the user continues to `/quote/development-types`. Otherwise they are routed to `/quote/no-edp`.

---

### `/quote/no-edp`

**Heading:** Nature Restoration Fund levy is not available in this area

**Body text:** "Other ways to mitigate environmental impact are:"

**List items:**

- Habitat Regulations Assessment (HRA) for European sites or Ramsar sites
- Consent from Natural England for works affecting SSSIs
- Marine impact assessments for marine conservation zones
- Species licensing applications for protected species

**Back link:** `/quote/upload-preview-map`

---

## Entry path

`/` → Start → `/quote/boundary-type` → "Upload a file" → Continue → `/quote/upload-boundary` → upload `no_edp_intersection.geojson` → Continue → `/quote/upload-received` (auto-redirects) → `/quote/upload-preview-map` → Save and continue → `/quote/no-edp`

---

## Test fixture

`test/fixtures/no_edp_intersection.geojson` — a polygon in central London (WGS84). Does not intersect the seeded EDP boundary in the Docker Compose stack (EPSG:27700, ~582800–582840 Easting, ~328180–328220 Northing).

---

## What to assert

- The page heading is exactly: `Nature Restoration Fund levy is not available in this area`
- The body text `Other ways to mitigate environmental impact are:` is visible

These two assertions confirm both the routing decision (no EDP intersection) and that the correct page rendered.

---

## Out of scope / lower-level tests

- Verifying each individual list item — covered by nrf-frontend page tests
- Back link navigation — covered by nrf-frontend integration tests
- The draw-on-map path to no-edp — not yet testable at E2E level (draw flow not yet implemented)
