export interface Meal {
    id: string;
    name: string;
    category: string;
    origin: string;
    ingredients: string[];
    imageUrl?: string;
}

export interface MealCardProps {
    meal: Meal;
}

export interface MealFilterState {
    searchText: string;
    categoryFilter: string;
    originFilter: string;
    setSearchText: (text: string) => void;
    setCategoryFilter: (category: string) => void;
    setOriginFilter: (origin: string) => void;
}

export interface UseMealFilterReturn {
    filteredMeals: Meal[];
    searchText: string;
    categoryFilter: string;
    originFilter: string;
    setSearchText: (text: string) => void;
    setCategoryFilter: (category: string) => void;
    setOriginFilter: (origin: string) => void;
    availableCategories: string[];
    availableOrigins: string[];
}

export interface MealFilterProps {
    searchText: string;
    categoryFilter: string;
    originFilter: string;
    onSearchChange: (text: string) => void;
    onCategoryChange: (category: string) => void;
    onOriginChange: (origin: string) => void;
    availableCategories: string[];
    availableOrigins: string[];
}

export interface MealListProps {
    meals: Meal[];
    loading: boolean;
    error: string | null;
    emptyMessage?: string;
}
