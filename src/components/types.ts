export interface Resident {
    id: string;
    name: string;
    email: string;
    city: string;
    company: string;
    catchphrase: string;
    business: string;
    imageUrl?: string;
    emoji?: string;
}

export interface ResidentCardProps {
    resident: Resident;
    onFavorite?: (id: string) => void;
    isFavorite?: boolean;
}

// API response type from JSONPlaceholder
export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    address: {
        city: string;
    };
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
}

export interface UseResidentsReturn {
    residents: Resident[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export interface UseFavoritesReturn {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    favoriteCount: number;
    clearFavorites: () => void;
}

export interface UseResidentFilterReturn {
    filteredResidents: Resident[];
    searchText: string;
    roleFilter: string;
    setSearchText: (text: string) => void;
    setRoleFilter: (role: string) => void;
}

export interface FilterContextType {
    searchText: string;
    roleFilter: string;
    setSearchText: (text: string) => void;
    setRoleFilter: (role: string) => void;
}