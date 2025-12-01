export const STORAGE_KEY = "resident-filters";
export const DEFAULT_STORAGE_KEY = "favorites";
export const DEFAULT_ENDPOINT = "https://jsonplaceholder.typicode.com/users";
export const MEAL_API_ENDPOINT = "https://www.themealdb.com/api/json/v1/1/search.php";
export const DEFAULT_TIMEOUT = 10000;
export const MEAL_STORAGE_KEY = "meal-filters";
export const ITEMS_PER_PAGE = 9;

// Task sorting constants
export const TASK_SORT_KEYS = {
    NAME: "name",
    DATE_CREATED: "dateCreated",
    DATE_FINISHED: "dateFinished",
} as const;

export type TaskSortKey = typeof TASK_SORT_KEYS[keyof typeof TASK_SORT_KEYS];

// Sort direction constants
export const SORT_DIRECTIONS = {
    ASC: "asc",
    DESC: "desc",
} as const;

export type SortDirection = typeof SORT_DIRECTIONS[keyof typeof SORT_DIRECTIONS];