import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMeals } from "../../hooks/useMeals";
import { useMealsStore } from "../../stores";
import type { Meal } from "../../types";

describe("useMeals", () => {
    const mockMeals: Meal[] = [
        {
            id: "1",
            name: "Krabby Patty",
            category: "Seafood",
            origin: "Bikini Bottom",
            ingredients: ["Kelp", "Secret Sauce"],
        },
        {
            id: "2",
            name: "Kelp Shake",
            category: "Beverage",
            origin: "Bikini Bottom",
            ingredients: ["Kelp", "Sugar"],
        },
    ];

    beforeEach(() => {
        // Reset store state before each test
        useMealsStore.setState({
            meals: [],
            loading: false,
            error: null,
            hasFetched: false,
            fetchMeals: vi.fn(), // Mock fetchMeals to prevent actual API calls
        });
    });

    describe("initial render", () => {
        it("should return meals from store", () => {
            useMealsStore.setState({ meals: mockMeals });

            const { result } = renderHook(() => useMeals());

            expect(result.current.meals).toEqual(mockMeals);
        });

        it("should return loading state from store", () => {
            useMealsStore.setState({ loading: true });

            const { result } = renderHook(() => useMeals());

            expect(result.current.loading).toBe(true);
        });

        it("should return error state from store", () => {
            useMealsStore.setState({ error: "Failed to fetch" });

            const { result } = renderHook(() => useMeals());

            expect(result.current.error).toBe("Failed to fetch");
        });

        it("should return null error when no error", () => {
            const { result } = renderHook(() => useMeals());

            expect(result.current.error).toBeNull();
        });
    });

    describe("fetchMeals call", () => {
        it("should call fetchMeals on mount", () => {
            const fetchMealsMock = vi.fn();
            useMealsStore.setState({
                fetchMeals: fetchMealsMock,
            });

            renderHook(() => useMeals());

            expect(fetchMealsMock).toHaveBeenCalledTimes(1);
        });

        it("should not call fetchMeals again on rerender", () => {
            const fetchMealsMock = vi.fn();
            useMealsStore.setState({
                fetchMeals: fetchMealsMock,
            });

            const { rerender } = renderHook(() => useMeals());

            rerender();
            rerender();

            // Should only be called once on mount
            expect(fetchMealsMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("state updates", () => {
        it("should reflect meals updates from store", async () => {
            const { result } = renderHook(() => useMeals());

            expect(result.current.meals).toEqual([]);

            // Simulate store update
            act(() => {
                useMealsStore.setState({ meals: mockMeals });
            });

            await waitFor(() => {
                expect(result.current.meals).toEqual(mockMeals);
            });
        });

        it("should reflect loading updates from store", async () => {
            const { result } = renderHook(() => useMeals());

            expect(result.current.loading).toBe(false);

            act(() => {
                useMealsStore.setState({ loading: true });
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(true);
            });
        });

        it("should reflect error updates from store", async () => {
            const { result } = renderHook(() => useMeals());

            expect(result.current.error).toBeNull();

            act(() => {
                useMealsStore.setState({ error: "Network error" });
            });

            await waitFor(() => {
                expect(result.current.error).toBe("Network error");
            });
        });
    });

    describe("return value structure", () => {
        it("should return object with meals, loading, and error", () => {
            const { result } = renderHook(() => useMeals());

            expect(result.current).toHaveProperty("meals");
            expect(result.current).toHaveProperty("loading");
            expect(result.current).toHaveProperty("error");
        });

        it("should return correct types", () => {
            useMealsStore.setState({
                meals: mockMeals,
                loading: false,
                error: null,
            });

            const { result } = renderHook(() => useMeals());

            expect(Array.isArray(result.current.meals)).toBe(true);
            expect(typeof result.current.loading).toBe("boolean");
            expect(result.current.error === null || typeof result.current.error === "string").toBe(true);
        });
    });
});
