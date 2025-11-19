import { useCallback, useEffect, useState } from "react";
import type { UseFavoritesReturn } from "../types";

const DEFAULT_STORAGE_KEY = "favorites";

/**
 * Custom hook to manage favorite residents with localStorage persistence
 * @param storageKey - Optional localStorage key override
 * @returns Object containing favorites array, toggle function, check function, count, and clear function
 */
export function useFavorites(storageKey: string = DEFAULT_STORAGE_KEY): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const storedFavorites = localStorage.getItem(storageKey);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch {
      // Handle error if needed
    }
  }, [favorites, storageKey]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoriteCount: favorites.length,
    clearFavorites,
  };
}