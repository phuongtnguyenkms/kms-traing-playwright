import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly getStartedLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Playwright/);
  }
}
