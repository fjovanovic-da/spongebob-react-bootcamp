import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MEAL_STORAGE_KEY } from "../config";
import type { MealFilterState } from "../types";


export const useMealFilterStore = create<MealFilterState>()(
    persist(
        (set) => ({
            searchText: "",
            categoryFilter: "",
            originFilter: "",
            setSearchText: (text: string) => set({ searchText: text }),
            setCategoryFilter: (category: string) => set({ categoryFilter: category }),
            setOriginFilter: (origin: string) => set({ originFilter: origin }),
        }),
        {
            name: MEAL_STORAGE_KEY,
        },
    ),
);
