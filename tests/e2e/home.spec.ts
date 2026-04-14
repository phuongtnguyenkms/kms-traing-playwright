import { test, expect } from '../../fixtures/test.fixture';
import { testData } from '../../utils/test-data';

test('navigate to docs from homepage', async ({ homePage, page }) => {
  await homePage.goto();
  await homePage.verifyLoaded();

  await homePage.getStartedLink.click();
  await expect(page.getByRole('heading', { name: testData.expectedDocHeading })).toBeVisible();
});
