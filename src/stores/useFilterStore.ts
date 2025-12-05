import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEY } from "../config";
import type { FilterState } from "../types";

export const useFilterStore = create<FilterState>()(
    persist(
        (set) => ({
            searchText: "",
            roleFilter: "",
            setSearchText: (text: string) => set({ searchText: text }),
            setRoleFilter: (role: string) => set({ roleFilter: role }),
        }),
        {
            name: STORAGE_KEY,
        },
    ),
);
