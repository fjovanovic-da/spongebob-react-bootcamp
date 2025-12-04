import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "../../hooks/useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("initial value", () => {
        it("should return the initial value immediately", () => {
            const { result } = renderHook(() => useDebounce("initial", 300));

            expect(result.current).toBe("initial");
        });

        it("should work with different types - number", () => {
            const { result } = renderHook(() => useDebounce(42, 300));

            expect(result.current).toBe(42);
        });

        it("should work with different types - object", () => {
            const obj = { name: "SpongeBob" };
            const { result } = renderHook(() => useDebounce(obj, 300));

            expect(result.current).toEqual({ name: "SpongeBob" });
        });

        it("should work with different types - array", () => {
            const arr = [1, 2, 3];
            const { result } = renderHook(() => useDebounce(arr, 300));

            expect(result.current).toEqual([1, 2, 3]);
        });

        it("should work with null", () => {
            const { result } = renderHook(() => useDebounce(null, 300));

            expect(result.current).toBeNull();
        });

        it("should work with undefined", () => {
            const { result } = renderHook(() => useDebounce(undefined, 300));

            expect(result.current).toBeUndefined();
        });
    });

    describe("debounce behavior", () => {
        it("should not update value before delay", () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 300),
                { initialProps: { value: "initial" } }
            );

            rerender({ value: "updated" });

            // Value should still be initial before delay
            expect(result.current).toBe("initial");
        });

        it("should update value after delay", () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 300),
                { initialProps: { value: "initial" } }
            );

            rerender({ value: "updated" });

            // Fast forward past the delay
            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current).toBe("updated");
        });

        it("should use default delay of 300ms", () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value),
                { initialProps: { value: "initial" } }
            );

            rerender({ value: "updated" });

            // At 299ms, should still be initial
            act(() => {
                vi.advanceTimersByTime(299);
            });
            expect(result.current).toBe("initial");

            // At 300ms, should be updated
            act(() => {
                vi.advanceTimersByTime(1);
            });
            expect(result.current).toBe("updated");
        });

        it("should respect custom delay", () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: "initial" } }
            );

            rerender({ value: "updated" });

            // At 300ms, should still be initial
            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(result.current).toBe("initial");

            // At 500ms, should be updated
            act(() => {
                vi.advanceTimersByTime(200);
            });
            expect(result.current).toBe("updated");
        });

        it("should cancel previous timeout on rapid changes", () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 300),
                { initialProps: { value: "initial" } }
            );

            // Rapid changes
            rerender({ value: "change1" });
            act(() => {
                vi.advanceTimersByTime(100);
            });

            rerender({ value: "change2" });
            act(() => {
                vi.advanceTimersByTime(100);
            });

            rerender({ value: "change3" });
            act(() => {
                vi.advanceTimersByTime(100);
            });

            // Still should be initial because each change resets the timer
            expect(result.current).toBe("initial");

            // Now wait for full delay after last change
            act(() => {
                vi.advanceTimersByTime(200);
            });

            // Should have the final value
            expect(result.current).toBe("change3");
        });

        it("should only emit final value after rapid changes", () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 300),
                { initialProps: { value: "a" } }
            );

            // Type "abc" rapidly
            rerender({ value: "ab" });
            act(() => {
                vi.advanceTimersByTime(50);
            });

            rerender({ value: "abc" });
            act(() => {
                vi.advanceTimersByTime(50);
            });

            // Should still be "a"
            expect(result.current).toBe("a");

            // Wait for debounce
            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Should be final value
            expect(result.current).toBe("abc");
        });
    });

    describe("cleanup", () => {
        it("should clear timeout on unmount", () => {
            const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

            const { unmount, rerender } = renderHook(
                ({ value }) => useDebounce(value, 300),
                { initialProps: { value: "initial" } }
            );

            rerender({ value: "updated" });
            unmount();

            expect(clearTimeoutSpy).toHaveBeenCalled();
            clearTimeoutSpy.mockRestore();
        });
    });

    describe("delay changes", () => {
        it("should respect new delay when delay prop changes", () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: "initial", delay: 300 } }
            );

            // Change both value and delay
            rerender({ value: "updated", delay: 500 });

            // At 300ms, should still be initial (new delay is 500)
            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(result.current).toBe("initial");

            // At 500ms total, should be updated
            act(() => {
                vi.advanceTimersByTime(200);
            });
            expect(result.current).toBe("updated");
        });
    });
});
