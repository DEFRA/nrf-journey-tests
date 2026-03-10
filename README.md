# E2E Tests — Playwright + Cucumber

End-to-end tests using [Playwright](https://playwright.dev/) (browser library) and [Cucumber](https://cucumber.io/) (BDD runner).

## Stack

| Layer              | Technology                                 |
| ------------------ | ------------------------------------------ |
| Browser automation | `playwright` (Chromium)                    |
| Test runner / BDD  | `@cucumber/cucumber`                       |
| Reporting          | `allure-cucumberjs` + `allure-commandline` |
| Language           | JavaScript (ESM, Node ≥ 22)                |

## Prerequisites

- Node.js ≥ 22.13.1
- `npm install` (also installs the Chromium browser via `postinstall`)

---

## Run modes

There are three ways to run the tests, depending on what you are testing against.

### Mode 1 — Local (developer machine)

Use this when you have the frontend service running locally on your machine.

```sh
# Start the service in a separate terminal
cd ../nrf-frontend && NODE_ENV=development ENABLE_DEFRA_ID=false node src/index.js

# Run the tests against it
npm run test:e2e:local

# Headed mode — opens a visible browser window (useful for debugging)
npm run test:e2e:debug
```

The `BASE_URL` is hardcoded to `http://localhost:3000` by these scripts.

---

### Mode 2 — Localstack (Docker Compose)

Use this to run the full stack in Docker locally, or to replicate what GitHub Actions does.
All services start as Docker containers and communicate over Docker's internal network.
The test runner itself runs on the host and reaches the service via the exposed port 3000.

```sh
# Build images and start all services, then run tests
npm run test:localstack

# Afterwards, tear down the containers
docker compose down
```

What this does:

1. `docker compose up --wait -d` — starts `nrf-frontend` and waits for its `/health` healthcheck to pass
2. `npm run test:e2e` — runs Cucumber against `http://localhost:3000` (the exposed port)

To pull a specific image version instead of `latest`:

```sh
NRF_FRONTEND=1.2.3 npm run test:localstack
```

---

### Mode 3 — CDP cloud environment (GitHub Actions)

Use this to run tests against a service already deployed on the CDP platform (AWS).
No Docker Compose is needed — the service is already running in the cloud.

```sh
# Against the dev environment
ENVIRONMENT=dev npm run test:e2e

# Against the test environment
ENVIRONMENT=test npm run test:e2e
```

The URL is constructed automatically as:
`https://nrf-frontend.<ENVIRONMENT>.cdp-int.defra.cloud`

In GitHub Actions this is triggered by passing the `environment` input to the reusable action — see [Calling the action from another repo](#calling-the-action-from-another-repo) below.

---

## Generate and view the Allure report

```sh
# Generate HTML report from the latest run
npm run report

# Open the report (opens index.html in allure-report/)
npx allure open allure-report
```

Screenshots of failed scenarios are automatically attached to the report.

---

## Debug a failing scenario

1. Run headed: `npm run test:e2e:debug`
2. To pause at a specific step, add `await this.page.pause()` in a step definition — Playwright Inspector opens automatically in headed mode.
3. Check the Allure report for screenshots taken at the point of failure.

---

## Folder structure

```
test/
  features/           # Gherkin .feature files
  step-definitions/   # Cucumber step implementations
  page-objects/       # Page Object classes (extend BasePage)
    BasePage.js       # Playwright helpers: goto, click, fill, text, waitFor, title
    page.js           # Base page with pageHeading locator
    home.page.js      # HomePage — open()
  support/
    world.js          # Cucumber World: launches browser, exposes this.page + this.pageObjects
    hooks.js          # Before/After lifecycle; screenshot on failure; FAILED file on suite failure
cucumber.js           # Cucumber profile configuration
```

## Adding a new Page Object

1. Create `test/page-objects/my.page.js` extending `BasePage` (or `Page`).
2. Register an instance in `test/support/world.js` under `this.pageObjects`.
3. Reference it in step definitions as `this.pageObjects.myPage`.

---

## Environment variables

| Variable       | Default                 | Description                                                                                       |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| `ENVIRONMENT`  | —                       | CDP environment name (e.g. `dev`, `test`). Constructs the CDP cloud URL — takes highest priority. |
| `BASE_URL`     | `http://localhost:3000` | Full base URL override. Used when `ENVIRONMENT` is not set.                                       |
| `BROWSER`      | `chromium`              | Browser engine to use. Accepted values: `chromium`, `firefox`, `webkit`. Defaults to `chromium`.  |
| `E2E_HEADFUL`  | `false`                 | Set to `true` to run with a visible browser window (local mode only).                             |
| `NRF_FRONTEND` | `latest`                | Docker image tag for nrf-frontend used in localstack mode.                                        |

---

## Browser compatibility

By default all tests run in **Chromium**. To run against a different browser, set the `BROWSER` env var:

```sh
# Firefox
BROWSER=firefox npm run test:e2e:local

# WebKit (Safari engine)
BROWSER=webkit npm run test:e2e:local

# Chromium (default — explicit)
BROWSER=chromium npm run test:e2e:local
```

To run the full suite across all three browsers in sequence:

```sh
for browser in chromium firefox webkit; do
  BROWSER=$browser npm run test:e2e:local
done
```

> **Note:** `webkit` covers the Safari/WebKit engine. To test against the installed Microsoft Edge browser specifically, that requires Edge to be installed on the machine and is not currently wired up.

All three browser engines ship with the `playwright` package — no additional installation is needed.

---

## Calling the action from another repo

The `run-journey-tests/action.yml` composite action is designed to be called from a GitHub Actions workflow in the application repo (e.g. nrf-frontend).

**Localstack mode** — starts Docker Compose, runs tests on the runner host:

```yaml
- uses: DEFRA/nrf-journey-tests/run-journey-tests@main
  with:
    nrf-frontend: ${{ env.IMAGE_TAG }}
```

**CDP mode** — skips Docker Compose, runs tests against the deployed service:

```yaml
- uses: DEFRA/nrf-journey-tests/run-journey-tests@main
  with:
    environment: ${{ inputs.environment }} # e.g. "dev" or "test"
```

---

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

> Contains public sector information licensed under the Open Government licence v3
