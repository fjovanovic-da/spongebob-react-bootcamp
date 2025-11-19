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