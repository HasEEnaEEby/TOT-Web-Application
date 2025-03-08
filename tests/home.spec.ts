import { expect, test } from '@playwright/test';

test('Home Page should load and display key elements', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // ✅ Ensure the page is fully loaded
  await page.waitForLoadState('domcontentloaded');

  // ✅ Ensure the correct heading is visible with extended timeout
  await expect(page.getByRole('heading', { name: /Order Food with/i }))
    .toBeVisible({ timeout: 10000 });

  // ✅ Check if "Start Ordering" button is visible and enabled
  await expect(page.getByRole('button', { name: 'Start Ordering' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start Ordering' })).toBeEnabled();

  // ✅ Ensure "View Restaurants" button is visible
  await expect(page.getByRole('button', { name: 'View Restaurants' })).toBeVisible();

  // ✅ Ensure "Sign In" button is visible
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

  // ✅ Ensure "Guest Mode" button is visible
  await expect(page.getByRole('button', { name: 'Guest Mode' })).toBeVisible();

  // ✅ Take a screenshot for debugging
  await page.screenshot({ path: 'tests/screenshots/home.png', fullPage: true });
});
