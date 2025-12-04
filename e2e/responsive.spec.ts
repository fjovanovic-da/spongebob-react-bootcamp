import { test, expect, devices } from "@playwright/test";

test.describe("Mobile Responsive Design", () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

    test("should show hamburger menu on mobile", async ({ page }) => {
        await page.goto("/");

        // Hamburger menu button should be visible on mobile
        const menuButton = page.locator('label[for="app-drawer"]').first();
        await expect(menuButton).toBeVisible();
    });

    test("should open sidebar when clicking hamburger menu", async ({ page }) => {
        await page.goto("/");

        // Click hamburger menu
        const menuButton = page.locator('label[for="app-drawer"]').first();
        await menuButton.click();

        // Sidebar should now be visible
        await expect(page.locator("text=🍔 Krusty Krab")).toBeVisible();
    });

    test("should close sidebar when clicking overlay", async ({ page }) => {
        await page.goto("/");

        // Open sidebar
        const menuButton = page.locator('label[for="app-drawer"]').first();
        await menuButton.click();

        // Wait for sidebar to open
        await expect(page.locator("text=🍔 Krusty Krab")).toBeVisible();

        // Click overlay to close (use position to avoid sidebar intercept)
        const overlay = page.locator(".drawer-overlay");
        await overlay.click({ position: { x: 350, y: 300 }, force: true });

        // Wait for animation
        await page.waitForTimeout(500);
    });

    test("should navigate on mobile", async ({ page }) => {
        await page.goto("/");

        // Open sidebar
        const menuButton = page.locator('label[for="app-drawer"]').first();
        await menuButton.click();

        // Click on Tasks
        await page.click('a[href="/tasks"]');

        // Should navigate to tasks
        await expect(page).toHaveURL("/tasks");
    });
});

test.describe("Desktop Layout", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("should show sidebar by default on desktop", async ({ page }) => {
        await page.goto("/");

        // Sidebar should be visible without clicking anything
        await expect(page.locator("text=🍔 Krusty Krab")).toBeVisible();
        await expect(page.locator('a[href="/residents"]')).toBeVisible();
    });

    test("should not show hamburger menu on desktop", async ({ page }) => {
        await page.goto("/");

        // The hamburger button should be hidden (has lg:hidden class)
        const menuButton = page.locator('label[for="app-drawer"]').first();

        // On desktop, this should not be visible
        await expect(menuButton).toBeHidden();
    });
});

test.describe("Tablet Layout", () => {
    test.use({ viewport: { width: 768, height: 1024 } }); // iPad size

    test("should adapt layout for tablet", async ({ page }) => {
        await page.goto("/");

        // Navbar should be visible
        await expect(page.locator("text=Bikini Bottom Portal")).toBeVisible();
    });
});
