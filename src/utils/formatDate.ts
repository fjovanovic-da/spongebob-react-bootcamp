// Simple memoization cache for date formatting
const dateFormatCache = new Map<string, string>();

/**
 * Formats a date to locale string with caching for performance
 * @param date - Date object or string to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
    const dateKey =
        typeof date === "string" ? date : date.toISOString().split("T")[0];

    const cached = dateFormatCache.get(dateKey);
    if (cached !== undefined) {
        return cached;
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;
    const formatted = dateObj.toLocaleDateString();

    // Limit cache size to prevent memory issues
    if (dateFormatCache.size > 1000) {
        const firstKey = dateFormatCache.keys().next().value;
        if (firstKey) {
            dateFormatCache.delete(firstKey);
        }
    }

    dateFormatCache.set(dateKey, formatted);
    return formatted;
}

/**
 * Clears the date format cache (useful for testing or locale changes)
 */
export function clearDateFormatCache(): void {
    dateFormatCache.clear();
}
