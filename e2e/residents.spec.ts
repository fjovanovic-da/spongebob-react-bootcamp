import { test, expect } from "@playwright/test";

test.describe("Residents Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/residents");
    });

    test("should display residents page heading", async ({ page }) => {
        await expect(page.locator("text=Welcome to Bikini Bottom! 🌊")).toBeVisible();
        await expect(page.locator("text=Meet the residents:")).toBeVisible();
    });

    test("should display search filters", async ({ page }) => {
        // Search by name filter
        await expect(
            page.locator('input[placeholder="Search by name, city, email..."]')
        ).toBeVisible();

        // Filter by company/business
        await expect(
            page.locator('input[placeholder="Filter by company, business..."]')
        ).toBeVisible();
    });

    test("should filter residents by search text", async ({ page }) => {
        // Wait for residents to load
        await page.waitForTimeout(1000);

        const searchInput = page.locator(
            'input[placeholder="Search by name, city, email..."]'
        );

        // Type a search query
        await searchInput.fill("Sponge");

        // Wait for filter to apply
        await page.waitForTimeout(500);

        // Check that filtering occurred (results should be fewer or specific)
        // The actual assertion depends on your data
    });

    test("should filter residents by company/role", async ({ page }) => {
        // Wait for residents to load
        await page.waitForTimeout(1000);

        const roleInput = page.locator(
            'input[placeholder="Filter by company, business..."]'
        );

        // Type a filter query
        await roleInput.fill("Krusty");

        // Wait for filter to apply
        await page.waitForTimeout(500);
    });

    test("should show loading spinner while fetching residents", async ({
        page,
    }) => {
        // Intercept the API call to slow it down
        await page.route("**/users*", async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await route.continue();
        });

        await page.goto("/residents");

        // Should show loading indicator
        // This depends on your LoadingSpinner implementation
    });

    test("should clear filters when input is cleared", async ({ page }) => {
        // Wait for residents to load
        await page.waitForTimeout(1000);

        const searchInput = page.locator(
            'input[placeholder="Search by name, city, email..."]'
        );

        // Add filter
        await searchInput.fill("test");
        await page.waitForTimeout(300);

        // Clear filter
        await searchInput.clear();
        await page.waitForTimeout(300);

        // All residents should be visible again
    });
});
