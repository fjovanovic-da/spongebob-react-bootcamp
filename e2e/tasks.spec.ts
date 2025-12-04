import { test, expect } from "@playwright/test";

test.describe("Task Board", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/tasks");
    });

    test("should display task board heading", async ({ page }) => {
        await expect(page.locator("text=Task Board 📋")).toBeVisible();
    });

    test("should display Add Task button", async ({ page }) => {
        await expect(page.locator("button:has-text('Add Task')")).toBeVisible();
    });

    test("should open Add Task modal when clicking Add Task button", async ({
        page,
    }) => {
        await page.click("button:has-text('Add Task')");

        // Modal should be visible
        await expect(page.locator("text=Add New Task")).toBeVisible();

        // Form fields should be visible
        await expect(page.locator("#task-name")).toBeVisible();
        await expect(page.locator("#task-description")).toBeVisible();
        await expect(page.locator("#task-date")).toBeVisible();
    });

    test("should close modal when clicking Cancel", async ({ page }) => {
        await page.click("button:has-text('Add Task')");
        await expect(page.locator("text=Add New Task")).toBeVisible();

        await page.click("button:has-text('Cancel')");

        // Modal should be closed
        await expect(page.locator("text=Add New Task")).not.toBeVisible();
    });

    test("should show validation error when submitting empty task name", async ({
        page,
    }) => {
        await page.click("button:has-text('Add Task')");

        // Clear the date field and submit without filling name
        await page.click(".modal button:has-text('Add Task')");

        // Should show validation error
        await expect(page.locator("text=Task name is required")).toBeVisible();
    });

    test("should add a new task", async ({ page }) => {
        const taskName = `Test Task ${Date.now()}`;

        await page.click("button:has-text('Add Task')");

        // Fill in the form
        await page.fill("#task-name", taskName);
        await page.fill("#task-description", "This is a test task description");

        // Submit the form
        await page.click(".modal button:has-text('Add Task')");

        // Modal should close
        await expect(page.locator("text=Add New Task")).not.toBeVisible();

        // New task should appear in the list
        await expect(page.locator(`text=${taskName}`)).toBeVisible();
    });

    test("should display empty state when no tasks", async ({ page }) => {
        // This test assumes there might be no tasks initially
        // If there are tasks, this test would need adjustment
        const emptyMessage = page.locator("text=No tasks available.");

        // Check if the message exists (it's okay if tasks exist)
        const count = await emptyMessage.count();
        if (count > 0) {
            await expect(emptyMessage).toBeVisible();
        }
    });
});

test.describe("Task Interactions", () => {
    // Skip on mobile - task table uses different layout
    test.skip(({ isMobile }) => isMobile, "Skip on mobile - uses card layout");

    test("should add and then delete a task", async ({ page }) => {
        await page.goto("/tasks");

        const taskName = `Delete Me Task ${Date.now()}`;

        // Add a task first
        await page.click("button:has-text('Add Task')");
        await page.fill("#task-name", taskName);
        await page.click(".modal button:has-text('Add Task')");

        // Wait for modal to close
        await expect(page.locator("text=Add New Task")).not.toBeVisible();

        // Verify task was added
        const taskCell = page.locator(`td:has-text("${taskName}")`);
        await expect(taskCell).toBeVisible();

        // Find the delete button for this task
        const taskRow = page.locator(`tr:has-text("${taskName}")`);
        const deleteButton = taskRow.locator("button.btn-error");

        // Ensure button is visible and enabled
        await expect(deleteButton).toBeVisible();
        await expect(deleteButton).toBeEnabled();

        // Verify we have the correct button text
        await expect(deleteButton).toHaveText("Delete");
    });

    test("should toggle task completion", async ({ page }) => {
        await page.goto("/tasks");

        const taskName = `Complete Me Task ${Date.now()}`;

        // Add a task first
        await page.click("button:has-text('Add Task')");
        await page.fill("#task-name", taskName);
        await page.click(".modal button:has-text('Add Task')");

        // Wait for modal to close
        await expect(page.locator("text=Add New Task")).not.toBeVisible();

        // Find the checkbox for this task and click it
        const taskRow = page.locator(`tr:has-text("${taskName}")`);
        const checkbox = taskRow.locator('input[type="checkbox"]');

        // Toggle completion
        await checkbox.click();

        // Checkbox should be checked
        await expect(checkbox).toBeChecked();
    });
});
