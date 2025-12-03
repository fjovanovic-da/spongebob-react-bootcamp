import type { Meal } from "./menu.type";

export interface ChartData {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface PieLabelRenderProps {
    percent?: number;
}

export interface ChartEmptyStateProps {
    title: string;
    message?: string;
}

export interface FavoriteStatProps {
    favoriteCount: number;
    totalCount: number;
}

export interface EmptyFavoritesProps {
    totalCount: number;
}

export interface FavoritesPieChartProps {
    data: ChartData[];
    title: string;
}

export interface FavoritesSectionProps {
    meals: Meal[];
    favoriteMeals: Meal[];
    loading: boolean;
    error: string | null;
}
