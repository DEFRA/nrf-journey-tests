# Claude migrate: WebdriverIO+Cucumber → Playwright+Cucumber

Repository path: /nrf-journey-tests

## Goal

- Migrate end-to-end tests from WebdriverIO + Cucumber to Playwright + Cucumber (standalone), preserving the existing Page Object Model (POM) and Gherkin feature files.
- Keep JavaScript, Dockerised runs, and the three-layer architecture: Steps → Page Objects → Playwright.

## Context

- Feature files live under `test/features/`. Prefer keeping Gherkin unchanged.
- Current tests use WebdriverIO + Cucumber with Page Objects and step definitions.
- Preserve naming conventions and folder layout where practical.

## Stack & Constraints

- Use `playwright` (library; not Playwright Test runner) + `@cucumber/cucumber` (cucumber-js).
- JavaScript (async/await). Keep Node compatibility with repo.
- Tests runnable locally and inside Docker.
- Provide a Cucumber World that shares `browser`/`context`/`page` and exposes Page Objects to steps.
- Headless by default; support headed via `E2E_HEADFUL=true` environment variable.
- Minimal, non-destructive edits; avoid reformatting unrelated files.

## Tasks (what to deliver)

1. Repo audit

   - List files in `test/features/`, step definition files, and existing Page Objects.
   - Produce a mapping table: WebdriverIO API → Playwright equivalent.

2. Dependencies & scripts

   - Update `package.json` to add `playwright`, `@cucumber/cucumber`, (optional `dotenv`).
   - Scripts to add: `test:e2e`, `test:e2e:debug`, and `postinstall` to run `npx playwright install --with-deps`.

3. Cucumber + Playwright scaffold

   - Add `test/support/world.js` (Cucumber World) that launches browser, creates context and `page`, and exposes `this.pageObjects`.
   - Add `test/support/hooks.js` to attach screenshots on failure and close resources.

4. Page Objects

   - Add `test/page-objects/BasePage.js` with helpers: `goto`, `click`, `fill`, `text`, `waitFor`.
   - Convert 2–3 commonly used Page Objects from WebdriverIO → Playwright, preserving method names used by steps.

5. Step definitions

   - Convert existing step files to use Playwright World and Page Objects (async/await).
   - Provide two complete example conversions (navigation/assertion and form-filling).

6. Docker & CI

   - Update `Dockerfile` / `compose.yml` to run `npx playwright install --with-deps` and install required OS packages.
   - Provide a CI snippet (GitHub Actions or generic) to run `npm run test:e2e` headless.

7. Docs & run instructions

   - Add `README-E2E.md` (or update `README.md`) with install and run instructions for local and Docker, plus debugging notes.

8. Deliverables
   - Git-style patch diffs or a branch implementing changes.
   - Short list of added/modified files with purpose.
   - WebdriverIO → Playwright mapping table.
   - Two example converted feature + step + page-object triples.
   - Docker / compose and CI snippets.
   - Exact copy-paste commands to run tests locally and in Docker.
   - Migration notes and next steps.

## Quality & safety

- Capture screenshots on failure and attach to Cucumber reports.
- Headless default; `E2E_HEADFUL=true` toggles headed mode.
- Log helpful debug info when steps fail.
- Port any custom WebdriverIO helpers to small Playwright helper modules.

## Output format required

- Provide patch diffs for all file changes (git unified diff or apply_patch-style).
- Summarize file changes in a short list.
- Provide exact run commands (copy-paste-ready).
- Include mapping table and migration notes.

## Start instruction (first action)

Start by listing `test/features/`, step definition files (e.g., `test/step-definitions/`), and `test/page-objects/` (or `page-objects/`) so we can identify the 2–3 Page Objects to convert first.

## Questions (only ask if needed)

- Preferred browser? (Chromium default)
- CI provider? (GitHub Actions default)

---

_End of prompt template._
