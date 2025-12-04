import { beforeEach, describe, expect, it, vi } from "vitest";
import { useResidentsStore } from "../../stores/useResidentsStore";
import type { User } from "../../types";

// Mock the httpClient
vi.mock("../../api", () => ({
    httpClient: {
        getUsers: vi.fn(),
    },
}));

// Mock the config
vi.mock("../../config", () => ({
    DEFAULT_ENDPOINT: "https://api.example.com/users",
}));

// Import the mocked httpClient
import { httpClient } from "../../api";

const mockUsers: User[] = [
    {
        id: 1,
        name: "SpongeBob SquarePants",
        email: "spongebob@krustykrab.com",
        username: "spongebob",
        address: {
            city: "Bikini Bottom",
        },
        company: {
            name: "Krusty Krab",
            catchPhrase: "I'm ready!",
            bs: "fry cooking",
        },
    },
    {
        id: 2,
        name: "Patrick Star",
        email: "patrick@rock.com",
        username: "patrick",
        address: {
            city: "Bikini Bottom",
        },
        company: {
            name: "Unemployed",
            catchPhrase: "Is mayonnaise an instrument?",
            bs: "sleeping",
        },
    },
];

describe("useResidentsStore", () => {
    beforeEach(() => {
        // Reset store state before each test
        useResidentsStore.setState({
            residents: [],
            loading: false,
            error: null,
            hasFetched: false,
        });
        // Clear all mocks
        vi.clearAllMocks();
    });

    describe("initial state", () => {
        it("should have empty residents array", () => {
            const { residents } = useResidentsStore.getState();
            expect(residents).toEqual([]);
        });

        it("should have loading as false", () => {
            const { loading } = useResidentsStore.getState();
            expect(loading).toBe(false);
        });

        it("should have error as null", () => {
            const { error } = useResidentsStore.getState();
            expect(error).toBeNull();
        });

        it("should have hasFetched as false", () => {
            const { hasFetched } = useResidentsStore.getState();
            expect(hasFetched).toBe(false);
        });
    });

    describe("fetchResidents", () => {
        it("should fetch residents successfully", async () => {
            vi.mocked(httpClient.getUsers).mockResolvedValue(mockUsers);

            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents();

            const { residents, loading, error, hasFetched } =
                useResidentsStore.getState();
            expect(residents).toHaveLength(2);
            expect(loading).toBe(false);
            expect(error).toBeNull();
            expect(hasFetched).toBe(true);
        });

        it("should transform users to residents correctly", async () => {
            vi.mocked(httpClient.getUsers).mockResolvedValue(mockUsers);

            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents();

            const { residents } = useResidentsStore.getState();
            const spongebob = residents[0];

            expect(spongebob.id).toBe("1");
            expect(spongebob.name).toBe("SpongeBob SquarePants");
            expect(spongebob.email).toBe("spongebob@krustykrab.com");
            expect(spongebob.city).toBe("Bikini Bottom");
            expect(spongebob.company).toBe("Krusty Krab");
            expect(spongebob.catchphrase).toBe("I'm ready!");
            expect(spongebob.business).toBe("fry cooking");
            expect(spongebob.emoji).toBe("🧑");
        });

        it("should use default endpoint when none provided", async () => {
            vi.mocked(httpClient.getUsers).mockResolvedValue([]);

            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents();

            expect(httpClient.getUsers).toHaveBeenCalledWith(
                "https://api.example.com/users"
            );
        });

        it("should use custom endpoint when provided", async () => {
            vi.mocked(httpClient.getUsers).mockResolvedValue([]);

            const customEndpoint = "https://custom.api.com/residents";
            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents(customEndpoint);

            expect(httpClient.getUsers).toHaveBeenCalledWith(customEndpoint);
        });

        it("should set loading to true while fetching", async () => {
            let loadingDuringFetch = false;

            vi.mocked(httpClient.getUsers).mockImplementation(async () => {
                loadingDuringFetch = useResidentsStore.getState().loading;
                return mockUsers;
            });

            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents();

            expect(loadingDuringFetch).toBe(true);
            expect(useResidentsStore.getState().loading).toBe(false);
        });

        it("should not fetch if already fetched", async () => {
            vi.mocked(httpClient.getUsers).mockResolvedValue(mockUsers);

            // First fetch
            await useResidentsStore.getState().fetchResidents();

            // Second fetch should be skipped
            await useResidentsStore.getState().fetchResidents();

            expect(httpClient.getUsers).toHaveBeenCalledTimes(1);
        });

        it("should not fetch if currently loading", async () => {
            // Set loading to true manually
            useResidentsStore.setState({ loading: true });

            vi.mocked(httpClient.getUsers).mockResolvedValue(mockUsers);

            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents();

            expect(httpClient.getUsers).not.toHaveBeenCalled();
        });

        it("should handle errors gracefully", async () => {
            const errorMessage = "Network error";
            vi.mocked(httpClient.getUsers).mockRejectedValue(
                new Error(errorMessage)
            );

            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents();

            const { residents, loading, error, hasFetched } =
                useResidentsStore.getState();
            expect(residents).toEqual([]);
            expect(loading).toBe(false);
            expect(error).toBe(errorMessage);
            expect(hasFetched).toBe(false);
        });

        it("should handle non-Error exceptions", async () => {
            vi.mocked(httpClient.getUsers).mockRejectedValue("Unknown error");

            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents();

            const { error } = useResidentsStore.getState();
            expect(error).toBe("Failed to fetch residents");
        });

        it("should clear previous error on new fetch attempt", async () => {
            // First, set an error state
            useResidentsStore.setState({ error: "Previous error" });

            vi.mocked(httpClient.getUsers).mockResolvedValue(mockUsers);

            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents();

            const { error } = useResidentsStore.getState();
            expect(error).toBeNull();
        });

        it("should convert numeric id to string", async () => {
            const userWithNumericId: User[] = [
                {
                    id: 12345,
                    name: "Test User",
                    email: "test@test.com",
                    username: "testuser",
                    address: { city: "Test City" },
                    company: { name: "Test Co", catchPhrase: "Test", bs: "testing" },
                },
            ];

            vi.mocked(httpClient.getUsers).mockResolvedValue(userWithNumericId);

            const { fetchResidents } = useResidentsStore.getState();
            await fetchResidents();

            const { residents } = useResidentsStore.getState();
            expect(residents[0].id).toBe("12345");
            expect(typeof residents[0].id).toBe("string");
        });
    });
});
