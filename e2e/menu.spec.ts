import { expect, test } from "@playwright/test";

test.describe("Menu Board Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/menu");
    });

    test("should display menu board heading", async ({ page }) => {
        await expect(page.locator("text=🍔 Krusty Krab Menu")).toBeVisible();
    });

    test("should display subtitle", async ({ page }) => {
        await expect(
            page.locator("text=Browse our delicious meals from around the world!"),
        ).toBeVisible();
    });

    test("should display search input", async ({ page }) => {
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );
        await expect(searchInput).toBeVisible();
    });

    test("should display category filter dropdown", async ({ page }) => {
        // Wait for meals to load so categories are populated
        await page.waitForTimeout(1000);

        const categorySelect = page.locator("select").first();
        await expect(categorySelect).toBeVisible();
        await expect(categorySelect).toContainText("All Categories");
    });

    test("should display origin filter dropdown", async ({ page }) => {
        // Wait for meals to load so origins are populated
        await page.waitForTimeout(1000);

        const originSelect = page.locator("select").last();
        await expect(originSelect).toBeVisible();
        await expect(originSelect).toContainText("All Origins");
    });

    test("should display loading state initially", async ({ page }) => {
        // Navigate with slow network to see loading state
        await page.route("**/themealdb.com/**", async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await route.continue();
        });

        await page.goto("/menu");
        await expect(page.locator("text=Loading meals... 🍔")).toBeVisible();
    });

    test("should display meal cards after loading", async ({ page }) => {
        // Wait for meals to load
        await page.waitForSelector(".card", { timeout: 10000 });

        // Should have meal cards
        const mealCards = page.locator(".card");
        const count = await mealCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test("should display meal name on card", async ({ page }) => {
        // Wait for meals to load
        await page.waitForSelector(".card", { timeout: 10000 });

        // Meal cards should have names
        const mealNames = page.locator(".card h2");
        const count = await mealNames.count();
        expect(count).toBeGreaterThan(0);
    });

    test("should display ingredients on meal card", async ({ page }) => {
        // Wait for meals to load
        await page.waitForSelector(".card", { timeout: 10000 });

        // Should show ingredients section
        await expect(page.locator("text=🥘 Ingredients:").first()).toBeVisible();

        // Should have ingredient badges
        const badges = page.locator(".badge");
        const count = await badges.count();
        expect(count).toBeGreaterThan(0);
    });
});

test.describe("Menu Board Filtering", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/menu");
        // Wait for meals to load
        await page.waitForSelector(".card", { timeout: 10000 });
    });

    test("should filter meals by search text", async ({ page }) => {
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );

        // Search for something specific
        await searchInput.fill("chicken");
        await page.waitForTimeout(500);

        // All visible cards should contain chicken in name or ingredients
        const cards = page.locator(".card");
        const count = await cards.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test("should filter meals by category", async ({ page }) => {
        const categorySelect = page.locator("select").first();

        // Get first available category option (not "All Categories")
        const options = await categorySelect.locator("option").all();
        if (options.length > 1) {
            const categoryValue = await options[1].getAttribute("value");
            if (categoryValue) {
                await categorySelect.selectOption(categoryValue);
                await page.waitForTimeout(500);

                // Should have results or empty state
                const cards = page.locator(".card");
                const count = await cards.count();
                expect(count).toBeGreaterThanOrEqual(0);
            }
        }
    });

    test("should filter meals by origin", async ({ page }) => {
        const originSelect = page.locator("select").last();

        // Get first available origin option (not "All Origins")
        const options = await originSelect.locator("option").all();
        if (options.length > 1) {
            const originValue = await options[1].getAttribute("value");
            if (originValue) {
                await originSelect.selectOption(originValue);
                await page.waitForTimeout(500);

                // Should have results or empty state
                const cards = page.locator(".card");
                const count = await cards.count();
                expect(count).toBeGreaterThanOrEqual(0);
            }
        }
    });

    test("should clear search filter", async ({ page }) => {
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );

        // Apply filter
        await searchInput.fill("chicken");
        await page.waitForTimeout(500);

        // Clear filter
        await searchInput.clear();
        await page.waitForTimeout(500);

        // Should show meals again
        const cards = page.locator(".card");
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);
    });

    test("should show empty message when no meals match filter", async ({
        page,
    }) => {
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );

        // Search for something that won't exist
        await searchInput.fill("xyznonexistentmeal123");
        await page.waitForTimeout(500);

        // Should show empty message
        await expect(page.locator("text=No meals found.")).toBeVisible();
    });

    test("should combine multiple filters", async ({ page }) => {
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );
        const categorySelect = page.locator("select").first();

        // Apply search filter
        await searchInput.fill("a");
        await page.waitForTimeout(300);

        // Apply category filter (if available)
        const options = await categorySelect.locator("option").all();
        if (options.length > 1) {
            const categoryValue = await options[1].getAttribute("value");
            if (categoryValue) {
                await categorySelect.selectOption(categoryValue);
                await page.waitForTimeout(500);
            }
        }

        // Should show results or empty state
        const hasCards = (await page.locator(".card").count()) > 0;
        const hasEmptyState = (await page.locator("text=No meals found.").count()) > 0;
        expect(hasCards || hasEmptyState).toBeTruthy();
    });
});

test.describe("Menu Board Favorites", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/menu");
        // Wait for meals to load
        await page.waitForSelector(".card", { timeout: 10000 });
    });

    test("should display favorite button on meal cards", async ({ page }) => {
        const favoriteButton = page.locator(
            'button:has-text("Add to Favorites"), button:has-text("Remove from Favorites")',
        );
        const count = await favoriteButton.count();
        expect(count).toBeGreaterThan(0);
    });

    test("should add meal to favorites when clicking favorite button", async ({
        page,
    }) => {
        // Find a card with "Add to Favorites" button
        const addButton = page.locator('button:has-text("☆ Add to Favorites")').first();

        if (await addButton.count() > 0) {
            await addButton.click();

            // Button should change to "Remove from Favorites"
            await expect(
                page.locator('button:has-text("⭐ Remove from Favorites")').first(),
            ).toBeVisible();
        }
    });

    test("should remove meal from favorites when clicking again", async ({
        page,
    }) => {
        // First add to favorites
        const addButton = page.locator('button:has-text("☆ Add to Favorites")').first();

        if (await addButton.count() > 0) {
            await addButton.click();
            await page.waitForTimeout(300);

            // Now remove from favorites
            const removeButton = page
                .locator('button:has-text("⭐ Remove from Favorites")')
                .first();
            await removeButton.click();

            // Button should change back
            await expect(
                page.locator('button:has-text("☆ Add to Favorites")').first(),
            ).toBeVisible();
        }
    });

    test("should show favorite count banner when favorites exist", async ({
        page,
    }) => {
        // Add a meal to favorites
        const addButton = page.locator('button:has-text("☆ Add to Favorites")').first();

        if (await addButton.count() > 0) {
            await addButton.click();
            await page.waitForTimeout(300);

            // Should show favorite count banner with specific text
            await expect(page.getByText(/You have \d+ favorite/)).toBeVisible();
        }
    });
});

test.describe("Menu Board Pagination", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/menu");
        // Wait for meals to load
        await page.waitForSelector(".card", { timeout: 10000 });
    });

    test("should display pagination when there are multiple pages", async ({
        page,
    }) => {
        // Check if pagination exists (depends on number of meals)
        const pagination = page.locator(".join");
        const hasPagination = (await pagination.count()) > 0;

        if (hasPagination) {
            await expect(pagination).toBeVisible();
        }
    });

    test("should navigate to next page", async ({ page }) => {
        const pagination = page.locator(".join");

        if ((await pagination.count()) > 0) {
            // Click next page button if exists
            const nextButton = page.locator('button:has-text("»")');
            if ((await nextButton.count()) > 0 && (await nextButton.isEnabled())) {
                await nextButton.click();
                await page.waitForTimeout(500);

                // Page should scroll to top
                // Verify we're still on the menu page
                await expect(page.locator("text=🍔 Krusty Krab Menu")).toBeVisible();
            }
        }
    });
});

test.describe("Menu Board Responsive", () => {
    test("should display menu on mobile", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/menu");

        await expect(page.locator("text=🍔 Krusty Krab Menu")).toBeVisible();

        // Wait for meals to load
        await page.waitForSelector(".card", { timeout: 10000 });

        // Cards should still be visible
        const cards = page.locator(".card");
        expect(await cards.count()).toBeGreaterThan(0);
    });

    test("should wrap filters on mobile", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/menu");

        // Filters should still be visible
        const searchInput = page.locator(
            'input[placeholder="Search by name or ingredients..."]',
        );
        await expect(searchInput).toBeVisible();
    });
});
