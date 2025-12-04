import { beforeEach, describe, expect, it } from "vitest";
import { useFavoritesStore } from "../../stores/useFavoritesStore";

describe("useFavoritesStore", () => {
    beforeEach(() => {
        // Reset store state before each test
        useFavoritesStore.getState().clearFavorites();
    });

    describe("initial state", () => {
        it("should have empty favorites array", () => {
            const { favorites } = useFavoritesStore.getState();
            expect(favorites).toEqual([]);
        });

        it("should have favoriteCount of 0", () => {
            const { favoriteCount } = useFavoritesStore.getState();
            expect(favoriteCount).toBe(0);
        });
    });

    describe("toggleFavorite", () => {
        it("should add item to favorites when not already favorited", () => {
            const { toggleFavorite } = useFavoritesStore.getState();

            toggleFavorite("item-1");

            const { favorites, favoriteCount } = useFavoritesStore.getState();
            expect(favorites).toContain("item-1");
            expect(favoriteCount).toBe(1);
        });

        it("should remove item from favorites when already favorited", () => {
            const { toggleFavorite } = useFavoritesStore.getState();

            toggleFavorite("item-1"); // Add
            toggleFavorite("item-1"); // Remove

            const { favorites, favoriteCount } = useFavoritesStore.getState();
            expect(favorites).not.toContain("item-1");
            expect(favoriteCount).toBe(0);
        });

        it("should handle multiple favorites", () => {
            const { toggleFavorite } = useFavoritesStore.getState();

            toggleFavorite("item-1");
            toggleFavorite("item-2");
            toggleFavorite("item-3");

            const { favorites, favoriteCount } = useFavoritesStore.getState();
            expect(favorites).toEqual(["item-1", "item-2", "item-3"]);
            expect(favoriteCount).toBe(3);
        });

        it("should remove only the toggled item from multiple favorites", () => {
            const { toggleFavorite } = useFavoritesStore.getState();

            toggleFavorite("item-1");
            toggleFavorite("item-2");
            toggleFavorite("item-3");
            toggleFavorite("item-2"); // Remove item-2

            const { favorites, favoriteCount } = useFavoritesStore.getState();
            expect(favorites).toEqual(["item-1", "item-3"]);
            expect(favoriteCount).toBe(2);
        });
    });

    describe("isFavorite", () => {
        it("should return true for favorited item", () => {
            const { toggleFavorite, isFavorite } = useFavoritesStore.getState();

            toggleFavorite("item-1");

            expect(isFavorite("item-1")).toBe(true);
        });

        it("should return false for non-favorited item", () => {
            const { isFavorite } = useFavoritesStore.getState();

            expect(isFavorite("item-1")).toBe(false);
        });

        it("should return false after item is unfavorited", () => {
            const { toggleFavorite, isFavorite } = useFavoritesStore.getState();

            toggleFavorite("item-1");
            toggleFavorite("item-1");

            expect(isFavorite("item-1")).toBe(false);
        });
    });

    describe("clearFavorites", () => {
        it("should remove all favorites", () => {
            const { toggleFavorite, clearFavorites } = useFavoritesStore.getState();

            toggleFavorite("item-1");
            toggleFavorite("item-2");
            toggleFavorite("item-3");

            clearFavorites();

            const { favorites, favoriteCount } = useFavoritesStore.getState();
            expect(favorites).toEqual([]);
            expect(favoriteCount).toBe(0);
        });

        it("should work when favorites is already empty", () => {
            const { clearFavorites } = useFavoritesStore.getState();

            expect(() => clearFavorites()).not.toThrow();

            const { favorites, favoriteCount } = useFavoritesStore.getState();
            expect(favorites).toEqual([]);
            expect(favoriteCount).toBe(0);
        });
    });

    describe("favoriteCount sync", () => {
        it("should keep favoriteCount in sync with favorites array length", () => {
            const { toggleFavorite } = useFavoritesStore.getState();

            toggleFavorite("item-1");
            expect(useFavoritesStore.getState().favoriteCount).toBe(useFavoritesStore.getState().favorites.length);

            toggleFavorite("item-2");
            expect(useFavoritesStore.getState().favoriteCount).toBe(useFavoritesStore.getState().favorites.length);

            toggleFavorite("item-1");
            expect(useFavoritesStore.getState().favoriteCount).toBe(useFavoritesStore.getState().favorites.length);
        });
    });
});
