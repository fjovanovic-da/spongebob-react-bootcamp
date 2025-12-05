import { create } from "zustand";
import { httpClient } from "../api";
import type { MealsState } from "../types";

export const useMealsStore = create<MealsState>((set, get) => ({
    meals: [],
    loading: false,
    error: null,
    hasFetched: false,

    fetchMeals: async () => {
        // Skip if already fetched or currently loading
        if (get().hasFetched || get().loading) {
            return;
        }

        try {
            set({ loading: true, error: null });

            // Fetch meals for letters a, b, c, f, s
            const letters = ["a", "b", "c", "f", "s"];
            const promises = letters.map((letter) =>
                httpClient.getMealsByFirstLetter(letter)
            );

            const results = await Promise.all(promises);
            const allMeals = results.flat();

            set({ meals: allMeals, hasFetched: true });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Failed to fetch meals",
            });
        } finally {
            set({ loading: false });
        }
    },
}));
