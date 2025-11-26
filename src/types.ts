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

export interface Meal {
  id: string;
  name: string;
  category: string;
  origin: string;
  ingredients: string[];
  imageUrl?: string;
}

export interface ResidentCardProps {
  resident: Resident;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export interface MealCardProps {
  meal: Meal;
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

// API response type from TheMealDB
export interface MealApiResponse {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
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

export interface FavoritesState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  favoriteCount: number;
  clearFavorites: () => void;
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

export interface MealListProps {
  meals: Meal[];
  loading: boolean;
  error: string | null;
  emptyMessage?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export interface FavoritesBoardProps {
  residents: Resident[];
  loading: boolean;
  error: string | null;
}

