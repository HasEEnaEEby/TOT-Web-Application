import { expect, test } from '@playwright/test';

test('Login Page should load and display key elements', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  // ✅ Ensure correct heading is visible
  await expect(page.getByRole('heading', { name: 'Welcome Back, Foodie!' })).toBeVisible();

  // ✅ Ensure role selection buttons are visible
  await expect(page.getByRole('button', { name: 'Customer' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Restaurant' })).toBeVisible();

  // ✅ Ensure email and password input fields are visible
  await expect(page.locator("input[type='email']")).toBeVisible();
  await expect(page.locator("input[type='password']")).toBeVisible();

  // ✅ Ensure login button is visible and enabled
  await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Log In' })).toBeEnabled();

  // ✅ Ensure "Forgot Password" link is visible
  await expect(page.locator('text=Forgot your password?')).toBeVisible();

  // ✅ Ensure "Sign Up" link is visible
  await expect(page.locator('text=Sign up')).toBeVisible();

  // ✅ Take a screenshot for debugging
  await page.screenshot({ path: 'tests/screenshots/login.png', fullPage: true });
});





test('Sign-Up Page should load and display key elements', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
  
    // ✅ Ensure the correct heading is visible
    await expect(page.getByRole('heading', { name: 'Join TOT' })).toBeVisible();
  
    // ✅ Ensure role selection buttons are visible
    await expect(page.getByRole('button', { name: 'Customer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Restaurant' })).toBeVisible();
  
    // ✅ Ensure username, email, and password input fields are visible
    await expect(page.locator("input[placeholder='Choose a unique username']")).toBeVisible();
    await expect(page.locator("input[placeholder='Enter your email']")).toBeVisible();
    await expect(page.locator("input[placeholder='Create a strong password']")).toBeVisible();
    await expect(page.locator("input[placeholder='Repeat your password']")).toBeVisible();
  
    // ✅ Ensure "Create Account" button is visible and enabled
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeEnabled();
  
    // ✅ Ensure "Sign In" link is visible
    await expect(page.locator('text=Sign In')).toBeVisible();
  
    // ✅ Take a screenshot for debugging
    await page.screenshot({ path: 'tests/screenshots/signup.png', fullPage: true });
  });
