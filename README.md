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

3. Store login credentials in a separate local-only file:

```bash
cp .env.local.example .env.local
```

Then set values for `LOGIN_USERNAME` and `LOGIN_PASSWORD` in `.env.local`.

4. Run tests:

```bash
npm test
```

## Environment profiles

The framework supports `int`, `staging`, and `prod` through `TEST_ENV`.
Create local files from templates (these local files are ignored by git):

- `cp .env.int.example .env.int`
- `cp .env.staging.example .env.staging`
- `cp .env.prod.example .env.prod`

Run by profile:

```bash
npm run test:dev
npm run test:staging
npm run test:prod
```

`TEST_ENV` defaults to `int` when not provided.

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
