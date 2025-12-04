import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMealsStore } from "../../stores/useMealsStore";
import type { Meal } from "../../types";

// Mock the httpClient
vi.mock("../../api", () => ({
    httpClient: {
        getMealsByFirstLetter: vi.fn(),
    },
}));

// Import the mocked httpClient
import { httpClient } from "../../api";

const mockMeals: Meal[] = [
    {
        id: "1",
        name: "Apple Pie",
        category: "Dessert",
        origin: "American",
        ingredients: ["Apples", "Sugar", "Flour"],
        imageUrl: "https://example.com/apple-pie.jpg",
    },
    {
        id: "2",
        name: "Banana Bread",
        category: "Dessert",
        origin: "American",
        ingredients: ["Bananas", "Flour", "Sugar"],
        imageUrl: "https://example.com/banana-bread.jpg",
    },
];

describe("useMealsStore", () => {
    beforeEach(() => {
        // Reset store state before each test
        useMealsStore.setState({
            meals: [],
            loading: false,
            error: null,
            hasFetched: false,
        });
        // Clear all mocks
        vi.clearAllMocks();
    });

    describe("initial state", () => {
        it("should have empty meals array", () => {
            const { meals } = useMealsStore.getState();
            expect(meals).toEqual([]);
        });

        it("should have loading as false", () => {
            const { loading } = useMealsStore.getState();
            expect(loading).toBe(false);
        });

        it("should have error as null", () => {
            const { error } = useMealsStore.getState();
            expect(error).toBeNull();
        });

        it("should have hasFetched as false", () => {
            const { hasFetched } = useMealsStore.getState();
            expect(hasFetched).toBe(false);
        });
    });

    describe("fetchMeals", () => {
        it("should fetch meals successfully", async () => {
            vi.mocked(httpClient.getMealsByFirstLetter).mockResolvedValue(mockMeals);

            const { fetchMeals } = useMealsStore.getState();
            await fetchMeals();

            const { meals, loading, error, hasFetched } = useMealsStore.getState();
            expect(meals).toHaveLength(10); // 5 letters * 2 meals each
            expect(loading).toBe(false);
            expect(error).toBeNull();
            expect(hasFetched).toBe(true);
        });

        it("should call getMealsByFirstLetter for each letter", async () => {
            vi.mocked(httpClient.getMealsByFirstLetter).mockResolvedValue([]);

            const { fetchMeals } = useMealsStore.getState();
            await fetchMeals();

            expect(httpClient.getMealsByFirstLetter).toHaveBeenCalledTimes(5);
            expect(httpClient.getMealsByFirstLetter).toHaveBeenCalledWith("a");
            expect(httpClient.getMealsByFirstLetter).toHaveBeenCalledWith("b");
            expect(httpClient.getMealsByFirstLetter).toHaveBeenCalledWith("c");
            expect(httpClient.getMealsByFirstLetter).toHaveBeenCalledWith("f");
            expect(httpClient.getMealsByFirstLetter).toHaveBeenCalledWith("s");
        });

        it("should set loading to true while fetching", async () => {
            let loadingDuringFetch = false;

            vi.mocked(httpClient.getMealsByFirstLetter).mockImplementation(async () => {
                loadingDuringFetch = useMealsStore.getState().loading;
                return mockMeals;
            });

            const { fetchMeals } = useMealsStore.getState();
            await fetchMeals();

            expect(loadingDuringFetch).toBe(true);
            expect(useMealsStore.getState().loading).toBe(false);
        });

        it("should not fetch if already fetched", async () => {
            vi.mocked(httpClient.getMealsByFirstLetter).mockResolvedValue(mockMeals);

            // First fetch
            await useMealsStore.getState().fetchMeals();

            // Second fetch should be skipped
            await useMealsStore.getState().fetchMeals();

            // Should only be called 5 times (once per letter, only during first fetch)
            expect(httpClient.getMealsByFirstLetter).toHaveBeenCalledTimes(5);
        });

        it("should not fetch if currently loading", async () => {
            // Set loading to true manually
            useMealsStore.setState({ loading: true });

            vi.mocked(httpClient.getMealsByFirstLetter).mockResolvedValue(mockMeals);

            const { fetchMeals } = useMealsStore.getState();
            await fetchMeals();

            expect(httpClient.getMealsByFirstLetter).not.toHaveBeenCalled();
        });

        it("should handle errors gracefully", async () => {
            const errorMessage = "Network error";
            vi.mocked(httpClient.getMealsByFirstLetter).mockRejectedValue(
                new Error(errorMessage)
            );

            const { fetchMeals } = useMealsStore.getState();
            await fetchMeals();

            const { meals, loading, error, hasFetched } = useMealsStore.getState();
            expect(meals).toEqual([]);
            expect(loading).toBe(false);
            expect(error).toBe(errorMessage);
            expect(hasFetched).toBe(false);
        });

        it("should handle non-Error exceptions", async () => {
            vi.mocked(httpClient.getMealsByFirstLetter).mockRejectedValue(
                "Unknown error"
            );

            const { fetchMeals } = useMealsStore.getState();
            await fetchMeals();

            const { error } = useMealsStore.getState();
            expect(error).toBe("Failed to fetch meals");
        });

        it("should clear previous error on new fetch attempt", async () => {
            // First, set an error state
            useMealsStore.setState({ error: "Previous error" });

            vi.mocked(httpClient.getMealsByFirstLetter).mockResolvedValue(mockMeals);

            const { fetchMeals } = useMealsStore.getState();
            await fetchMeals();

            const { error } = useMealsStore.getState();
            expect(error).toBeNull();
        });

        it("should flatten results from multiple API calls", async () => {
            const mealsA: Meal[] = [{ id: "a1", name: "Apple", category: "Fruit", origin: "USA", ingredients: [] }];
            const mealsB: Meal[] = [{ id: "b1", name: "Banana", category: "Fruit", origin: "Ecuador", ingredients: [] }];
            const mealsC: Meal[] = [{ id: "c1", name: "Cherry", category: "Fruit", origin: "USA", ingredients: [] }];

            vi.mocked(httpClient.getMealsByFirstLetter)
                .mockResolvedValueOnce(mealsA)
                .mockResolvedValueOnce(mealsB)
                .mockResolvedValueOnce(mealsC)
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([]);

            const { fetchMeals } = useMealsStore.getState();
            await fetchMeals();

            const { meals } = useMealsStore.getState();
            expect(meals).toHaveLength(3);
            expect(meals).toContainEqual(mealsA[0]);
            expect(meals).toContainEqual(mealsB[0]);
            expect(meals).toContainEqual(mealsC[0]);
        });
    });
});
