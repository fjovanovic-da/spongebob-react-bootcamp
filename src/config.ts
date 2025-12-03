export const STORAGE_KEY = "resident-filters";
export const DEFAULT_STORAGE_KEY = "favorites";
export const DEFAULT_ENDPOINT = "https://jsonplaceholder.typicode.com/users";
export const MEAL_API_ENDPOINT = "https://www.themealdb.com/api/json/v1/1/search.php";
export const DEFAULT_TIMEOUT = 10000;
export const MEAL_STORAGE_KEY = "meal-filters";
export const ITEMS_PER_PAGE = 6;
export const TABLE_ITEMS_PER_PAGE = 10;

// Task sorting constants
export const TASK_SORT_KEYS = {
    NAME: "name",
    DATE: "date",
    DATE_FINISHED: "dateFinished",
} as const;

export type TaskSortKey = typeof TASK_SORT_KEYS[keyof typeof TASK_SORT_KEYS];

// Sort direction constants
export const SORT_DIRECTIONS = {
    ASC: "asc",
    DESC: "desc",
} as const;

export type SortDirection = typeof SORT_DIRECTIONS[keyof typeof SORT_DIRECTIONS];

// Pie chart colors for dashboard
export const CHART_COLORS = [
    "#FF6384", // pink
    "#36A2EB", // blue
    "#FFCE56", // yellow
    "#4BC0C0", // teal
    "#9966FF", // purple
    "#FF9F40", // orange
    "#7CFC00", // lawn green
    "#DC143C", // crimson
    "#00CED1", // dark turquoise
    "#FFD700", // gold
];

// Pie chart dimensions
export const CHART_CONFIG = {
    OUTER_RADIUS: 70,
    CENTER_Y: "40%",
    CENTER_X: "50%",
} as const;

// Favorites section constants
export const FAVORITES_SECTION = {
    EMOJI: {
        HEART: "❤️",
        BROKEN_HEART: "💔",
    },
    MESSAGES: {
        TITLE: "Favorite Meals",
        EMPTY_PROMPT: "No favorite meals yet. Add some from the Menu!",
        TOTAL_DESCRIPTION: (total: number) => `out of ${total} total meals`,
    },
} as const;