import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "../../hooks/useMediaQuery";

describe("useMediaQuery", () => {
    let listeners: Map<string, Set<() => void>>;
    let mediaQueryStates: Map<string, boolean>;

    const createMockMatchMedia = () => {
        listeners = new Map();
        mediaQueryStates = new Map();

        return vi.fn((query: string) => {
            if (!listeners.has(query)) {
                listeners.set(query, new Set());
            }

            return {
                matches: mediaQueryStates.get(query) ?? false,
                media: query,
                onchange: null,
                addEventListener: vi.fn((event: string, callback: () => void) => {
                    if (event === "change") {
                        listeners.get(query)?.add(callback);
                    }
                }),
                removeEventListener: vi.fn((event: string, callback: () => void) => {
                    if (event === "change") {
                        listeners.get(query)?.delete(callback);
                    }
                }),
                addListener: vi.fn(),
                removeListener: vi.fn(),
                dispatchEvent: vi.fn(() => true),
            } as unknown as MediaQueryList;
        });
    };

    const setMediaQueryMatch = (query: string, matches: boolean) => {
        mediaQueryStates.set(query, matches);
        // Trigger all listeners for this query
        listeners.get(query)?.forEach((callback) => callback());
    };

    beforeEach(() => {
        window.matchMedia = createMockMatchMedia();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("initial state", () => {
        it("should return false when media query does not match", () => {
            mediaQueryStates.set("(max-width: 768px)", false);

            const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

            expect(result.current).toBe(false);
        });

        it("should return true when media query matches", () => {
            mediaQueryStates.set("(max-width: 768px)", true);

            const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

            expect(result.current).toBe(true);
        });

        it("should call matchMedia with the correct query", () => {
            renderHook(() => useMediaQuery("(min-width: 1024px)"));

            expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1024px)");
        });
    });

    describe("media query changes", () => {
        it("should update when media query starts matching", () => {
            mediaQueryStates.set("(max-width: 768px)", false);

            const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

            expect(result.current).toBe(false);

            act(() => {
                setMediaQueryMatch("(max-width: 768px)", true);
            });

            expect(result.current).toBe(true);
        });

        it("should update when media query stops matching", () => {
            mediaQueryStates.set("(max-width: 768px)", true);

            const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

            expect(result.current).toBe(true);

            act(() => {
                setMediaQueryMatch("(max-width: 768px)", false);
            });

            expect(result.current).toBe(false);
        });

        it("should handle multiple changes", () => {
            mediaQueryStates.set("(max-width: 768px)", false);

            const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

            expect(result.current).toBe(false);

            act(() => {
                setMediaQueryMatch("(max-width: 768px)", true);
            });
            expect(result.current).toBe(true);

            act(() => {
                setMediaQueryMatch("(max-width: 768px)", false);
            });
            expect(result.current).toBe(false);

            act(() => {
                setMediaQueryMatch("(max-width: 768px)", true);
            });
            expect(result.current).toBe(true);
        });
    });

    describe("different queries", () => {
        it("should handle different media queries independently", () => {
            mediaQueryStates.set("(max-width: 768px)", true);
            mediaQueryStates.set("(min-width: 1024px)", false);

            const { result: mobileResult } = renderHook(() =>
                useMediaQuery("(max-width: 768px)")
            );
            const { result: desktopResult } = renderHook(() =>
                useMediaQuery("(min-width: 1024px)")
            );

            expect(mobileResult.current).toBe(true);
            expect(desktopResult.current).toBe(false);
        });

        it("should handle prefers-color-scheme query", () => {
            mediaQueryStates.set("(prefers-color-scheme: dark)", true);

            const { result } = renderHook(() =>
                useMediaQuery("(prefers-color-scheme: dark)")
            );

            expect(result.current).toBe(true);
        });

        it("should handle prefers-reduced-motion query", () => {
            mediaQueryStates.set("(prefers-reduced-motion: reduce)", false);

            const { result } = renderHook(() =>
                useMediaQuery("(prefers-reduced-motion: reduce)")
            );

            expect(result.current).toBe(false);
        });
    });

    describe("query changes", () => {
        it("should re-evaluate when query prop changes", () => {
            mediaQueryStates.set("(max-width: 768px)", true);
            mediaQueryStates.set("(max-width: 1024px)", false);

            const { result, rerender } = renderHook(
                ({ query }) => useMediaQuery(query),
                { initialProps: { query: "(max-width: 768px)" } }
            );

            expect(result.current).toBe(true);

            rerender({ query: "(max-width: 1024px)" });

            expect(result.current).toBe(false);
        });
    });

    describe("cleanup", () => {
        it("should remove event listener on unmount", () => {
            const { unmount } = renderHook(() => useMediaQuery("(max-width: 768px)"));

            const listenersForQuery = listeners.get("(max-width: 768px)");
            expect(listenersForQuery?.size).toBeGreaterThan(0);

            unmount();

            expect(listenersForQuery?.size).toBe(0);
        });

        it("should remove old listener when query changes", () => {
            const { rerender } = renderHook(
                ({ query }) => useMediaQuery(query),
                { initialProps: { query: "(max-width: 768px)" } }
            );

            const oldListeners = listeners.get("(max-width: 768px)");
            expect(oldListeners?.size).toBeGreaterThan(0);

            rerender({ query: "(max-width: 1024px)" });

            expect(oldListeners?.size).toBe(0);
            expect(listeners.get("(max-width: 1024px)")?.size).toBeGreaterThan(0);
        });
    });

    describe("common breakpoints", () => {
        it("should work with mobile breakpoint", () => {
            mediaQueryStates.set("(max-width: 640px)", true);

            const { result } = renderHook(() => useMediaQuery("(max-width: 640px)"));

            expect(result.current).toBe(true);
        });

        it("should work with tablet breakpoint", () => {
            mediaQueryStates.set("(min-width: 641px) and (max-width: 1024px)", true);

            const { result } = renderHook(() =>
                useMediaQuery("(min-width: 641px) and (max-width: 1024px)")
            );

            expect(result.current).toBe(true);
        });

        it("should work with desktop breakpoint", () => {
            mediaQueryStates.set("(min-width: 1025px)", true);

            const { result } = renderHook(() => useMediaQuery("(min-width: 1025px)"));

            expect(result.current).toBe(true);
        });
    });
});
