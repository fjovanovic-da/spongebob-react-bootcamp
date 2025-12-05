import { test, expect } from "@playwright/test";

test.describe("Theme Settings", () => {
    test("should display settings page", async ({ page }) => {
        await page.goto("/settings");

        await expect(page.locator("text=⚙️ Settings")).toBeVisible();
        await expect(page.locator("text=Appearance")).toBeVisible();
    });

    test("should display theme toggle", async ({ page }) => {
        await page.goto("/settings");

        const themeToggle = page.locator('input[type="checkbox"].theme-controller');
        await expect(themeToggle).toBeVisible();
    });

    test("should toggle theme when clicking the toggle", async ({ page }) => {
        await page.goto("/settings");

        // Use the label wrapper to click the toggle instead of the input directly
        const themeLabel = page.locator("label.toggle");
        const html = page.locator("html");

        // Get initial theme
        const initialTheme = await html.getAttribute("data-theme");

        // Click the label wrapper with force to bypass overlay
        await themeLabel.click({ force: true });

        // Theme should have changed
        const newTheme = await html.getAttribute("data-theme");
        expect(newTheme).not.toBe(initialTheme);
    });

    test("should persist theme across navigation", async ({ page, isMobile }) => {
        // Skip on mobile due to sidebar visibility
        test.skip(isMobile, "Skip on mobile - sidebar not visible");

        await page.goto("/settings");

        const themeLabel = page.locator("label.toggle");
        const html = page.locator("html");

        // Get initial theme
        const initialTheme = await html.getAttribute("data-theme");

        // Toggle theme
        await themeLabel.click({ force: true });
        const newTheme = await html.getAttribute("data-theme");

        // Navigate away
        await page.click('a[href="/tasks"]');
        await expect(page).toHaveURL("/tasks");

        // Come back to settings
        await page.click('a[href="/settings"]');

        // Theme should still be the new theme
        const currentTheme = await html.getAttribute("data-theme");
        expect(currentTheme).toBe(newTheme);
    });

    test("should show correct theme label", async ({ page }) => {
        await page.goto("/settings");

        const themeToggle = page.locator('input[type="checkbox"].theme-controller');

        // Check if the label matches the current state
        const isChecked = await themeToggle.isChecked();

        if (isChecked) {
            await expect(page.locator("text=Dark (Aqua)")).toBeVisible();
        } else {
            await expect(page.locator("text=Light (Cupcake)")).toBeVisible();
        }
    });
});
