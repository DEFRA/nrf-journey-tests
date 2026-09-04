# API & Backend Test Generation — NRF

You are generating API and backend tests for the **Nature Restoration Fund (NRF)** service. There are two backend services:

- **nrf-backend** — Hapi.js REST API (Node.js), port 3001
- **nrf-impact-assessor** — FastAPI (Python), port 8085 — synchronous geospatial impact analysis API (PostGIS)

The repo currently has only the Cucumber E2E suite under `test/` (`features`, `page-objects`, `step-definitions`, `support`, `fixtures`). Add API tests alongside it (e.g. `test/api/`) as plain JavaScript files. Read `../AGENTS.md` (in the parent nrf-solution repo) for project-wide conventions.

---

## Architecture overview

```
nrf-frontend (port 3000)
       │
       ▼
nrf-backend (port 3001)  ←──── Hapi.js REST API, PostgreSQL (nrf_backend), MongoDB, Redis
       │
       ▼
nrf-impact-assessor (port 8085)  ←──── Python FastAPI, PostgreSQL/PostGIS (nrf_impact)
       │
       ▼
AWS services (LocalStack in dev): S3, SQS, SNS
```

- Frontend calls backend for data persistence and business logic
- Impact assessor is a synchronous spatial analysis API, called over HTTP
- PostgreSQL (`nrf_backend`, Liquibase migrations) is the backend's primary store; MongoDB holds sessions/app state; Redis handles caching and sessions
- All inter-service communication is HTTP

---

## nrf-backend

**Base URL:** `http://localhost:3001` (local), `https://nrf-backend.<env>.cdp-int.defra.cloud` (CDP)

**Source:** `../backend/src/`

### Current endpoints

Health check: `GET /health`.

**Note:** Always read the current route files in `../backend/src/routes/` before writing tests — do not assume endpoints exist.

### Domain endpoints to test when implemented

These are the expected endpoints based on the application design. Verify against source before writing tests:

| Method | Path                        | Purpose                     |
| ------ | --------------------------- | --------------------------- |
| POST   | `/quote`                    | Submit quote request        |
| GET    | `/quote/{quoteId}`          | Retrieve quote by ID        |
| POST   | `/quote/{quoteId}/boundary` | Upload boundary file        |
| GET    | `/quote/{quoteId}/result`   | Get levy calculation result |

---

## nrf-impact-assessor

**Base URL:** `http://localhost:8085` (local)

**Source:** `../impact-assessor/`

**Language:** Python 3.13 / FastAPI — API tests for this service should still be written in JavaScript (HTTP calls) to keep the test suite in one language. Alternatively, Python/pytest tests can live in the nrf-impact-assessor repo itself.

### Current endpoints

Do not assume endpoints. Read the routers in `../impact-assessor/app/` (boundary, assess, assessments, tiles) — the service is a synchronous request/response API.

---

## Test structure

The repo's existing Cucumber E2E suite lives under `test/`:

```
test/
  features/           # Gherkin feature files
  page-objects/       # Page objects
  step-definitions/   # Cucumber step definitions
  support/            # World, hooks, config
  fixtures/           # Test fixtures
```

Add API tests alongside this structure (e.g. `test/api/`), as plain JavaScript files.

**Naming convention:** `<resource>.test.js`

---

## How to make HTTP requests

Use the native Node.js `fetch` (available in Node 22). Do not add test-specific HTTP libraries.

```js
// test/api/health.test.js
import assert from 'node:assert/strict'
import { test } from 'node:test'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'
const IMPACT_URL = process.env.IMPACT_URL || 'http://localhost:8085'

test('nrf-backend health check returns 200', async () => {
  const res = await fetch(`${BACKEND_URL}/health`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.status, 'ok')
})

test('nrf-impact-assessor health check returns 200', async () => {
  const res = await fetch(`${IMPACT_URL}/health`)
  assert.equal(res.status, 200)
})
```

---

## What to test

### For each endpoint:

1. **Happy path** — valid request, assert status code and response shape
2. **Validation errors** — missing/invalid fields, assert 400 + error body
3. **Not found** — non-existent resource ID, assert 404
4. **Auth (when enabled)** — unauthenticated request returns 401/403

### Response shape assertions

Assert the shape, not exact dynamic values (IDs, timestamps):

```js
// Good — assert shape
assert.ok(typeof body.quoteId === 'string')
assert.ok(body.createdAt instanceof Date || typeof body.createdAt === 'string')

// Bad — assert exact dynamic value
assert.equal(body.quoteId, '507f1f77bcf86cd799439011')
```

### For file upload endpoints

Use `FormData` with a real test fixture file:

```js
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const formData = new FormData()
const file = new Blob(
  [readFileSync(join('test/fixtures/test-boundary.geojson'))],
  {
    type: 'application/geo+json'
  }
)
formData.append('file', file, 'test-boundary.geojson')

const res = await fetch(`${BACKEND_URL}/quote/${quoteId}/boundary`, {
  method: 'POST',
  body: formData
})
```

---

## Test data and fixtures

- Store fixture files in `test/fixtures/`
- For boundary uploads: include a minimal valid GeoJSON polygon (`test/fixtures/boundary.geojson`)
- For invalid file tests: include a malformed or wrong-format file
- Never commit real coordinates of real sites

### Minimal boundary GeoJSON fixture

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-1.5, 52.0],
            [-1.4, 52.0],
            [-1.4, 52.1],
            [-1.5, 52.1],
            [-1.5, 52.0]
          ]
        ]
      },
      "properties": {}
    }
  ]
}
```

---

## Database tests

Only write database tests when:

- You need to assert state that is not visible via the API
- You are testing data integrity or migration correctness

Connect via the same `MONGODB_URI` env var the app uses. Never connect to a production database.

```js
// test/db/quote-repository.test.js
import { MongoClient } from 'mongodb'
import assert from 'node:assert/strict'
import { test, before, after } from 'node:test'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nrf'
let client

before(async () => {
  client = new MongoClient(MONGODB_URI)
  await client.connect()
})

after(async () => {
  await client.close()
})

test('quote is persisted with correct status', async () => {
  const db = client.db()
  const quote = await db.collection('quotes').findOne({ status: 'submitted' })
  assert.ok(quote)
  assert.equal(quote.status, 'submitted')
})
```

---

## Environment variables

| Variable       | Default                         | Description                  |
| -------------- | ------------------------------- | ---------------------------- |
| `BACKEND_URL`  | `http://localhost:3001`         | nrf-backend base URL         |
| `IMPACT_URL`   | `http://localhost:8085`         | nrf-impact-assessor base URL |
| `MONGODB_URI`  | `mongodb://localhost:27017/nrf` | MongoDB connection string    |
| `AWS_ENDPOINT` | `http://localhost:4566`         | LocalStack endpoint          |

---

## Running API tests

API tests are not yet wired into the npm scripts. When the first test file exists, add to `package.json`:

```json
"test:api": "node --test test/api/**/*.test.js"
```

Run locally:

```sh
BACKEND_URL=http://localhost:3001 npm run test:api
```

---

## Implementation checklist

For every new API endpoint under test:

1. Read the route handler in `../backend/src/routes/` — check method, path, request schema, response schema
2. Identify: happy path, validation error cases, auth requirements
3. Create or extend `test/api/<resource>.test.js`
4. Add any required fixture files to `test/fixtures/`
5. Run tests locally against the running service
6. Ensure `npm run lint` passes (no `console.log` — use `process.stdout.write` sparingly if needed, or omit)

---

## What NOT to test

- Internal implementation details (private functions, DB queries directly — prefer API surface)
- The Swagger `/docs` endpoint (browser-rendered, not meaningful to assert)
- Exact error message strings that may change (assert error shape and status code, not message text)
- Timing-dependent behaviour without explicit polling/retry logic
