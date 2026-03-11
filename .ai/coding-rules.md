# Coding Rules

This file contains specific coding standards, patterns, and conventions for this project.

AI coding agents should read this file before making any code changes.

## Module system

- ESM is mandatory throughout — use `import`/`export` everywhere, never `require()`
- All files must be `.js` with `"type": "module"` in `package.json`

## Formatting

- Prettier config: 2-space indent, no semicolons, single quotes, no trailing commas
- Run `npm run format:check` to verify; `npm run format` to fix

## Linting

- ESLint enforces `no-console` — do not add `console.log`
- Use `this.attach(message, 'text/plain')` in Cucumber steps for debug output
- Run `npm run lint` before committing

## Feature files

- One `.feature` file per user journey, named after the journey: `apply-for-permit.feature`
- Store in `test/features/`
- Tag every scenario with `@smoke` and/or `@regression`
- Scenario titles describe the observable outcome, not the implementation

## Step definitions

- One `.steps.js` file per feature file, same base name
- Store in `test/step-definitions/`
- Use Cucumber parameter types (`{string}`, `{int}`, `{word}`) — never hardcode values in step text
- Access page objects via `this.pageObjects.<name>`, the browser page via `this.page`

## Page objects

- One file per page: `<name>.page.js` in `test/page-objects/`
- Extend `Page` for standard GOV.UK pages (gives `pageHeading` and `open()`)
- Extend `BasePage` directly for non-standard pages
- Register every instance in `test/support/world.js` under `this.pageObjects`
- Expose locators as getters, actions as `async` methods
- **Never put assertions inside page objects** — assert in step definitions

## Element selection priority

1. Role-based: `page.getByRole('button', { name: 'Continue' })`
2. Label: `page.getByLabel('Email address')`
3. Test ID: `page.locator('[data-testid="submit-btn"]')`
4. CSS class (last resort): `page.locator('.govuk-button')`
5. **Never use XPath**
6. **Never select by index** (`nth(0)`) unless position is semantically meaningful

## Assertions

- Use `node:assert/strict` — never use loose equality
- Never put assertions inside page objects
- Never assert on dynamically generated values (UUIDs, timestamps, auto-increment IDs)
- Never assert on environment-specific text that differs between local/dev/prod

## Waiting

- Never use `page.waitForTimeout(ms)` — hard waits make tests slow and brittle
- Use Playwright's built-in auto-waiting, or `locator.waitFor({ state: 'visible' })` for explicit waits

## Test isolation

- Each scenario gets a fresh browser, context, and page (enforced by `hooks.js`)
- Never share state between scenarios
- Never rely on execution order

## cucumber.js config quirk

The config uses ESM. The export must be a **flat default**:

```js
// Correct
export default { paths: [...], import: [...] }

// WRONG — produces 0 scenarios silently
export default { default: { paths: [...], import: [...] } }
```

## Tagging strategy

| Tag           | Meaning                    | CI behaviour                    |
| ------------- | -------------------------- | ------------------------------- |
| `@smoke`      | Critical path              | Blocks PR merge                 |
| `@regression` | Full coverage              | Runs in scheduled/nightly suite |
| `@flaky`      | Known intermittent failure | Excluded from blocking suites   |
