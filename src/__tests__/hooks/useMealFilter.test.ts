import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMealFilter } from "../../hooks/useMealFilter";
import { useMealFilterStore } from "../../stores";
import type { Meal } from "../../types";

describe("useMealFilter", () => {
    const mockMeals: Meal[] = [
        {
            id: "1",
            name: "Krabby Patty",
            category: "Seafood",
            origin: "Bikini Bottom",
            ingredients: ["Kelp", "Secret Sauce", "Bun"],
        },
        {
            id: "2",
            name: "Kelp Shake",
            category: "Beverage",
            origin: "Bikini Bottom",
            ingredients: ["Kelp", "Sugar", "Ice"],
        },
        {
            id: "3",
            name: "Chum Bucket Surprise",
            category: "Seafood",
            origin: "Chum Bucket",
            ingredients: ["Chum", "Mystery Meat"],
        },
        {
            id: "4",
            name: "Coral Bits",
            category: "Snack",
            origin: "Rock Bottom",
            ingredients: ["Coral", "Salt"],
        },
        {
            id: "5",
            name: "Jellyfish Jelly Sandwich",
            category: "Snack",
            origin: "Bikini Bottom",
            ingredients: ["Bread", "Jellyfish Jelly"],
        },
    ];

    beforeEach(() => {
        vi.useFakeTimers();
        // Reset store state before each test
        useMealFilterStore.setState({
            searchText: "",
            categoryFilter: "",
            originFilter: "",
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("initial state", () => {
        it("should return all meals when no filters are applied", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            expect(result.current.filteredMeals).toHaveLength(5);
        });

        it("should return empty searchText initially", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            expect(result.current.searchText).toBe("");
        });

        it("should return empty categoryFilter initially", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            expect(result.current.categoryFilter).toBe("");
        });

        it("should return empty originFilter initially", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            expect(result.current.originFilter).toBe("");
        });
    });

    describe("availableCategories", () => {
        it("should return unique categories sorted alphabetically", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            expect(result.current.availableCategories).toEqual([
                "Beverage",
                "Seafood",
                "Snack",
            ]);
        });

        it("should return empty array when no meals", () => {
            const { result } = renderHook(() => useMealFilter([]));

            expect(result.current.availableCategories).toEqual([]);
        });
    });

    describe("availableOrigins", () => {
        it("should return unique origins sorted alphabetically", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            expect(result.current.availableOrigins).toEqual([
                "Bikini Bottom",
                "Chum Bucket",
                "Rock Bottom",
            ]);
        });

        it("should return empty array when no meals", () => {
            const { result } = renderHook(() => useMealFilter([]));

            expect(result.current.availableOrigins).toEqual([]);
        });
    });

    describe("search filtering", () => {
        it("should filter by meal name (case insensitive)", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setSearchText("krabby");
            });

            // Wait for debounce
            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredMeals).toHaveLength(1);
            expect(result.current.filteredMeals[0].name).toBe("Krabby Patty");
        });

        it("should filter by ingredient (case insensitive)", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setSearchText("kelp");
            });

            // Wait for debounce
            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Krabby Patty (has Kelp ingredient) and Kelp Shake (name and ingredient)
            expect(result.current.filteredMeals).toHaveLength(2);
        });

        it("should return empty array when no matches", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setSearchText("pizza");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredMeals).toHaveLength(0);
        });

        it("should debounce search text", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setSearchText("krabby");
            });

            // Before debounce completes, should still show all meals
            expect(result.current.filteredMeals).toHaveLength(5);

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // After debounce, should be filtered
            expect(result.current.filteredMeals).toHaveLength(1);
        });
    });

    describe("category filtering", () => {
        it("should filter by category", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setCategoryFilter("Seafood");
            });

            expect(result.current.filteredMeals).toHaveLength(2);
            expect(
                result.current.filteredMeals.every((m) => m.category === "Seafood")
            ).toBe(true);
        });

        it("should show all meals when category filter is cleared", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setCategoryFilter("Seafood");
            });

            expect(result.current.filteredMeals).toHaveLength(2);

            act(() => {
                result.current.setCategoryFilter("");
            });

            expect(result.current.filteredMeals).toHaveLength(5);
        });
    });

    describe("origin filtering", () => {
        it("should filter by origin", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setOriginFilter("Bikini Bottom");
            });

            expect(result.current.filteredMeals).toHaveLength(3);
            expect(
                result.current.filteredMeals.every((m) => m.origin === "Bikini Bottom")
            ).toBe(true);
        });

        it("should show all meals when origin filter is cleared", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setOriginFilter("Rock Bottom");
            });

            expect(result.current.filteredMeals).toHaveLength(1);

            act(() => {
                result.current.setOriginFilter("");
            });

            expect(result.current.filteredMeals).toHaveLength(5);
        });
    });

    describe("combined filtering", () => {
        it("should filter by search and category", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setSearchText("kelp");
                result.current.setCategoryFilter("Seafood");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Only Krabby Patty matches both (has Kelp ingredient and is Seafood)
            expect(result.current.filteredMeals).toHaveLength(1);
            expect(result.current.filteredMeals[0].name).toBe("Krabby Patty");
        });

        it("should filter by search and origin", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setSearchText("jelly");
                result.current.setOriginFilter("Bikini Bottom");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredMeals).toHaveLength(1);
            expect(result.current.filteredMeals[0].name).toBe(
                "Jellyfish Jelly Sandwich"
            );
        });

        it("should filter by category and origin", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setCategoryFilter("Snack");
                result.current.setOriginFilter("Bikini Bottom");
            });

            // Only Jellyfish Jelly Sandwich is Snack from Bikini Bottom
            expect(result.current.filteredMeals).toHaveLength(1);
            expect(result.current.filteredMeals[0].name).toBe(
                "Jellyfish Jelly Sandwich"
            );
        });

        it("should filter by all three criteria", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setSearchText("bread");
                result.current.setCategoryFilter("Snack");
                result.current.setOriginFilter("Bikini Bottom");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredMeals).toHaveLength(1);
            expect(result.current.filteredMeals[0].name).toBe(
                "Jellyfish Jelly Sandwich"
            );
        });

        it("should return empty when combined filters have no matches", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setCategoryFilter("Beverage");
                result.current.setOriginFilter("Rock Bottom");
            });

            expect(result.current.filteredMeals).toHaveLength(0);
        });
    });

    describe("setters", () => {
        it("should provide setSearchText function", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            expect(typeof result.current.setSearchText).toBe("function");

            act(() => {
                result.current.setSearchText("test");
            });

            expect(result.current.searchText).toBe("test");
        });

        it("should provide setCategoryFilter function", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            expect(typeof result.current.setCategoryFilter).toBe("function");

            act(() => {
                result.current.setCategoryFilter("Seafood");
            });

            expect(result.current.categoryFilter).toBe("Seafood");
        });

        it("should provide setOriginFilter function", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            expect(typeof result.current.setOriginFilter).toBe("function");

            act(() => {
                result.current.setOriginFilter("Bikini Bottom");
            });

            expect(result.current.originFilter).toBe("Bikini Bottom");
        });
    });

    describe("edge cases", () => {
        it("should handle empty meals array", () => {
            const { result } = renderHook(() => useMealFilter([]));

            expect(result.current.filteredMeals).toEqual([]);
            expect(result.current.availableCategories).toEqual([]);
            expect(result.current.availableOrigins).toEqual([]);
        });

        it("should handle meals with empty ingredients array", () => {
            const mealsWithEmptyIngredients: Meal[] = [
                {
                    id: "1",
                    name: "Empty Meal",
                    category: "Test",
                    origin: "Test",
                    ingredients: [],
                },
            ];

            const { result } = renderHook(() =>
                useMealFilter(mealsWithEmptyIngredients)
            );

            act(() => {
                result.current.setSearchText("something");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredMeals).toHaveLength(0);
        });

        it("should handle partial ingredient match", () => {
            const { result } = renderHook(() => useMealFilter(mockMeals));

            act(() => {
                result.current.setSearchText("sec"); // partial match for "Secret Sauce"
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredMeals).toHaveLength(1);
            expect(result.current.filteredMeals[0].name).toBe("Krabby Patty");
        });
    });
});
