# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

**IMPORTANT:** Before making any code changes, read `.ai/coding-rules.md` for coding standards and patterns.

**IMPORTANT:** At the start of every session, read `flows/README.md` and the relevant journey file(s) in `flows/`. Cross-reference them against `../nrf-frontend/src` routes and templates. If a route exists in the source but its branch is still marked `[BLOCKED]` or `[PLANNED]` in the flow file, flag it to the user and ask whether to update the flow and write the test. Update flow files whenever the application changes — before touching test code.

---

## 1. Project Overview

This repository contains the E2E test suite for the **Nature Restoration Fund (NRF)** service — a DEFRA CDP platform application. Tests validate end-to-end user journeys against the NRF frontend service.

The framework runs against three targets:

- **Local** — developer machine, service running on `localhost`
- **Localstack** — full stack in Docker Compose, used in GitHub Actions CI
- **CDP cloud** — deployed environments (dev, test, prod) on AWS

**Testing scope:**

- Web UI journeys (BDD — Cucumber + Playwright) — **active**
- API tests (plain JS, no Cucumber) — **planned** (`test/api/`)
- Database tests (plain JS, no Cucumber) — **planned** (`test/db/`)

The service under test is `nrf-frontend` (Hapi.js), available as a sibling repo at `../nrf-frontend`.

Before implementing any test, read the relevant `flows/<user-flow>.md` file. Flow files describe only what the user sees and does — no implementation details (no middleware names, function names, env vars, internal redirect logic, or source file paths). Blocked or out-of-scope items state the observable reason only. If no flow file exists, **stop and ask the user to create one**.

---

## 2. Tech Stack

| Concern                | Tool                                   | Version        |
| ---------------------- | -------------------------------------- | -------------- |
| Language               | JavaScript (ESM)                       | Node ≥ 22.13.1 |
| Browser automation     | Playwright (Chromium)                  | 1.50.1         |
| BDD runner (web tests) | @cucumber/cucumber                     | 11.2.0         |
| Reporting              | allure-cucumberjs + allure-commandline | 3.2.0 / 2.32.0 |
| Assertions (web)       | `node:assert/strict`                   | built-in       |
| CI                     | GitHub Actions                         | —              |
| Package manager        | npm                                    | —              |
| Linting                | ESLint (standard config)               | ^8.57.0        |
| Formatting             | Prettier                               | 3.4.2          |

---

## 3. Key npm Scripts

```sh
npm run test:e2e:local    # run all tests against localhost:3000
npm run test:e2e:debug    # headed mode (browser visible)
npm run test:localstack   # start Docker Compose + run tests
npm run lint              # ESLint
npm run format:check      # Prettier check
npm run report            # generate Allure report
```

---

## 4. Project Structure

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
├── .ai/
│   ├── coding-rules.md             # Coding standards and patterns — read before changing code
│   └── skills/                     # Skill definitions for AI-assisted test generation
│
├── run-journey-tests/
│   └── action.yml                  # Reusable composite action (localstack + CDP modes)
│
├── .github/workflows/
│   ├── check-pull-request.yml      # PR checks: format + lint
│   ├── journey-tests.yml           # Callable/dispatchable journey test runner
│   └── publish.yml                 # Builds + publishes Docker image to AWS ECR on push to main
│
├── docker/
│   ├── config/                     # .env files for Docker Compose services
│   └── scripts/                    # Init scripts for localstack and other services
│
├── compose.yml                     # Full Docker Compose stack
├── cucumber.js                     # Cucumber profile (ESM flat export — do NOT double-nest)
├── Dockerfile                      # Test runner image (used by CDP portal)
├── entrypoint.sh                   # Docker entrypoint — runs tests + publishes report
├── AGENTS.md                       # This file
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

## 5. Conventions & Patterns

All coding standards, selector priorities, tagging strategy, page object rules, and the cucumber.js ESM quirk are documented in `.ai/coding-rules.md`. Read it before writing or changing any code.

Key points for quick reference:

- **world.js** — register every new page object in `openBrowser()` under `this.pageObjects`
- **@pending tag** — tag scenarios that cannot yet be implemented with `@pending` and a comment explaining the blocker; `tags: 'not @pending'` in `cucumber.js` excludes them from all runs
- Scenario titles describe the observable outcome, not the implementation

---

## 6. How to Run Tests

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
# nrf-frontend (port 3002); nrf-backend runs on port 3001
cd ../nrf-frontend && NODE_ENV=development ENABLE_DEFRA_ID=false node src/index.js
```

---

## 7. Test Data & Environment

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

### Docker infrastructure (localstack / compose mode)

| Service             | Image                            | Purpose                      |
| ------------------- | -------------------------------- | ---------------------------- |
| nrf-frontend        | defradigital/nrf-frontend        | Service under test           |
| nrf-backend         | defradigital/nrf-backend         | Backend API                  |
| nrf-impact-assessor | defradigital/nrf-impact-assessor | Impact assessment service    |
| postgis             | postgis/postgis:16-3.4           | Primary database (PostGIS)   |
| mongo               | mongo:7                          | Document store               |
| redis               | redis:7                          | Session cache                |
| localstack          | localstack/localstack:3.2.0      | AWS (S3, SQS, SNS, DynamoDB) |
| liquibase           | liquibase/liquibase:4.27-alpine  | DB migrations                |
| cdp-uploader        | defradigital/cdp-uploader        | File upload service          |
| nginx               | nginx:alpine                     | Reverse proxy                |

---

## 8. What to Avoid

See `.ai/coding-rules.md` for the full list of coding-level rules (selectors, assertions, waiting, ESM, etc.). The following apply at the test design level:

- **Never write scenarios that depend on execution order** — each scenario is fully isolated
- **Never share mutable state between step definitions via module-level variables**
- **Never test implementation details** — test what the user sees and can do
- **Never set cookies or localStorage manually** before a test unless that is the explicit test setup
- **Never assert on environment-specific text** that changes between local/dev/prod (exact IDs, server-generated tokens)
- **Never connect to production databases** in DB tests

---

## 9. CI / Pipeline Context

### Workflows

| File                     | Trigger                                | What it does                                                                              |
| ------------------------ | -------------------------------------- | ----------------------------------------------------------------------------------------- |
| `check-pull-request.yml` | PR opened/updated against `main`       | Runs `format:check` + `lint`                                                              |
| `journey-tests.yml`      | `workflow_dispatch` or `workflow_call` | Runs journey tests via `DEFRA/nrf-journey-tests/run-journey-tests@main`                   |
| `publish.yml`            | Push to `main`                         | Builds Docker image and publishes to AWS ECR via `DEFRA/cdp-build-action/build-test@main` |

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

## 10. Adding New Tests — Checklist

Follow these steps in order for every new test.

### Before writing any code

1. Read `flows/<user-flow>.md` — understand the journey, screens, inputs, and expected outcomes. If the file does not exist, **stop and ask the user to create it**.
2. Check `../nrf-frontend/src` for actual route paths, form field names, and page titles. Always read the current source — never assume routes or field names from memory.
3. **Coverage gap analysis — mandatory before writing a single line of test code:**
   - Read the latest `../nrf-frontend/src` `page.test.js` files and `../nrf-backend/src` `*.test.js` files for every AC in scope.
   - For each AC, produce a recommendation using one of these three outcomes:
     - **Write E2E** — behaviour is only verifiable end-to-end (cross-service routing, full journey flow, confirmation page content)
     - **Descope from E2E** — behaviour is already covered at unit or integration level; move it to "Out of scope" in the flow doc
     - **Enhance integration test instead** — behaviour could be covered more cheaply and reliably at the integration level; recommend the specific test file to extend rather than writing an E2E scenario
   - Present this analysis to the user and get approval before proceeding. Do not start implementation until the scope is agreed.
4. Follow the implementation checklist in `.ai/skills/ui-test/SKILL.md`.

### Implementation steps

5. **Page Object** — create or extend `test/page-objects/<name>.page.js`

   - Extend `Page` for standard GOV.UK pages
   - Expose locators as getters, actions as `async` methods
   - No assertions inside the page object

6. **Register** the page object in `test/support/world.js` under `this.pageObjects`

7. **Feature file** — create `test/features/<journey>.feature`

   - Tag every scenario with `@smoke` and/or `@regression`
   - Write scenarios from the user's perspective
   - Use `{string}` / `{int}` parameter types — no hardcoded values in step text

8. **Step definitions** — create `test/step-definitions/<journey>.steps.js`

   - Mirror the feature file name
   - Access the page via `this.pageObjects.<name>` and `this.page`
   - Put assertions here, not in page objects

9. **Verify locally in headed mode**

   ```sh
   npm run test:e2e:debug
   ```

10. **Lint and format**
    ```sh
    npm run lint && npm run format:check
    ```
    Fix any issues before committing — the pre-commit hook enforces both.

### For API tests (when implemented)

- Store in `test/api/`
- Do not use Cucumber — plain JS test files
- Follow the same tagging conventions (`@smoke`, `@regression`)

### For Database tests (when implemented)

- Store in `test/db/`
- Do not use Cucumber — plain JS test files
- Never connect to production databases
