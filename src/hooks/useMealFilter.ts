import { useMemo } from "react";
import { useMealFilterStore } from "../stores/useMealFilterStore";
import type { Meal, UseMealFilterReturn } from "../types";
import { useDebounce } from "./useDebounce";

/**
 * Custom hook to filter meals by search text, category, and origin
 * @param meals - Array of meals to filter
 * @returns Object containing filtered meals, filter states, setters, and available options
 */
export function useMealFilter(meals: Meal[]): UseMealFilterReturn {
    const { searchText, categoryFilter, originFilter, setSearchText, setCategoryFilter, setOriginFilter } =
        useMealFilterStore();

    // Debounce search text for better performance
    const debouncedSearchText = useDebounce(searchText, 300);

    // Get unique categories and origins from all meals
    const availableCategories = useMemo(() => {
        const categories = new Set(meals.map((meal) => meal.category));
        return Array.from(categories).sort();
    }, [meals]);

    const availableOrigins = useMemo(() => {
        const origins = new Set(meals.map((meal) => meal.origin));
        return Array.from(origins).sort();
    }, [meals]);

    // Filter meals based on all criteria
    const filteredMeals = useMemo(() => {
        return meals.filter((meal) => {
            // Filter by search text (name and ingredients)
            const matchesSearch =
                debouncedSearchText === "" ||
                meal.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
                meal.ingredients.some((ingredient) =>
                    ingredient.toLowerCase().includes(debouncedSearchText.toLowerCase())
                );

            // Filter by category dropdown
            const matchesCategory =
                categoryFilter === "" || meal.category === categoryFilter;

            // Filter by origin dropdown
            const matchesOrigin =
                originFilter === "" || meal.origin === originFilter;

            return matchesSearch && matchesCategory && matchesOrigin;
        });
    }, [meals, debouncedSearchText, categoryFilter, originFilter]);

    return {
        filteredMeals,
        searchText,
        categoryFilter,
        originFilter,
        setSearchText,
        setCategoryFilter,
        setOriginFilter,
        availableCategories,
        availableOrigins,
    };
}
