import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
    // Skip mobile tests in this file - they're covered in responsive.spec.ts
    test.skip(({ isMobile }) => isMobile, "Skip on mobile - see responsive.spec.ts");

    test("should load the dashboard by default", async ({ page }) => {
        await page.goto("/");

        // Check that the navbar is visible
        await expect(page.locator("text=Bikini Bottom Portal")).toBeVisible();

        // Check that sidebar brand is visible
        await expect(page.locator("text=🍔 Krusty Krab")).toBeVisible();
    });

    test("should navigate to Residents page", async ({ page }) => {
        await page.goto("/");

        // Click on Residents link in sidebar
        await page.click('a[href="/residents"]');

        // Verify URL changed
        await expect(page).toHaveURL("/residents");
    });

    test("should navigate to Menu page", async ({ page }) => {
        await page.goto("/");

        await page.click('a[href="/menu"]');

        await expect(page).toHaveURL("/menu");
    });

    test("should navigate to Tasks page", async ({ page }) => {
        await page.goto("/");

        await page.click('a[href="/tasks"]');

        await expect(page).toHaveURL("/tasks");
    });

    test("should navigate to Favorites page", async ({ page }) => {
        await page.goto("/");

        await page.click('a[href="/favorites"]');

        await expect(page).toHaveURL("/favorites");
    });

    test("should navigate to Settings page", async ({ page }) => {
        await page.goto("/");

        await page.click('a[href="/settings"]');

        await expect(page).toHaveURL("/settings");
    });

    test("should navigate back to Dashboard when clicking logo", async ({
        page,
    }) => {
        await page.goto("/settings");

        // Click on the Krusty Krab logo to go back to dashboard
        await page.click("text=🍔 Krusty Krab");

        await expect(page).toHaveURL("/");
    });

    test("should highlight active navigation item", async ({ page }) => {
        await page.goto("/tasks");

        // The active link should have the primary background class
        const tasksLink = page.locator('a[href="/tasks"]');
        await expect(tasksLink).toHaveClass(/bg-primary/);
    });
});
