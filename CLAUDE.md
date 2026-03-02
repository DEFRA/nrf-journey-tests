# CLAUDE.md — NRF Journey Tests

Agent instructions for working in this repository.

---

## 1. Project Overview

This repository contains the E2E test suite for the **Nature Restoration Fund (NRF)** service, a DEFRA CDP platform application.

The framework validates end-to-end user journeys against the NRF frontend service. Tests run against three targets:

- **Local** — developer machine, service running on `localhost`
- **Localstack** — full stack in Docker Compose, used in GitHub Actions CI
- **CDP cloud** — deployed environments (dev, test, prod) on AWS

**Current testing scope:**

- Web UI journeys (BDD with Cucumber + Playwright) — **active**
- API tests (non-BDD) — **planned**
- Database tests (non-BDD) — **planned**

The service under test is `nrf-frontend` (Hapi.js).

Before implementing any test, read the relevant `flows/<user-flow>.md` file. These files describe the user journey, screens, data inputs, and expected outcomes. If no flow file exists, ask the user to create one before proceeding.

You also have access to the sibling repository:

- `/home/sinangoktas/VSCodeProjects/nrf-frontend` — the frontend service (Hapi.js)

Read it when you need to understand routes, page titles, form field names, or response structures.

---

## 2. Tech Stack & Tools

| Concern                | Tool                                   | Version        |
| ---------------------- | -------------------------------------- | -------------- |
| Language               | JavaScript (ESM)                       | Node ≥ 22.13.1 |
| Browser automation     | Playwright (Chromium)                  | 1.50.1         |
| BDD runner (web tests) | @cucumber/cucumber                     | 11.2.0         |
| Reporting              | allure-cucumberjs + allure-commandline | 3.2.0 / 2.32.0 |
| Assertions (web)       | `node:assert/strict`                   | built-in       |
| Assertions (API/DB)    | TBD                                    | —              |
| CI                     | GitHub Actions                         | —              |
| Package manager        | npm                                    | —              |
| Linting                | ESLint (standard config)               | ^8.57.0        |
| Formatting             | Prettier                               | 3.4.2          |

**ESM is mandatory throughout.** Use `import`/`export` everywhere. Never use `require()`.

Prettier config (`.prettierrc.js`): 2-space indent, no semicolons, single quotes, no trailing commas.

ESLint enforces `no-console` — do not add `console.log`. Use `this.attach()` in Cucumber steps for debug output.

---

## 3. Project Structure

```
nrf-journey-tests/
├── flows/                          # User flow descriptions — READ BEFORE WRITING TESTS
│   └── <user-flow>.md              # One file per journey; describes screens, data, outcomes
│
├── test/
│   ├── features/                   # Gherkin .feature files — one per user journey
│   │   └── home.feature
│   ├── step-definitions/           # Cucumber step implementations — mirror features/ naming
│   │   └── home.steps.js
│   ├── page-objects/               # Page Object Model
│   │   ├── BasePage.js             # Playwright helpers: goto, click, fill, text, waitFor, title
│   │   ├── page.js                 # GOV.UK base page — adds pageHeading (h1) locator
│   │   └── home.page.js            # HomePage — open()
│   └── support/
│       ├── world.js                # PlaywrightWorld — browser lifecycle, baseUrl, pageObjects map
│       └── hooks.js                # Before/After per scenario; screenshot on fail; FAILED file
│
├── run-journey-tests/
│   └── action.yml                  # Reusable composite action (localstack + CDP modes)
│
├── .github/workflows/
│   ├── check-pull-request.yml      # PR checks: format + lint (test job currently commented out)
│   ├── journey-tests.yml           # Callable/dispatchable journey test runner (needs updating)
│   └── publish.yml                 # Builds + publishes Docker image to AWS ECR on push to main
│
├── docker/
│   ├── config/                     # .env files for Docker Compose services
│   └── scripts/                    # Init scripts for localstack and mongodb
│
├── compose.yml                     # Docker Compose: mongodb, redis, localstack, nrf-frontend
├── cucumber.js                     # Cucumber profile — ESM flat export (see conventions)
├── Dockerfile                      # Test runner image (used by CDP portal)
├── entrypoint.sh                   # Docker entrypoint — runs tests + publishes report
├── CLAUDE.md                       # This file
└── README.md                       # Human-readable docs and run commands
```

**Planned additions (not yet present):**

```
test/
  api/                              # API tests — plain JS, no Cucumber
  db/                               # Database tests — plain JS, no Cucumber
  fixtures/                         # Shared test data as JSON files
```

---

## 4. Conventions & Patterns

### Feature files

- One `.feature` file per user journey, named after the journey: `apply-for-permit.feature`
- Store in `test/features/`
- Tag every scenario — see tagging strategy below
- Scenario titles describe the observable outcome, not the implementation

```gherkin
# Good
Scenario: Applicant submits a valid permit application

# Bad
Scenario: Click submit button and check database
```

### Step definitions

- One `.steps.js` file per feature file, same base name: `apply-for-permit.steps.js`
- Store in `test/step-definitions/`
- Steps must be reusable across scenarios — avoid scenario-specific phrasing
- Use Cucumber parameter types (`{string}`, `{int}`, `{word}`) — never hardcode values in step text
- Access page objects via `this.pageObjects.<name>`, the browser page via `this.page`

### Page Objects

- One file per page or logical section: `<name>.page.js`
- Extend `Page` for standard GOV.UK pages (gives `pageHeading` and `open()`)
- Extend `BasePage` directly for non-standard pages
- Register every instance in `world.js` under `this.pageObjects`
- Expose locators as getters, actions as async methods
- Never put assertions inside page objects — assert in step definitions

```js
// Good — page object exposes locator
get submitButton() {
  return this.page.locator('button[type="submit"]')
}

// Bad — assertion inside page object
async assertHeading(text) {
  expect(await this.page.locator('h1').textContent()).toBe(text)
}
```

### Element selection priority

1. Role-based: `page.getByRole('button', { name: 'Continue' })`
2. Label: `page.getByLabel('Email address')`
3. Test ID: `page.locator('[data-testid="submit-btn"]')`
4. CSS class (as last resort): `page.locator('.govuk-button')`
5. **Never use XPath**

When in doubt, check the actual HTML in `nrf-frontend/src`.

### Tagging strategy

Every scenario must have at least one tag:

| Tag           | Meaning                                        | CI behaviour                    |
| ------------- | ---------------------------------------------- | ------------------------------- |
| `@smoke`      | Critical path — must pass before anything else | Blocks PR merge                 |
| `@regression` | Full coverage                                  | Runs in scheduled/nightly suite |
| `@flaky`      | Known intermittent failure                     | Excluded from blocking suites   |

```gherkin
@smoke @regression
Scenario: Applicant sees the home page
```

### Test isolation

Each scenario gets a fresh browser, context, and page — enforced by `Before`/`After` hooks in `hooks.js`. Never share state between scenarios. Never rely on execution order.

### world.js — adding a new page object

When adding a new page object, register it in `openBrowser()`:

```js
this.pageObjects = {
  homePage: new HomePage(this.page, baseUrl),
  applyPage: new ApplyPage(this.page, baseUrl) // add here
}
```

### cucumber.js config — critical quirk

The config uses ESM. The export must be a **flat default** — do NOT nest in `{ default: { ... } }`:

```js
// Correct
export default { paths: [...], import: [...] }

// WRONG — produces 0 scenarios silently
export default { default: { paths: [...], import: [...] } }
```

---

## 5. How to Run Tests

Activate Node 22 first if not already active:

```sh
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
```

### Run all tests (local)

```sh
npm run test:e2e:local
```

### Run by tag

```sh
# Smoke suite only
BASE_URL=http://localhost:3000 npx cucumber-js --tags @smoke

# Regression suite, excluding flaky
BASE_URL=http://localhost:3000 npx cucumber-js --tags "@regression and not @flaky"
```

### Run a single feature file

```sh
BASE_URL=http://localhost:3000 npx cucumber-js test/features/home.feature
```

### Run with browser visible (headed mode)

```sh
npm run test:e2e:debug
```

### Run full Docker stack (localstack mode)

```sh
npm run test:localstack
docker compose down   # tear down afterwards
```

### Run against CDP cloud environment

```sh
ENVIRONMENT=dev npm run test:e2e
ENVIRONMENT=test npm run test:e2e
```

### Generate and view the Allure report

```sh
npm run report
npx allure open allure-report
```

### Starting services locally

```sh
# nrf-frontend on port 3000 (port 3001 is nrf-backend)
cd ../nrf-frontend && NODE_ENV=development ENABLE_DEFRA_ID=false node src/index.js
```

---

## 6. Test Data & Environment

### Environment / base URL resolution

Priority order in `test/support/world.js`:

1. `ENVIRONMENT` env var → constructs `https://nrf-frontend.<env>.cdp-int.defra.cloud` (highest priority)
2. `BASE_URL` env var → explicit URL override
3. Fallback → `http://localhost:3000`

### Test data

There are no shared test data files yet. When test data is needed:

- Create `test/fixtures/<flow-name>.json`
- Import it directly in the step definition file
- Never commit real user credentials, API keys, or PII

### Credentials and secrets

- All secrets are injected via environment variables — never hardcoded or committed
- For local nrf-frontend: `ENABLE_DEFRA_ID=false` disables auth; `SESSION_COOKIE_PASSWORD` has a safe default for dev
- For Docker Compose: infrastructure config lives in `docker/config/*.env`

### Docker infrastructure (localstack mode)

| Service      | Image                       | Purpose                      |
| ------------ | --------------------------- | ---------------------------- |
| nrf-frontend | defradigital/nrf-frontend   | Service under test           |
| mongodb      | mongo:6                     | Database                     |
| redis        | redis:7                     | Session cache                |
| localstack   | localstack/localstack:3.2.0 | AWS (S3, SQS, SNS, DynamoDB) |

---

## 7. What to Avoid

**Waiting**

- Never use `page.waitForTimeout(ms)` — this is a hard wait and makes tests slow and brittle
- Use Playwright's built-in auto-waiting, or `locator.waitFor({ state: 'visible' })` for explicit conditions

**Browser state**

- Never reuse browser, context, or page across scenarios
- Never set cookies or localStorage manually before a test unless that is the explicit test setup

**Selectors**

- Never use XPath
- Never select by element index (`nth(0)`) unless position is semantically meaningful
- Never assert on dynamically generated values (UUIDs, timestamps, auto-increment IDs)

**Assertions**

- Never put assertions inside page objects
- Never assert on environment-specific text that changes between local/dev/prod (exact IDs, server-generated tokens)
- Never use loose equality — `assert.equal` uses `===`

**Configuration**

- Never wrap `cucumber.js` export in `{ default: { ... } }` — it produces 0 scenarios silently
- Never use `require()` — this is ESM-only
- Never add `console.log` — ESLint will reject it; use `this.attach(message, 'text/plain')` in steps

**Test design**

- Never write scenarios that depend on execution order
- Never share mutable state between step definitions via module-level variables
- Never test implementation details — test what the user sees and can do

---

## 8. CI / Pipeline Context

### Workflows

| File                     | Trigger                                | What it does                                                                               |
| ------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------ |
| `check-pull-request.yml` | PR opened/updated against `main`       | Runs `format:check` + `lint`.                                                              |
| `journey-tests.yml`      | `workflow_dispatch` or `workflow_call` | Runs journey tests via `DEFRA/nrf-journey-tests/run-journey-tests@main`.                   |
| `publish.yml`            | Push to `main`                         | Builds Docker image and publishes to AWS ECR via `DEFRA/cdp-build-action/build-test@main`. |

### Reusable action (`run-journey-tests/action.yml`)

Called from the application repo (nrf-frontend) — not triggered directly from this repo's own workflows.

**Localstack mode** (no `environment` input):

```yaml
- uses: DEFRA/nrf-journey-tests/run-journey-tests@main
  with:
    nrf-frontend: ${{ env.IMAGE_TAG }}
```

**CDP mode** (`environment` input set):

```yaml
- uses: DEFRA/nrf-journey-tests/run-journey-tests@main
  with:
    environment: dev
```

The action uses `npm run test:e2e; TEST_EXIT=$?; npm run report; exit $TEST_EXIT` to ensure the Allure report is always generated even when tests fail (GitHub Actions runs bash with `set -e` by default).

---

## 9. Adding New Tests — Checklist

Follow these steps in order for every new test.

### Before writing any code

1. Read `flows/<user-flow>.md` — understand the journey, screens, inputs, and expected outcomes
2. If no flow file exists, **stop and ask the user to create one**
3. Check `nrf-frontend/src` for the actual route paths, form field names, and page titles

### Implementation steps

4. **Page Object** — create or extend `test/page-objects/<name>.page.js`

   - Extend `Page` for standard GOV.UK pages
   - Expose locators as getters, actions as `async` methods
   - No assertions inside the page object

5. **Register** the page object in `test/support/world.js` under `this.pageObjects`

6. **Feature file** — create `test/features/<journey>.feature`

   - Tag every scenario with `@smoke` and/or `@regression`
   - Write scenarios from the user's perspective
   - Use `{string}` / `{int}` parameter types — no hardcoded values in step text

7. **Step definitions** — create `test/step-definitions/<journey>.steps.js`

   - Mirror the feature file name
   - Access the page via `this.pageObjects.<name>` and `this.page`
   - Put assertions here, not in page objects

8. **Verify locally in headed mode**

   ```sh
   npm run test:e2e:debug
   ```

9. **Lint and format**
   ```sh
   npm run lint && npm run format:check
   ```
   Fix any issues before committing — the pre-commit hook enforces both.

### For API tests (when implemented)

- Store in `test/api/`
- Do not use Cucumber — plain JS test files
- Follow the same tagging conventions (`@smoke`, `@regression`)
- Assertion library TBD

### For Database tests (when implemented)

- Store in `test/db/`
- Do not use Cucumber — plain JS test files
- Never connect to production databases
