# Prompt: Implement quote-no-edp E2E scenario

## Context

Read `flows/quote-no-edp.md` before starting.

The no-EDP journey ends at `/quote/no-edp` when the uploaded boundary does not intersect any EDP coverage area. This scenario validates that the upload flow routes correctly to that informational dead-end page.

The upload journey steps (`I select {string} as my boundary type`, `I upload {string} as my boundary file`, `I save and continue on the boundary preview`) already exist in `test/step-definitions/quote-housing-journey.steps.js` and must be reused — do not duplicate them.

## What to implement

### 1. Page object — `test/page-objects/no-edp.page.js`

Extend `Page`. Expose:

- `pageHeading` — already provided by `Page` base class (h1 locator), no need to re-declare
- `bodyText` getter — locator for the paragraph `Other ways to mitigate environmental impact are:` using `getByText`

No actions needed (no forms on this page).

### 2. Register in `test/support/world.js`

Add `noEdpPage: new NoEdpPage(this.page, baseUrl)` to `this.pageObjects`.

### 3. Feature file — `test/features/quote-no-edp.feature`

One scenario, tagged `@smoke @regression`:

```gherkin
@smoke @regression
Feature: Quote no EDP intersection

  @smoke @regression
  Scenario: Site outside EDP coverage shows the no-EDP information page
    Given I am on the start page
    When I start a new quote
    And I select "Upload a file" as my boundary type
    And I continue
    And I upload "test/fixtures/no_edp_intersection.geojson" as my boundary file
    And I save and continue on the boundary preview
    Then I should see the "Nature Restoration Fund levy is not available in this area" heading
    And I should see the no-EDP explanation text
```

### 4. Step definitions — `test/step-definitions/quote-no-edp.steps.js`

Only define the two new `Then` steps. The `Given`/`When` steps are already defined elsewhere and will be reused automatically by Cucumber.

- `Then I should see the {string} heading` — assert `this.pageObjects.noEdpPage.pageHeading` text equals the string parameter. Use `assert.strictEqual` with `await ... .textContent()` after trimming.
- `Then I should see the no-EDP explanation text` — assert `this.pageObjects.noEdpPage.bodyText` is visible.

**Note:** `Then I should see the {string} heading` is a generic step — check whether it already exists in another step definitions file before adding it. If it does, do not redeclare it.

## Constraints

- ESM only (`import`/`export`) — no `require()`
- No `console.log` — use `this.attach()` if debug output is needed
- No assertions inside page objects
- No `page.waitForTimeout()`
- Element selection: prefer `getByRole`, `getByText`, `getByLabel` over CSS selectors
- Prettier: 2-space indent, single quotes, no semicolons, no trailing commas
