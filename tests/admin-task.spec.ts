// import { expect, test } from '@playwright/test';

// test('Admin Login - Navigate to Dashboard and Create a New Task', async ({ page }) => {
//     // ✅ Step 1: Login to Admin Panel
//     await page.goto('http://localhost:3000/admin/login');
//     console.log('✅ Navigated to Admin Login Page');

//     // ✅ Ensure input fields exist
//     const emailInput = page.locator("input[placeholder='your@email.com']");
//     const passwordInput = page.locator("input[placeholder='••••••••']");
//     await expect(emailInput).toBeVisible();
//     await expect(passwordInput).toBeVisible();
//     console.log('✅ Email & Password fields are visible');

//     // ✅ Fill in valid admin credentials
//     await emailInput.fill("poojapurbey469@gmail.com");
//     await passwordInput.fill("Haseenakc123");
//     console.log('✍️ Entered valid email and password');

//     // ✅ Click login button
//     await page.getByRole('button', { name: "Let's Go!" }).click();
//     console.log('🚀 Clicked "Let\'s Go!" button');

//     // ✅ Wait for navigation to dashboard
//     await page.waitForURL('http://localhost:3000/admin/dashboard', { timeout: 5000 });
//     console.log('✅ Successfully navigated to Admin Dashboard');

//     // ✅ Step 2: Navigate to Tasks Page
//     const taskButton = page.getByRole('link', { name: 'Tasks' });
//     await expect(taskButton).toBeVisible();
//     await taskButton.click();
//     console.log('✅ Clicked "Tasks" button in Sidebar');

//     await page.waitForURL('http://localhost:3000/admin/tasks', { timeout: 5000 });
//     console.log('✅ Navigated to Tasks Management Page');

//     // ✅ Step 3: Click "Create Task"
//     const createTaskButton = page.getByRole('button', { name: 'Create Task' });
//     await expect(createTaskButton).toBeVisible();
//     await createTaskButton.click();
//     console.log('✅ Clicked "Create Task" button');

//     // ✅ Step 4: Wait for the popup and fill in the form
//     const taskDialog = page.getByRole('dialog', { name: 'Create New Task' });
//     await expect(taskDialog).toBeVisible();
//     console.log('✅ "Create New Task" popup appeared');

//     const taskTitle = page.getByPlaceholder('Enter task title');
//     const taskDescription = page.locator('textarea');
//     const priorityDropdown = page.locator('[aria-label="Select Priority"]'); // Updated selector for ShadCN
//     const categoryDropdown = page.locator('[aria-label="Select Type"]'); // Updated selector for category
//     const dueDateInput = page.getByPlaceholder('yyyy/mm/dd');

//     await taskTitle.fill('Meeting with Investors');
//     console.log('✍️ Entered Task Title');

//     await taskDescription.fill('Discuss investment strategies and growth plans for TOT Application.');
//     console.log('✍️ Entered Task Description');

//     // ✅ Step 5: Select High → Low → Medium in Priority Dropdown
//     await priorityDropdown.click();
//     await page.locator('text=High').click();
//     console.log('✅ Selected Task Priority: High');

//     await priorityDropdown.click();
//     await page.locator('text=Low').click();
//     console.log('✅ Selected Task Priority: Low');

//     await priorityDropdown.click();
//     await page.locator('text=Medium').click();
//     console.log('✅ Selected Task Priority: Medium');

//     // ✅ Step 6: Select Category (Approval)
//     await categoryDropdown.click();
//     await page.locator('text=Approval').click();
//     console.log('✅ Selected Task Category: Approval');

//     // ✅ Step 7: Select Due Date
//     await dueDateInput.fill('2025/03/27');
//     console.log('📅 Entered Due Date');

//     // ✅ Step 8: Click "Create Task" button
//     const submitButton = page.getByRole('button', { name: 'Create Task' });
//     await submitButton.click();
//     console.log('🚀 Clicked "Create Task" button');

//     // ✅ Step 9: Verify Task is Created
//     await page.waitForTimeout(2000);
//     const newTask = page.locator('text=Meeting with Investors');
//     await expect(newTask).toBeVisible();
//     console.log('✅ Confirmed: Task "Meeting with Investors" is visible in Task List');

//     // ✅ Take a screenshot for debugging
//     await page.screenshot({ path: 'tests/screenshots/task-created.png', fullPage: true });
// });
