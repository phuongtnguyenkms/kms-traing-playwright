import { test, expect } from '@playwright/test';
import { env } from '../../config/env';

test.describe('Posts API', () => {
  test('GET /posts/1 returns a post payload', async ({ request }) => {
    const response = await request.get(`${env.apiBaseUrl}/posts/1`);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toMatchObject({
      id: 1,
      userId: 1,
    });
    expect(typeof body.title).toBe('string');
  });
});
