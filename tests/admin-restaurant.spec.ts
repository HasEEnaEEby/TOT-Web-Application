import { expect, test } from '@playwright/test';

test('Admin Login - Should Navigate to Dashboard and then Restaurant Management', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    console.log('✅ Navigated to Admin Login Page');

    // ✅ Ensure input fields are visible
    const emailInput = page.locator("input[placeholder='your@email.com']");
    const passwordInput = page.locator("input[placeholder='••••••••']");
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    console.log('✅ Email & Password fields are visible');

    // ✅ Fill in correct email and password
    await emailInput.fill("poojapurbey469@gmail.com");
    await passwordInput.fill("Haseenakc123");
    console.log('✍️ Entered valid credentials');

    // ✅ Click login button
    await page.getByRole('button', { name: "Let's Go!" }).click();
    console.log('🚀 Clicked "Let\'s Go!" button');

    // ✅ Wait for navigation to dashboard
    await page.waitForURL('http://localhost:3000/admin');
    console.log('✅ Navigated to Admin Dashboard');

    // ✅ Verify Dashboard UI
    await expect(page.locator('text=Welcome back, Admin')).toBeVisible();
    console.log('✅ Confirmed: Dashboard is visible');

    // ✅ Click on "Restaurant Management" from sidebar
    await page.getByRole('link', { name: "Restaurant Management" }).click();
    console.log('🍽 Clicked "Restaurant Management"');

    // ✅ Wait for the URL to change to /admin/restaurants
    await page.waitForURL('http://localhost:3000/admin/restaurants');
    console.log('✅ Navigated to Restaurant Management');

    // ✅ Verify the restaurant table appears (FIXED)
    await expect(page.getByRole('heading', { name: 'Restaurant Management' })).toBeVisible();
    console.log('✅ Confirmed: Restaurant Management table is visible');

    // ✅ Take a screenshot for debugging
    await page.screenshot({ path: 'tests/screenshots/admin-restaurant-management.png', fullPage: true });
});
