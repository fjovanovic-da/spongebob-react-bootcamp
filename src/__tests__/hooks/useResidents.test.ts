import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useResidents } from "../../hooks/useResidents";
import { useResidentsStore } from "../../stores";
import type { Resident } from "../../types";

// Mock the httpClient
vi.mock("../../api", () => ({
    httpClient: {
        get: vi.fn(),
    },
}));

describe("useResidents", () => {
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
    ];

    beforeEach(() => {
        // Reset store state before each test
        useResidentsStore.setState({
            residents: [],
            loading: false,
            error: null,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("initial state", () => {
        it("should return initial state from store", () => {
            // Mock fetchResidents to prevent actual fetch
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                residents: [],
                loading: false,
                error: null,
                fetchResidents: mockFetchResidents,
            });

            const { result } = renderHook(() => useResidents());

            expect(result.current.residents).toEqual([]);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBeNull();
        });

        it("should call fetchResidents on mount", () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                fetchResidents: mockFetchResidents,
            });

            renderHook(() => useResidents());

            expect(mockFetchResidents).toHaveBeenCalledTimes(1);
        });
    });

    describe("loading state", () => {
        it("should reflect loading state from store", () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                residents: [],
                loading: true,
                error: null,
                fetchResidents: mockFetchResidents,
            });

            const { result } = renderHook(() => useResidents());

            expect(result.current.loading).toBe(true);
        });

        it("should update when loading state changes", async () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                residents: [],
                loading: true,
                error: null,
                fetchResidents: mockFetchResidents,
            });

            const { result } = renderHook(() => useResidents());

            expect(result.current.loading).toBe(true);

            act(() => {
                useResidentsStore.setState({ loading: false });
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });
    });

    describe("residents data", () => {
        it("should return residents from store", () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                residents: mockResidents,
                loading: false,
                error: null,
                fetchResidents: mockFetchResidents,
            });

            const { result } = renderHook(() => useResidents());

            expect(result.current.residents).toEqual(mockResidents);
            expect(result.current.residents).toHaveLength(3);
        });

        it("should update when residents change in store", async () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                residents: [],
                loading: false,
                error: null,
                fetchResidents: mockFetchResidents,
            });

            const { result } = renderHook(() => useResidents());

            expect(result.current.residents).toEqual([]);

            act(() => {
                useResidentsStore.setState({ residents: mockResidents });
            });

            await waitFor(() => {
                expect(result.current.residents).toEqual(mockResidents);
            });
        });
    });

    describe("error state", () => {
        it("should return error from store", () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                residents: [],
                loading: false,
                error: "Failed to fetch residents",
                fetchResidents: mockFetchResidents,
            });

            const { result } = renderHook(() => useResidents());

            expect(result.current.error).toBe("Failed to fetch residents");
        });

        it("should update when error state changes", async () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                residents: [],
                loading: false,
                error: null,
                fetchResidents: mockFetchResidents,
            });

            const { result } = renderHook(() => useResidents());

            expect(result.current.error).toBeNull();

            act(() => {
                useResidentsStore.setState({ error: "Network error" });
            });

            await waitFor(() => {
                expect(result.current.error).toBe("Network error");
            });
        });

        it("should clear error when new fetch succeeds", async () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                residents: [],
                loading: false,
                error: "Previous error",
                fetchResidents: mockFetchResidents,
            });

            const { result } = renderHook(() => useResidents());

            expect(result.current.error).toBe("Previous error");

            act(() => {
                useResidentsStore.setState({
                    residents: mockResidents,
                    error: null,
                });
            });

            await waitFor(() => {
                expect(result.current.error).toBeNull();
                expect(result.current.residents).toEqual(mockResidents);
            });
        });
    });

    describe("return value structure", () => {
        it("should return object with residents, loading, and error", () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                residents: mockResidents,
                loading: false,
                error: null,
                fetchResidents: mockFetchResidents,
            });

            const { result } = renderHook(() => useResidents());

            expect(result.current).toHaveProperty("residents");
            expect(result.current).toHaveProperty("loading");
            expect(result.current).toHaveProperty("error");
            expect(Object.keys(result.current)).toHaveLength(3);
        });
    });

    describe("fetchResidents behavior", () => {
        it("should not call fetchResidents again on re-render if reference is stable", () => {
            const mockFetchResidents = vi.fn();
            useResidentsStore.setState({
                fetchResidents: mockFetchResidents,
            });

            const { rerender } = renderHook(() => useResidents());

            expect(mockFetchResidents).toHaveBeenCalledTimes(1);

            rerender();

            // Should still be 1 because fetchResidents reference is stable
            expect(mockFetchResidents).toHaveBeenCalledTimes(1);
        });
    });
});
