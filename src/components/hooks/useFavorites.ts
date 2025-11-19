import { useCallback, useEffect, useState } from "react";

export function useFavorites(storageKey = "favorites") {
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

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoriteCount: favorites.length,
    clearFavorites: () => setFavorites([]),
  };
}