module.exports = {
  env: {
    es2022: true,
    node: true,
    jest: true
  },
  globals: {
    before: true,
    after: true
  },
  extends: ['standard', 'prettier', 'eslint:recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['prettier', 'no-secrets'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'error',
    'no-secrets/no-secrets': ['error', { tolerance: 4.5 }]
  }
}
