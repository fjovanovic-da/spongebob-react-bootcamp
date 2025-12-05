import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_STORAGE_KEY } from "../config";
import type { FavoritesState } from "../types";

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            favoriteCount: 0,
            toggleFavorite: (id: string) =>
                set((state) => {
                    const newFavorites = state.favorites.includes(id)
                        ? state.favorites.filter((favId) => favId !== id)
                        : [...state.favorites, id];
                    return {
                        favorites: newFavorites,
                        favoriteCount: newFavorites.length,
                    };
                }),
            isFavorite: (id: string) => get().favorites.includes(id),
            clearFavorites: () => set({ favorites: [], favoriteCount: 0 }),
        }),
        {
            name: DEFAULT_STORAGE_KEY,
        },
    ),
);
