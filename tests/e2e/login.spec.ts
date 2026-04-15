import { test, expect } from '../../fixtures/test.fixture';
import { env } from '../../config/env';

test.describe('Login Page', () => {
  const hasCredentials = Boolean(env.loginUsername && env.loginPassword);

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('recorded sign in flow on evolve site', async ({ loginPage }) => {
    test.skip(!hasCredentials, 'Set LOGIN_USERNAME and LOGIN_PASSWORD in .env.local');
    // beforeEach already navigated and opened the sign-in form
    await loginPage.login(env.loginUsername, env.loginPassword);
    await loginPage.verifyLoginSuccess();
  });

  test('should login successfully with valid credentials', async ({ loginPage }) => {
    test.skip(!hasCredentials, 'Set LOGIN_USERNAME and LOGIN_PASSWORD in .env.local');
    await loginPage.login(env.loginUsername, env.loginPassword);
    await loginPage.verifyLoginSuccess();
  });

  test('should show error with invalid username', async ({ loginPage }) => {
    await loginPage.login('invaliduser', 'wrongpassword');
    await loginPage.verifyLoginError();
  });

  test('should show error with invalid password', async ({ loginPage }) => {
    await loginPage.login('binstructors', 'wrongpassword');
    await loginPage.verifyLoginError();
  });

  test('should display login form elements', async ({ loginPage }) => {
    // After goto(), step 1 is visible: username field and Enter password button
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.enterPasswordButton).toBeVisible();
  });
});
