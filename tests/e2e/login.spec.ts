import { test, expect } from '../../fixtures/test.fixture';

test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('recorded sign in flow on evolve site', async ({ loginPage }) => {
    // beforeEach already navigated and opened the sign-in form
    await loginPage.login('binstructors', 'Hesi12345');
    await loginPage.verifyLoginSuccess();
  });

  test('should login successfully with valid credentials', async ({ loginPage }) => {
    await loginPage.login('binstructors', 'Hesi12345');
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
