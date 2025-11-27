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

export interface UseResidentsReturn {
    residents: Resident[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export interface UseResidentFilterReturn {
    filteredResidents: Resident[];
    searchText: string;
    roleFilter: string;
    setSearchText: (text: string) => void;
    setRoleFilter: (role: string) => void;
}

export interface FilterState {
    searchText: string;
    roleFilter: string;
    setSearchText: (text: string) => void;
    setRoleFilter: (role: string) => void;
}

export interface WelcomeBoardProps {
    residents: Resident[];
    loading: boolean;
    error: string | null;
}

export interface ResidentFilterProps {
    searchText: string;
    roleFilter: string;
    onSearchChange: (text: string) => void;
    onRoleChange: (role: string) => void;
}

export interface ResidentListProps {
    residents: Resident[];
    loading: boolean;
    error: string | null;
    emptyMessage?: string;
    showFavoriteCount?: boolean;
}
