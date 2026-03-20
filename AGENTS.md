# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

**IMPORTANT:** Before making any code changes, read `.ai/coding-rules.md` for coding standards and patterns.

## Project overview

This repository contains the E2E test suite for the **Nature Restoration Fund (NRF)** service — a DEFRA CDP platform application. Tests validate end-to-end user journeys against the NRF frontend service.

**Testing scope:**

- Web UI journeys (BDD — Cucumber + Playwright) — active
- API tests (plain JS, no Cucumber) — planned (`test/api/`)
- Database tests (plain JS, no Cucumber) — planned (`test/db/`)

The service under test is `nrf-frontend` (Hapi.js), available as a sibling repo at `../nrf-frontend`.

## Tech stack

| Concern            | Tool                        |
| ------------------ | --------------------------- |
| Language           | JavaScript (ESM, Node ≥ 22) |
| Browser automation | Playwright                  |
| BDD runner         | @cucumber/cucumber          |
| Reporting          | allure-cucumberjs           |
| Assertions         | `node:assert/strict`        |

## Key npm scripts

```sh
npm run test:e2e:local    # run all tests against localhost:3000
npm run test:e2e:debug    # headed mode (browser visible)
npm run test:localstack   # start Docker Compose + run tests
npm run lint              # ESLint
npm run format:check      # Prettier check
npm run report            # generate Allure report
```

## Project structure

```
test/
  features/           # Gherkin .feature files — one per journey
  step-definitions/   # Cucumber step implementations
  page-objects/       # Page Object Model (BasePage → Page → *.page.js)
  support/
    world.js          # PlaywrightWorld — browser lifecycle, baseUrl, pageObjects map
    hooks.js          # Before/After per scenario; screenshot on fail
flows/                # User flow descriptions — READ BEFORE WRITING TESTS
run-journey-tests/
  action.yml          # Reusable composite GitHub Actions action
cucumber.js           # Cucumber profile (ESM flat export — do NOT double-nest)
compose.yml           # Docker Compose: mongodb, redis, localstack, nrf-frontend
```

## Environment / base URL resolution

Priority order (in `test/support/world.js`):

1. `ENVIRONMENT` env var → `https://nrf-frontend.<env>.cdp-int.defra.cloud`
2. `BASE_URL` env var → explicit URL
3. Fallback → `http://localhost:3000`

## Before writing any test

1. Read `flows/<user-flow>.md` — if it does not exist, stop and ask the user to create it. Flow files must describe only what the user sees and does — no implementation details (no middleware names, function names, env vars, internal redirect logic, or source file paths). Blocked or out-of-scope items state the observable reason only.
2. Check `../nrf-frontend/src` for actual routes, field names, and page titles
3. Check `../nrf-frontend/src` for `page.test.js` files (the nrf-frontend integration test convention) and `../nrf-backend/src` for `*.test.js` files covering the feature. Any behaviour already tested at the unit or integration level (validation, back-link persistence, session state, etc.) must **not** be duplicated as an E2E scenario — move it to "Out of scope" in the flow doc. Journey tests cover the forward happy path only.
4. Follow the implementation checklist in `.ai/skills/ui-test/SKILL.md`
