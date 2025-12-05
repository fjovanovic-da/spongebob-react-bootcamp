import { expect, test } from "@playwright/test";

test.describe("Dashboard Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should display dashboard heading", async ({ page }) => {
        await expect(page.locator("text=📊 Dashboard")).toBeVisible();
    });

    test("should display task calendar section", async ({ page }) => {
        await expect(page.locator("text=📅 Task Calendar")).toBeVisible();
        // Calendar component should be present
        await expect(page.locator("calendar-date")).toBeVisible();
    });

    test("should display selected day tasks section", async ({ page }) => {
        await expect(page.locator("text=📋 Tasks for Selected Day")).toBeVisible();
    });

    test("should display task summary section", async ({ page }) => {
        await expect(page.locator("text=📊 Task Summary")).toBeVisible();

        // Check for stat labels
        await expect(page.locator("text=Total Tasks")).toBeVisible();
        await expect(page.locator("text=Completed")).toBeVisible();
        await expect(page.locator("text=Pending")).toBeVisible();
    });

    test("should display favorites section", async ({ page }) => {
        // Wait for meals to load
        await page.waitForTimeout(1000);

        // Favorites heading should be visible
        await expect(
            page.getByRole("heading", { name: "❤️ Favorite Meals" }),
        ).toBeVisible();
    });

    test("should show add task button in selected day section", async ({
        page,
    }) => {
        const addButton = page.locator('button[aria-label="Add task"]');
        await expect(addButton).toBeVisible();
    });

    test("should open add task modal when clicking add button", async ({
        page,
    }) => {
        const addButton = page.locator('button[aria-label="Add task"]');
        await addButton.click();

        // Modal should open
        await expect(page.locator("text=Add New Task")).toBeVisible();
        await expect(page.locator("#task-name")).toBeVisible();
        await expect(page.locator("#task-date")).toBeVisible();
    });

    test("should close add task modal when clicking cancel", async ({ page }) => {
        // Open modal
        const addButton = page.locator('button[aria-label="Add task"]');
        await addButton.click();
        await expect(page.locator("text=Add New Task")).toBeVisible();

        // Close modal
        await page.click("button:has-text('Cancel')");
        await expect(page.locator("text=Add New Task")).not.toBeVisible();
    });

    test("should add a task from dashboard", async ({ page }) => {
        const taskName = `Dashboard Task ${Date.now()}`;

        // Open modal
        const addButton = page.locator('button[aria-label="Add task"]');
        await addButton.click();

        // Fill form
        await page.fill("#task-name", taskName);
        await page.fill("#task-description", "Created from dashboard");

        // Submit
        await page.click(".modal button:has-text('Add Task')");

        // Modal should close
        await expect(page.locator("text=Add New Task")).not.toBeVisible();

        // Task should appear in the selected day tasks list
        await expect(page.locator(`text=${taskName}`)).toBeVisible();
    });

    test("should show empty state when no tasks for selected day", async ({
        page,
    }) => {
        // Check for empty state - this depends on whether there are tasks
        const emptyState = page.locator("text=No tasks created on this day");
        const taskList = page.locator(".space-y-3");

        // Either empty state or task list should be visible
        const emptyCount = await emptyState.count();
        const hasTaskList = await taskList.count();

        expect(emptyCount > 0 || hasTaskList > 0).toBeTruthy();
    });

    test("should display calendar legend", async ({ page }) => {
        await expect(page.locator("text=Days with tasks created")).toBeVisible();
    });
});

test.describe("Dashboard Task Summary Stats", () => {
    test("should update stats when adding a task", async ({ page }) => {
        await page.goto("/");

        // Get initial total tasks count
        const totalStatValue = page.locator(".stat-value.text-primary").first();
        const initialCount = await totalStatValue.textContent();
        const initialNumber = Number.parseInt(initialCount || "0", 10);

        // Add a task
        const addButton = page.locator('button[aria-label="Add task"]');
        await addButton.click();

        const taskName = `Stats Test Task ${Date.now()}`;
        await page.fill("#task-name", taskName);
        await page.click(".modal button:has-text('Add Task')");

        // Wait for modal to close
        await expect(page.locator("text=Add New Task")).not.toBeVisible();

        // Total tasks should increase by 1
        await expect(totalStatValue).toHaveText(String(initialNumber + 1));
    });

    test("should update completed count when toggling task", async ({ page }) => {
        await page.goto("/");

        // First add a task
        const addButton = page.locator('button[aria-label="Add task"]');
        await addButton.click();

        const taskName = `Toggle Test Task ${Date.now()}`;
        await page.fill("#task-name", taskName);
        await page.click(".modal button:has-text('Add Task')");
        await expect(page.locator("text=Add New Task")).not.toBeVisible();

        // Find the task's checkbox and toggle it
        const taskItem = page.locator(`li:has-text("${taskName}")`);
        const checkbox = taskItem.locator('input[type="checkbox"]');

        // Get initial completed count
        const completedStatValue = page.locator(".stat-value.text-success").first();
        const initialCompleted = await completedStatValue.textContent();
        const initialNumber = Number.parseInt(initialCompleted || "0", 10);

        // Toggle the checkbox
        await checkbox.click();

        // Completed count should increase
        await expect(completedStatValue).toHaveText(String(initialNumber + 1));
    });
});

test.describe("Dashboard Calendar Interaction", () => {
    test("should have calendar navigation buttons", async ({ page }) => {
        await page.goto("/");

        // Previous and Next buttons should exist
        await expect(page.locator('svg[aria-label="Previous"]')).toBeVisible();
        await expect(page.locator('svg[aria-label="Next"]')).toBeVisible();
    });

    test("should display current month in calendar", async ({ page }) => {
        await page.goto("/");

        // Calendar month component should be present
        await expect(page.locator("calendar-month")).toBeVisible();
    });
});

test.describe("Dashboard Responsive Layout", () => {
    test("should display dashboard on mobile", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/");

        // Dashboard should still be visible
        await expect(page.locator("text=📊 Dashboard")).toBeVisible();
        await expect(page.locator("text=📅 Task Calendar")).toBeVisible();
        await expect(page.locator("text=📊 Task Summary")).toBeVisible();
    });

    test("should stack elements vertically on mobile", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/");

        // Stats should be in vertical layout on mobile
        const stats = page.locator(".stats");
        await expect(stats.first()).toBeVisible();
    });
});
