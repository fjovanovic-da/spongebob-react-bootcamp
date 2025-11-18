export interface Resident {
    id: string;
    name: string;
    role: string;
    description: string;
    imageUrl: string;
    emoji?: string;
}

export interface ResidentCardProps {
    resident: Resident;
    onFavorite?: (id: string) => void;
    isFavorite?: boolean;
}