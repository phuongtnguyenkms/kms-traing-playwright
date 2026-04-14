import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly enterPasswordButton: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Email address or username' });
    this.enterPasswordButton = page.getByRole('button', { name: 'Enter password' });
    this.passwordInput = page.getByRole('textbox', { name: /Password/i });
    // The Sign In submit button is scoped inside the Login form to avoid matching the nav button
    this.submitButton = page.getByLabel('Login').getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.getByText('Invalid login credentials.');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cs/');
    await this.page.waitForLoadState('networkidle');

    // Accept cookies banner if present
    const cookieButton = this.page.getByRole('button', { name: 'Accept all cookies' });
    if (await cookieButton.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await cookieButton.click();
      await this.page.waitForLoadState('networkidle');
    }

    // Sign In can render as a button (in cookie banner) or a custom nav element;
    // use text content matching which works regardless of underlying HTML role.
    await this.page.getByText('Sign In', { exact: true }).first().click();
    // Wait until the form is ready before returning
    await expect(this.usernameInput).toBeVisible({ timeout: 15_000 });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.enterPasswordButton.click();
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async verifyLoginSuccess(): Promise<void> {
    // Login form closes on success
    await expect(this.submitButton).not.toBeVisible({ timeout: 15_000 });
  }

  async verifyLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }
}
