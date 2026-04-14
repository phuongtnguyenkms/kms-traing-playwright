# Playwright Framework (AI-Friendly)

Initial Playwright + TypeScript framework with E2E + API testing, multi-environment support, and CI.

## Quick start

1. Install dependencies:

```bash
npm install
npx playwright install chromium
```

2. Create environment file (optional local override):

```bash
cp .env.example .env
```

3. Run tests:

```bash
npm test
```

## Environment profiles

The framework supports `dev`, `staging`, and `prod` through `TEST_ENV`:

- `.env.dev`
- `.env.staging`
- `.env.prod`

Run by profile:

```bash
npm run test:dev
npm run test:staging
npm run test:prod
```

`TEST_ENV` defaults to `dev` when not provided.

## Project structure

- `tests/e2e`: End-to-end browser tests
- `tests/api`: API tests using Playwright request client
- `pages`: Page Object Models
- `fixtures`: Shared custom fixtures
- `utils`: Test data and helpers
- `config`: Environment abstractions
- `.github/workflows`: CI automation

## Useful scripts

- `npm test`: run all tests
- `npm run test:api`: run only API tests
- `npm run test:headed`: run in headed mode
- `npm run test:ui`: open Playwright UI mode
- `npm run test:debug`: debug mode
- `npm run report`: open HTML report

## CI

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on push/PR with:

- dependency installation
- Playwright browser setup
- test execution
- report artifact upload

## AI-friendly conventions

- Centralized env handling via `TEST_ENV`
- Reusable Page Object Model pattern
- Shared fixtures for scalable setup
- Rich failure artifacts (`trace`, screenshot, video)
- Separate E2E and API test layers for clear maintenance
