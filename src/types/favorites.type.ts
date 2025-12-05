export interface FavoritesState {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    favoriteCount: number;
    clearFavorites: () => void;
}

import type { Meal } from './menu.type';

export interface FavoritesBoardProps {
    meals: Meal[];
    loading: boolean;
    error: string | null;
}
