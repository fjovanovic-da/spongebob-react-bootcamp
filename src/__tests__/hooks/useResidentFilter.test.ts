import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useResidentFilter } from "../../hooks/useResidentFilter";
import { useFilterStore } from "../../stores";
import type { Resident } from "../../types";

describe("useResidentFilter", () => {
    const mockResidents: Resident[] = [
        {
            id: "1",
            name: "SpongeBob SquarePants",
            email: "spongebob@krustykrab.com",
            city: "Bikini Bottom",
            company: "Krusty Krab",
            catchphrase: "I'm ready!",
            business: "fry cooking",
        },
        {
            id: "2",
            name: "Patrick Star",
            email: "patrick@rock.com",
            city: "Bikini Bottom",
            company: "Unemployed",
            catchphrase: "Is mayonnaise an instrument?",
            business: "sleeping",
        },
        {
            id: "3",
            name: "Squidward Tentacles",
            email: "squidward@krustykrab.com",
            city: "Bikini Bottom",
            company: "Krusty Krab",
            catchphrase: "I hate my life",
            business: "cashier",
        },
        {
            id: "4",
            name: "Mr. Krabs",
            email: "krabs@krustykrab.com",
            city: "Bikini Bottom",
            company: "Krusty Krab",
            catchphrase: "Money!",
            business: "management",
        },
        {
            id: "5",
            name: "Sandy Cheeks",
            email: "sandy@treedome.com",
            city: "Texas",
            company: "Treedome Labs",
            catchphrase: "Don't mess with Texas!",
            business: "science",
        },
    ];

    beforeEach(() => {
        vi.useFakeTimers();
        // Reset store state before each test
        useFilterStore.setState({
            searchText: "",
            roleFilter: "",
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("initial state", () => {
        it("should return all residents when no filters are applied", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            expect(result.current.filteredResidents).toHaveLength(5);
        });

        it("should return empty searchText initially", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            expect(result.current.searchText).toBe("");
        });

        it("should return empty roleFilter initially", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            expect(result.current.roleFilter).toBe("");
        });
    });

    describe("search filtering", () => {
        it("should filter by resident name (case insensitive)", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("spongebob");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(1);
            expect(result.current.filteredResidents[0].name).toBe(
                "SpongeBob SquarePants"
            );
        });

        it("should filter by city (case insensitive)", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("texas");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(1);
            expect(result.current.filteredResidents[0].name).toBe("Sandy Cheeks");
        });

        it("should filter by email (case insensitive)", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("treedome");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(1);
            expect(result.current.filteredResidents[0].name).toBe("Sandy Cheeks");
        });

        it("should return multiple matches", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("bikini");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // All residents from Bikini Bottom (4 residents)
            expect(result.current.filteredResidents).toHaveLength(4);
        });

        it("should return empty array when no matches", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("plankton");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(0);
        });

        it("should debounce search text", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("sandy");
            });

            // Before debounce, should still show all
            expect(result.current.filteredResidents).toHaveLength(5);

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // After debounce, should be filtered
            expect(result.current.filteredResidents).toHaveLength(1);
        });
    });

    describe("role filtering", () => {
        it("should filter by company (case insensitive)", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setRoleFilter("krusty");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(3);
            expect(
                result.current.filteredResidents.every((r) =>
                    r.company.toLowerCase().includes("krusty")
                )
            ).toBe(true);
        });

        it("should filter by business (case insensitive)", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setRoleFilter("cooking");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(1);
            expect(result.current.filteredResidents[0].name).toBe(
                "SpongeBob SquarePants"
            );
        });

        it("should show all residents when role filter is cleared", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setRoleFilter("krusty");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(3);

            act(() => {
                result.current.setRoleFilter("");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(5);
        });

        it("should debounce role filter", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setRoleFilter("science");
            });

            // Before debounce, should still show all
            expect(result.current.filteredResidents).toHaveLength(5);

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // After debounce, should be filtered
            expect(result.current.filteredResidents).toHaveLength(1);
        });
    });

    describe("combined filtering", () => {
        it("should filter by both search and role", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("bikini");
                result.current.setRoleFilter("krusty");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Only Krusty Krab employees from Bikini Bottom
            expect(result.current.filteredResidents).toHaveLength(3);
        });

        it("should return empty when combined filters have no matches", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("texas");
                result.current.setRoleFilter("krusty");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Sandy is from Texas but works at Treedome Labs, not Krusty Krab
            expect(result.current.filteredResidents).toHaveLength(0);
        });

        it("should narrow results when adding second filter", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("krustykrab.com");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // 3 people have krustykrab.com email
            expect(result.current.filteredResidents).toHaveLength(3);

            act(() => {
                result.current.setRoleFilter("management");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Only Mr. Krabs is in management
            expect(result.current.filteredResidents).toHaveLength(1);
            expect(result.current.filteredResidents[0].name).toBe("Mr. Krabs");
        });
    });

    describe("setters", () => {
        it("should provide setSearchText function", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            expect(typeof result.current.setSearchText).toBe("function");

            act(() => {
                result.current.setSearchText("test");
            });

            expect(result.current.searchText).toBe("test");
        });

        it("should provide setRoleFilter function", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            expect(typeof result.current.setRoleFilter).toBe("function");

            act(() => {
                result.current.setRoleFilter("developer");
            });

            expect(result.current.roleFilter).toBe("developer");
        });
    });

    describe("edge cases", () => {
        it("should handle empty residents array", () => {
            const { result } = renderHook(() => useResidentFilter([]));

            expect(result.current.filteredResidents).toEqual([]);
        });

        it("should handle partial name match", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            act(() => {
                result.current.setSearchText("star");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(1);
            expect(result.current.filteredResidents[0].name).toBe("Patrick Star");
        });

        it("should match company OR business for role filter", () => {
            const { result } = renderHook(() => useResidentFilter(mockResidents));

            // "unemployed" matches Patrick's company
            act(() => {
                result.current.setRoleFilter("unemployed");
            });

            act(() => {
                vi.advanceTimersByTime(300);
            });

            expect(result.current.filteredResidents).toHaveLength(1);
            expect(result.current.filteredResidents[0].name).toBe("Patrick Star");
        });
    });
});
