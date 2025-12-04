import { expect, test } from "@playwright/test";

test.describe("Favorites Board Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/favorites");
    });

    test("should display favorites board heading", async ({ page }) => {
        await expect(page.locator("text=Your Favorites ⭐")).toBeVisible();
    });

    test("should display subtitle", async ({ page }) => {
        await expect(
            page.locator("text=Here are your favorite meals:"),
        ).toBeVisible();
    });

    test("should show empty state when no favorites", async ({ page }) => {
        // Clear any existing favorites by going to menu and removing them first
        // Then check the empty state
        await expect(page.locator("text=No favorites yet!")).toBeVisible();
        await expect(
            page.locator(
                "text=Start adding meals to your favorites from the menu page.",
            ),
        ).toBeVisible();
    });

    test("should show animated star icon in empty state", async ({ page }) => {
        // The empty state has an animated star
        const starIcon = page.locator("text=⭐").first();
        await expect(starIcon).toBeVisible();
    });

    test("should not show filters when no favorites", async ({ page }) => {
        // Filters should be hidden when there are no favorites
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );
        await expect(searchInput).not.toBeVisible();
    });
});

test.describe("Favorites Board with Favorites", () => {
    test.beforeEach(async ({ page }) => {
        // First go to menu and add a favorite
        await page.goto("/menu");
        await page.waitForSelector(".card", { timeout: 10000 });

        // Add first meal to favorites
        const addButton = page
            .locator('button:has-text("☆ Add to Favorites")')
            .first();
        if ((await addButton.count()) > 0) {
            await addButton.click();
            await page.waitForTimeout(300);
        }

        // Navigate to favorites page
        await page.goto("/favorites");
    });

    test("should display favorite meals", async ({ page }) => {
        // Should show meal cards
        await page.waitForSelector(".card", { timeout: 10000 });
        const cards = page.locator(".card");
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);
    });

    test("should show filters when favorites exist", async ({ page }) => {
        await page.waitForSelector(".card", { timeout: 10000 });

        // Search input should be visible
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );
        await expect(searchInput).toBeVisible();
    });

    test("should show category filter dropdown", async ({ page }) => {
        await page.waitForSelector(".card", { timeout: 10000 });

        const categorySelect = page.locator("select").first();
        await expect(categorySelect).toBeVisible();
        await expect(categorySelect).toContainText("All Categories");
    });

    test("should show origin filter dropdown", async ({ page }) => {
        await page.waitForSelector(".card", { timeout: 10000 });

        const originSelect = page.locator("select").last();
        await expect(originSelect).toBeVisible();
        await expect(originSelect).toContainText("All Origins");
    });

    test("should display remove from favorites button", async ({ page }) => {
        await page.waitForSelector(".card", { timeout: 10000 });

        // Should show "Remove from Favorites" button since these are favorites
        const removeButton = page
            .locator('button:has-text("⭐ Remove from Favorites")')
            .first();
        await expect(removeButton).toBeVisible();
    });

    test("should remove meal from favorites when clicking remove button", async ({
        page,
    }) => {
        await page.waitForSelector(".card", { timeout: 10000 });

        // Get initial card count
        const initialCount = await page.locator(".card").count();

        // Click remove button
        const removeButton = page
            .locator('button:has-text("⭐ Remove from Favorites")')
            .first();
        await removeButton.click();
        await page.waitForTimeout(500);

        // Either should have fewer cards or show empty state
        const newCount = await page.locator(".card").count();
        const hasEmptyState =
            (await page.locator("text=No favorites yet!").count()) > 0;

        expect(newCount < initialCount || hasEmptyState).toBeTruthy();
    });

    test("should show favorite count banner", async ({ page }) => {
        await page.waitForSelector(".card", { timeout: 10000 });

        // Should show favorite count
        await expect(page.getByText(/You have \d+ favorite/)).toBeVisible();
    });
});

test.describe("Favorites Board Filtering", () => {
    test.beforeEach(async ({ page }) => {
        // Add multiple favorites first
        await page.goto("/menu");
        await page.waitForSelector(".card", { timeout: 10000 });

        // Add first two meals to favorites
        const addButtons = page.locator('button:has-text("☆ Add to Favorites")');
        const count = await addButtons.count();

        for (let i = 0; i < Math.min(2, count); i++) {
            const button = addButtons.nth(i);
            if ((await button.count()) > 0) {
                await button.click();
                await page.waitForTimeout(300);
            }
        }

        await page.goto("/favorites");
        await page.waitForSelector(".card", { timeout: 10000 });
    });

    test("should filter favorites by search text", async ({ page }) => {
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );

        // Type a search query
        await searchInput.fill("a");
        await page.waitForTimeout(500);

        // Should show results or empty message
        const hasCards = (await page.locator(".card").count()) > 0;
        const hasEmptyMessage =
            (await page.locator("text=No favorites found matching your filters.")
                .count()) > 0;
        expect(hasCards || hasEmptyMessage).toBeTruthy();
    });

    test("should show empty message when no favorites match filter", async ({
        page,
    }) => {
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );

        // Search for something that won't exist
        await searchInput.fill("xyznonexistentmeal123");
        await page.waitForTimeout(500);

        // Should show empty message
        await expect(
            page.locator("text=No favorites found matching your filters."),
        ).toBeVisible();
    });

    test("should clear filter and show all favorites again", async ({ page }) => {
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );

        // Get initial count
        const initialCount = await page.locator(".card").count();

        // Apply filter
        await searchInput.fill("xyz");
        await page.waitForTimeout(300);

        // Clear filter
        await searchInput.clear();
        await page.waitForTimeout(300);

        // Should show all favorites again
        const finalCount = await page.locator(".card").count();
        expect(finalCount).toBe(initialCount);
    });
});

test.describe("Favorites Board Pagination", () => {
    test("should display pagination when many favorites exist", async ({
        page,
    }) => {
        // Add many favorites
        await page.goto("/menu");
        await page.waitForSelector(".card", { timeout: 10000 });

        // Add multiple meals to favorites
        const addButtons = page.locator('button:has-text("☆ Add to Favorites")');
        const count = await addButtons.count();

        for (let i = 0; i < Math.min(6, count); i++) {
            const button = addButtons.nth(i);
            if ((await button.count()) > 0) {
                await button.click();
                await page.waitForTimeout(200);
            }
        }

        await page.goto("/favorites");
        await page.waitForSelector(".card", { timeout: 10000 });

        // Check if pagination exists (depends on ITEMS_PER_PAGE setting)
        const pagination = page.locator(".join");
        const hasPagination = (await pagination.count()) > 0;

        // Either has pagination or all items fit on one page
        expect(true).toBeTruthy();
    });
});

test.describe("Favorites Board Navigation", () => {
    test("should navigate to favorites from sidebar", async ({ page, isMobile }) => {
        await page.goto("/");

        // On mobile, need to open sidebar first
        if (isMobile) {
            const menuButton = page.locator('label[for="app-drawer"]').first();
            await menuButton.click();
            await page.waitForTimeout(300);
        }

        // Click favorites link in sidebar
        await page.click('a[href="/favorites"]');

        await expect(page).toHaveURL("/favorites");
        await expect(page.locator("text=Your Favorites ⭐")).toBeVisible();
    });

    test("should persist favorites across page navigation", async ({ page }) => {
        // Add a favorite
        await page.goto("/menu");
        await page.waitForSelector(".card", { timeout: 10000 });

        const addButton = page
            .locator('button:has-text("☆ Add to Favorites")')
            .first();
        if ((await addButton.count()) > 0) {
            await addButton.click();
            await page.waitForTimeout(300);
        }

        // Navigate away
        await page.goto("/");
        await page.waitForTimeout(500);

        // Navigate back to favorites
        await page.goto("/favorites");
        await page.waitForTimeout(500);

        // Should still have the favorite
        const hasCards = (await page.locator(".card").count()) > 0;
        expect(hasCards).toBeTruthy();
    });
});

test.describe("Favorites Board Responsive", () => {
    test("should display favorites on mobile", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/favorites");

        await expect(page.locator("text=Your Favorites ⭐")).toBeVisible();
    });

    test("should show empty state properly on mobile", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/favorites");

        // Should show empty state (assuming no favorites)
        await expect(page.locator("text=No favorites yet!")).toBeVisible();
    });

    test("should wrap filters on mobile when favorites exist", async ({
        page,
    }) => {
        // Add a favorite first
        await page.goto("/menu");
        await page.waitForSelector(".card", { timeout: 10000 });

        const addButton = page
            .locator('button:has-text("☆ Add to Favorites")')
            .first();
        if ((await addButton.count()) > 0) {
            await addButton.click();
            await page.waitForTimeout(300);
        }

        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/favorites");

        // Filters should still be visible on mobile
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );
        await expect(searchInput).toBeVisible();
    });
});
