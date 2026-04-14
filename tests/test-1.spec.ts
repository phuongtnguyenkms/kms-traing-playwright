import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://evolvetest.elsevier.com/cs/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Cookie Policy, opens in a new' }).click();
  const page1 = await page1Promise;
  await page.getByRole('button', { name: 'Accept all cookies' }).click();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Email address or username' }).click();
  await page.getByRole('textbox', { name: 'Email address or username' }).fill('binstructors');
  await page.getByRole('textbox', { name: 'Email address or username' }).press('Tab');
  await page.getByRole('button', { name: 'Enter password' }).click();
  await page.getByRole('textbox', { name: 'Password Show password' }).fill('Hesi12345');
  await page.getByLabel('Login').getByRole('button', { name: 'Sign In' }).click();
});