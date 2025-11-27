export interface FavoritesState {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    favoriteCount: number;
    clearFavorites: () => void;
}

import type { Resident } from './resident.type';

export interface FavoritesBoardProps {
    residents: Resident[];
    loading: boolean;
    error: string | null;
}
