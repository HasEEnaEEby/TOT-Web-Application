import { expect, test } from '@playwright/test';

// test('Admin Login Page should load and display key elements', async ({ page }) => {
//   await page.goto('http://localhost:3000/admin/login');

//   // ✅ Ensure the correct heading is visible
//   await expect(page.getByRole('heading', { name: 'Welcome to the TOT Family!' })).toBeVisible();

//   // ✅ Ensure email and password input fields are visible
//   await expect(page.locator("input[placeholder='your@email.com']")).toBeVisible();
//   await expect(page.locator("input[placeholder='••••••••']")).toBeVisible();

//   // ✅ Ensure "Let's Go!" button is visible and enabled
//   await expect(page.getByRole('button', { name: "Let's Go!" })).toBeVisible();
//   await expect(page.getByRole('button', { name: "Let's Go!" })).toBeEnabled();

//   // ✅ Ensure "Create your admin account!" link is visible
//   await expect(page.locator('text=Create your admin account!')).toBeVisible();

//   // ✅ Take a screenshot for debugging
//   await page.screenshot({ path: 'tests/screenshots/admin-login.png', fullPage: true });
// });



// test('Admin Login - Should NOT Navigate on Invalid Login', async ({ page }) => {
//     await page.goto('http://localhost:3000/admin/login');
//     console.log('✅ Navigated to Admin Login Page');
  
//     // ✅ Ensure input fields are visible
//     const emailInput = page.locator("input[placeholder='your@email.com']");
//     const passwordInput = page.locator("input[placeholder='••••••••']");
//     await expect(emailInput).toBeVisible();
//     await expect(passwordInput).toBeVisible();
//     console.log('✅ Email & Password fields are visible');
  
//     // ✅ Fill in invalid email and invalid password
//     await emailInput.fill("invalidemail@gmail.com");
//     await passwordInput.fill("WrongPass123!");
//     console.log('✍️ Entered invalid email and invalid password');
  
//     // ✅ Click login button
//     await page.getByRole('button', { name: "Let's Go!" }).click();
//     console.log('🚀 Clicked "Let\'s Go!" button');
  
//     // ✅ Wait for possible navigation or error message
//     await page.waitForTimeout(2000);
  
//     // ✅ Ensure the page URL remains on /admin/login
//     await expect(page).toHaveURL('http://localhost:3000/admin/login');
//     console.log('✅ Stayed on /admin/login as expected');
  
//     // ✅ Check if an error message is displayed
//     const errorMessage = page.locator('.error-message'); // Adjust selector as needed
//     await expect(errorMessage).toBeVisible();
//     console.log('✅ Error message is displayed');
  
//     // ✅ Ensure admin dashboard is NOT visible
//     const dashboardElement = page.locator('text=Admin Dashboard');
//     await expect(dashboardElement).not.toBeVisible();
//     console.log('✅ Confirmed: Admin Dashboard is NOT visible');
  
//     // ✅ Take a screenshot for debugging
//     await page.screenshot({ path: 'tests/screenshots/admin-login-invalid.png', fullPage: true });
// });



test('Admin Login - Should Navigate to Dashboard on Successful Login', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    console.log('✅ Navigated to Admin Login Page');
  
    // ✅ Ensure input fields exist
    const emailInput = page.locator("input[placeholder='your@email.com']");
    const passwordInput = page.locator("input[placeholder='••••••••']");
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    console.log('✅ Email & Password fields are visible');
  
    // ✅ Fill in valid admin credentials
    await emailInput.fill("poojapurbey469@gmail.com");
    await passwordInput.fill("Haseenakc123");
    console.log('✍️ Entered valid email and password');
  
    // ✅ Click login button
    await page.getByRole('button', { name: "Let's Go!" }).click();
    console.log('🚀 Clicked "Let\'s Go!" button');
  
    // ✅ Wait for navigation to dashboard
    await page.waitForURL('http://localhost:3000/admin/dashboard', { timeout: 5000 });
    console.log('✅ Successfully navigated to Admin Dashboard');
  
    // ✅ Check for success message
    const successMessage = page.locator('text=Login successful!');
    await expect(successMessage).toBeVisible();
    console.log('✅ Confirmed: Login success message is visible');
  
    // ✅ Ensure Admin Dashboard UI loads correctly
    await expect(page.locator('text=Welcome back, Admin')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Active Restaurants')).toBeVisible();
    await expect(page.locator('text=Total Orders')).toBeVisible();
    await expect(page.locator('text=Analytics Overview')).toBeVisible();
    console.log('✅ Confirmed: Dashboard elements are correctly displayed');
  
    // ✅ Take a screenshot for debugging
    await page.screenshot({ path: 'tests/screenshots/admin-login-success.png', fullPage: true });
  });