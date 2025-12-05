import { useCallback, useSyncExternalStore } from "react";

/**
 * Custom hook to track media query matches using the modern matchMedia API
 * More performant than resize event listeners
 * @param query - Media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (callback: () => void) => {
            const mediaQuery = window.matchMedia(query);
            mediaQuery.addEventListener("change", callback);
            return () => mediaQuery.removeEventListener("change", callback);
        },
        [query]
    );

    const getSnapshot = useCallback(() => {
        return window.matchMedia(query).matches;
    }, [query]);

    const getServerSnapshot = useCallback(() => {
        // Default to false on server (SSR)
        return false;
    }, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
