// The frontend under test: a deployed environment when ENVIRONMENT is set,
// else BASE_URL or the local stack. Kept in a leaf module so non-cucumber
// code (e.g. seed-quote.js) can use it — world.js's module scope calls
// cucumber APIs and can only be imported inside a run.
export const baseUrl = process.env.ENVIRONMENT
  ? `https://nrf-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`
  : process.env.BASE_URL || 'http://localhost:3000'
