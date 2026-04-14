# Playwright Testing Framework Guide

Welcome to the KMS Training Playwright Testing Framework! This guide will help you understand how to use this framework effectively for both E2E and API testing.

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Running Tests](#running-tests)
5. [Working with Page Objects](#working-with-page-objects)
6. [Writing E2E Tests](#writing-e2e-tests)
7. [Writing API Tests](#writing-api-tests)
8. [Using Fixtures](#using-fixtures)
9. [Configuration & Environments](#configuration--environments)
10. [Test Data](#test-data)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Overview

This is a **Playwright-based test automation framework** that allows you to write and run:
- **E2E (End-to-End) Tests**: Browser-based tests that simulate user interactions
- **API Tests**: Tests that validate REST API endpoints
- **Integration Tests**: Tests that combine both UI and API interactions

### Key Features
- ✅ TypeScript support for type-safe tests
- ✅ Page Object Model for maintainable E2E tests
- ✅ Custom fixtures for reusable test setup
- ✅ Multi-environment support (int, staging, prod)
- ✅ Automatic screenshots and videos on failure
- ✅ HTML test reports
- ✅ Parallel test execution

---

## Project Structure

```
project-root/
├── config/
│   └── env.ts                 # Environment configuration
├── fixtures/
│   └── test.fixture.ts        # Custom test fixtures
├── pages/
│   ├── home.page.ts          # Page Objects for UI testing
│   └── login.page.ts
├── tests/
│   ├── test-1.spec.ts        # Sample test
│   ├── api/
│   │   └── posts.spec.ts     # API tests
│   └── e2e/
│       ├── home.spec.ts      # E2E tests
│       └── login.spec.ts
├── utils/
│   └── test-data.ts          # Shared test data
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies
└── .env                       # Default environment variables
```

### Directory Purposes

| Directory | Purpose |
|-----------|---------|
| `config/` | Stores environment-specific configuration |
| `fixtures/` | Custom Playwright fixtures for test setup |
| `pages/` | Page Objects that encapsulate UI elements and interactions |
| `tests/` | All test files, organized by type (api, e2e) |
| `utils/` | Reusable utilities and test data |
| `test-results/` | Test execution results (screenshots, videos, artifacts) |
| `playwright-report/` | HTML test report |

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

3. **Set up environment variables**

   Create `.env.int`, `.env.staging`, and `.env.prod` files in the root:

   ```env
   BASE_URL=https://your-app-url.com/
   API_BASE_URL=https://api.your-app.com/
   ```

   The framework automatically loads the appropriate `.env.{TEST_ENV}` file based on the `TEST_ENV` variable.

---

## Running Tests

### Available Commands

```bash
# Run all tests in headless mode
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with interactive UI
npm run test:ui

# Debug tests (opens Playwright Inspector)
npm run test:debug

# Run only API tests
npm run test:api

# Run tests against a specific environment
npm run test:int       # Integration environment
npm run test:staging   # Staging environment
npm run test:prod      # Production environment

# View HTML report
npm run report
```

### Running Specific Tests

```bash
# Run tests in a specific file
npx playwright test tests/e2e/login.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run specific test by name
npx playwright test -g "should login successfully"

# Run single test file and show browser
npx playwright test tests/e2e/home.spec.ts --headed
```

### Working with Test Reports

After running tests, an HTML report is generated in the `playwright-report/` directory:

```bash
npm run report
```

The report shows:
- ✅ Passed/Failed tests
- 📸 Screenshots of failures
- 🎥 Video recordings of failed tests
- ⏱️ Test execution times
- 📊 Overall statistics

---

## Working with Page Objects

Page Objects encapsulate UI elements and interactions, making tests maintainable and readable.

### Creating a New Page Object

Create a file in the `pages/` directory:

```typescript
// pages/dashboard.page.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeHeading: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Define locators using best practices (getByRole, getByLabel, etc.)
    this.welcomeHeading = page.getByRole('heading', { name: /welcome/i });
    this.userMenu = page.getByRole('button', { name: /user menu/i });
    this.logoutButton = page.getByRole('menuitem', { name: /logout/i });
  }

  // Navigation methods
  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  // Action methods
  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.click();
  }

  // Verification methods
  async verifyLoaded(): Promise<void> {
    await expect(this.welcomeHeading).toBeVisible();
  }
}
```

### Locator Best Practices

Use these locator strategies in order of preference:

```typescript
// ✅ BEST: Use semantic locators
page.getByRole('button', { name: 'Sign in' })
page.getByLabel('Email')
page.getByPlaceholder('Search')
page.getByText('Welcome')

// ⚠️ ACCEPTABLE: Use CSS or XPath if semantic locators don't work
page.locator('.submit-button')
page.locator('xpath=//button[@type="submit"]')

// ❌ AVOID: Fragile selectors
page.locator('button:nth-child(3)')
page.locator('[class*="btn-"]')
```

### Structure of a Page Object

```typescript
export class MyPage {
  // 1. Declare page and locators
  readonly page: Page;
  readonly element1: Locator;
  readonly element2: Locator;

  // 2. Constructor - initialize locators
  constructor(page: Page) {
    this.page = page;
    this.element1 = page.locator('selector');
  }

  // 3. Navigation methods
  async goto(): Promise<void> { }

  // 4. Action methods (user interactions)
  async fillForm(data: any): Promise<void> { }
  async clickSubmit(): Promise<void> { }

  // 5. Verification methods (assertions)
  async verifyLoaded(): Promise<void> { }
  async verifyError(message: string): Promise<void> { }
}
```

---

## Writing E2E Tests

### Basic E2E Test

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '../../fixtures/test.fixture';
import { testData } from '../../utils/test-data';

test.describe('Login Page', () => {
  test('user can log in successfully', async ({ loginPage }) => {
    // 1. Navigate
    await loginPage.goto();
    await loginPage.verifyLoaded();

    // 2. Perform actions
    await loginPage.fillEmail(testData.validEmail);
    await loginPage.fillPassword(testData.validPassword);
    await loginPage.clickLogin();

    // 3. Verify results
    await expect(loginPage.page).toHaveURL(/.*dashboard/);
  });

  test('shows error for invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.fillEmail('invalid@email.com');
    await loginPage.fillPassword('wrongpassword');
    await loginPage.clickLogin();

    await loginPage.verifyErrorMessage('Invalid credentials');
  });
});
```

### Test Organization

Group related tests using `test.describe()`:

```typescript
test.describe('User Authentication', () => {
  test('should log in', async ({ loginPage }) => { });
  test('should log out', async ({ dashboardPage }) => { });
  test('should handle session timeout', async ({ loginPage }) => { });
});

test.describe('User Profile', () => {
  test('should update profile', async ({ profilePage }) => { });
  test('should upload avatar', async ({ profilePage }) => { });
});
```

### Before/After Hooks

Run setup or cleanup before and after tests:

```typescript
test.describe('Admin Panel', () => {
  test.beforeEach(async ({ adminPage }) => {
    // Runs before each test
    await adminPage.goto();
    await adminPage.login(); // If needed
  });

  test.afterEach(async ({ page }) => {
    // Runs after each test
    // Cleanup, reset state, etc.
    await page.close();
  });

  test('manage users', async ({ adminPage }) => {
    // adminPage is already logged in here
  });
});
```

---

## Writing API Tests

### Basic API Test

```typescript
// tests/api/users.spec.ts
import { test, expect } from '@playwright/test';
import { env } from '../../config/env';

test.describe('Users API', () => {
  test('GET /users returns list of users', async ({ request }) => {
    const response = await request.get(`${env.apiBaseUrl}/users`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('POST /users creates a new user', async ({ request }) => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    };

    const response = await request.post(`${env.apiBaseUrl}/users`, {
      data: newUser,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.name).toBe(newUser.name);
  });

  test('GET /users/:id returns specific user', async ({ request }) => {
    const response = await request.get(`${env.apiBaseUrl}/users/1`);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toMatchObject({
      id: 1,
      name: expect.any(String),
      email: expect.any(String),
    });
  });

  test('PUT /users/:id updates user', async ({ request }) => {
    const updates = { name: 'Jane Doe' };

    const response = await request.put(`${env.apiBaseUrl}/users/1`, {
      data: updates,
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.name).toBe('Jane Doe');
  });

  test('DELETE /users/:id deletes user', async ({ request }) => {
    const response = await request.delete(`${env.apiBaseUrl}/users/1`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(204);
  });
});
```

### Common API Assertions

```typescript
// Status codes
expect(response.status()).toBe(200);
expect(response.ok()).toBeTruthy(); // 200-299

// Headers
expect(response.headers()['content-type']).toContain('application/json');

// Body content
const body = await response.json();
expect(body.id).toBeDefined();
expect(body.name).toBe('Expected Name');
expect(body).toMatchObject({ id: 1, name: 'John' });
expect(Array.isArray(body)).toBeTruthy();

// Error responses
expect(response.status()).toBe(404);
const error = await response.json();
expect(error.message).toContain('Not found');
```

---

## Using Fixtures

Fixtures provide reusable setup for tests. This framework includes custom fixtures for Page Objects.

### Built-in Fixtures

```typescript
import { test, expect } from '../../fixtures/test.fixture';

test('example', async ({ homePage, loginPage, page, request }) => {
  // homePage - HomePage instance
  // loginPage - LoginPage instance
  // page - Playwright Page object
  // request - Playwright APIRequestContext for API calls
});
```

### Adding Page Objects to Fixtures

1. Create your Page Object in `pages/`:
   ```typescript
   // pages/profile.page.ts
   export class ProfilePage { }
   ```

2. Update `fixtures/test.fixture.ts`:
   ```typescript
   import { ProfilePage } from '../pages/profile.page';

   type AppFixtures = {
     homePage: HomePage;
     loginPage: LoginPage;
     profilePage: ProfilePage;  // Add this
   };

   export const test = base.extend<AppFixtures>({
     // ... existing fixtures
     profilePage: async ({ page }, use) => {
       await use(new ProfilePage(page));
     },
   });
   ```

3. Use in your tests:
   ```typescript
   test('user can update profile', async ({ profilePage }) => {
     // Now you can use profilePage
   });
   ```

---

## Configuration & Environments

### Environment Configuration

Different environments can have different URLs and configurations:

```typescript
// config/env.ts
const testEnv = process.env.TEST_ENV || 'int';

export const env = {
  testEnv,
  baseUrl: process.env.BASE_URL || 'https://evolvetest.elsevier.com/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
};
```

### Environment Files

Create `.env.{environment}` files:

```env
# .env.int
BASE_URL=https://app-int.example.com/
API_BASE_URL=https://api-int.example.com/

# .env.staging
BASE_URL=https://app-staging.example.com/
API_BASE_URL=https://api-staging.example.com/

# .env.prod
BASE_URL=https://app.example.com/
API_BASE_URL=https://api.example.com/
```

### Playwright Configuration

Customize test behavior in `playwright.config.ts`:

```typescript
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Parallel execution
  fullyParallel: true,           // Run tests in parallel
  workers: process.env.CI ? 1 : undefined,  // Number of workers

  // Retries (useful in CI)
  retries: process.env.CI ? 2 : 0,

  // Timeouts
  timeout: 30_000,               // Per test timeout
  expect: { timeout: 5_000 },    // Per assertion timeout

  // Reporting
  reporter: [['html', { open: 'never' }], ['list']],

  // Global settings
  use: {
    baseURL: baseURL,
    trace: 'on-first-retry',      // Record trace on failure
    screenshot: 'only-on-failure', // Screenshots on failure
    video: 'retain-on-failure',    // Record video on failure
    actionTimeout: 10_000,         // Action timeout
    navigationTimeout: 20_000,     // Navigation timeout
  },

  // Browsers to test on
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add more browsers:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## Test Data

Centralize test data in `utils/test-data.ts`:

```typescript
// utils/test-data.ts
export const testData = {
  // User credentials
  validEmail: 'user@example.com',
  validPassword: 'SecurePass123!',
  
  // Invalid data
  invalidEmail: 'not-an-email',
  invalidPassword: '123',

  // API test data
  newUserPayload: {
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
  },

  // Expected values
  expectedDocHeading: 'Installation',
  expectedErrorMessage: 'Invalid credentials',
};
```

### Using Test Data

```typescript
import { testData } from '../../utils/test-data';

test('login with valid credentials', async ({ loginPage }) => {
  await loginPage.fillEmail(testData.validEmail);
  await loginPage.fillPassword(testData.validPassword);
});
```

---

## Best Practices

### 1. **Use Page Objects**
✅ DO: Encapsulate selectors and interactions in Page Objects  
❌ DON'T: Use raw selectors directly in tests

### 2. **Use Semantic Locators**
✅ DO: `page.getByRole('button', { name: 'Sign in' })`  
❌ DON'T: `page.locator('.btn-signin')`

### 3. **Keep Tests Independent**
✅ DO: Each test should run independently  
❌ DON'T: Depend on test order or shared state

### 4. **Use Descriptive Test Names**
✅ DO: `test('should display error for invalid email')`  
❌ DON'T: `test('login test')`

### 5. **Avoid Hard-coded Waits**
✅ DO: `await expect(element).toBeVisible()`  
❌ DON'T: `await page.waitForTimeout(2000)`

### 6. **Use Page Load Verification**
```typescript
async verifyLoaded(): Promise<void> {
  await expect(this.mainElement).toBeVisible();
}
```

### 7. **Handle Async Operations**
```typescript
// Wait for API response
await page.waitForResponse(response => 
  response.url().includes('/api/data') && response.status() === 200
);
```

### 8. **Organize Tests by Feature**
```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── logout.spec.ts
│   ├── user/
│   │   ├── profile.spec.ts
│   │   └── settings.spec.ts
└── api/
    ├── users.spec.ts
    └── posts.spec.ts
```

### 9. **Use Test Hooks for Setup/Teardown**
```typescript
test.beforeEach(async ({ page }) => {
  // Setup before each test
});

test.afterEach(async ({ page }) => {
  // Cleanup after each test
});
```

### 10. **Keep Tests Concise**
✅ DO: One assertion per scenario (or closely related)  
❌ DON'T: Test multiple unrelated features in one test

---

## Troubleshooting

### Common Issues

#### ❌ Tests Not Running
```bash
# Error: Command not found
Solution: npm install && npx playwright install

# Error: Cannot find module
Solution: Check tsconfig.json is correct and npm install is complete
```

#### ❌ Selector Not Found
```typescript
// Problem: Element not found
// Solution 1: Verify element exists in DOM
await expect(element).toBeVisible();

// Solution 2: Wait for element to appear
await expect(element).toBeVisible({ timeout: 10000 });

// Solution 3: Check if in iframe
const frameLocator = page.frameLocator('iframe');
const element = frameLocator.locator('selector');
```

#### ❌ Timeout Errors
```bash
# Increase timeout in playwright.config.ts:
timeout: 60_000,  // 60 seconds

# Or per test:
test.setTimeout(60000);

# Or per action:
await page.click('button', { timeout: 20000 });
```

#### ❌ Flaky Tests (Intermittent Failures)
```typescript
// Problem: Element appears/disappears
// Solution: Use proper wait conditions
❌ await page.click('selector');
✅ await page.click('selector', { waitUntil: 'load' });

// Problem: Dynamic content
// Solution: Use retry logic
❌ await button.click();
✅ await button.click({ force: true });

// Problem: Network delays
// Solution: Wait for network
await page.waitForLoadState('networkidle');
```

#### ❌ Environment Variables Not Loading
```bash
# Problem: Wrong environment loaded
# Solution: Check TEST_ENV variable
echo $TEST_ENV

# Set explicitly:
TEST_ENV=staging npm test

# Verify .env file exists:
ls -la .env.*
```

#### ❌ 127 Exit Code
This means "command not found". Solutions:
```bash
# 1. Ensure Playwright is installed
npx playwright install

# 2. Reinstall all dependencies
rm -rf node_modules
npm install
npx playwright install

# 3. Check Node installation
node --version
npm --version
```

### Debug Mode

```bash
# Run tests with Playwright Inspector
npm run test:debug

# Or use headed mode to see what's happening
npm run test:headed

# Use UI mode for interactive debugging
npm run test:ui
```

### Check Test Reports

```bash
# View detailed HTML report
npm run report

# Look for failures, screenshots, and videos
# of failed test executions
```

---

## Quick Reference

### Common Commands
```bash
npm test                           # Run all tests
npm run test:headed               # Run with visible browser
npm run test:ui                   # Interactive UI mode
npm run test:debug                # Debug mode
npm run test:int                  # Run against integration env
npm run test:staging              # Run against staging env
npm run test:api                  # Run only API tests
npm run report                    # View HTML report
```

### Common Assertions
```typescript
expect(element).toBeVisible()
expect(element).toHaveText('text')
expect(page).toHaveURL('url')
expect(page).toHaveTitle('title')
expect(response.ok()).toBeTruthy()
expect(body).toMatchObject({})
```

### Useful Methods
```typescript
// Navigation
page.goto('/path')

// Interaction
element.click()
input.fill('text')
button.press('Enter')

// Waiting
page.waitForResponse(filter)
page.waitForLoadState('networkidle')

// Assertion
expect(element).toBeVisible()
```

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-page)

---

**Happy Testing! 🚀**
