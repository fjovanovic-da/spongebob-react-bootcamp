import { create } from "zustand";
import { httpClient } from "../api";
import { DEFAULT_ENDPOINT } from "../config";
import type { Resident, ResidentsState } from "../types";

export const useResidentsStore = create<ResidentsState>((set, get) => ({
    residents: [],
    loading: false,
    error: null,
    hasFetched: false,

    fetchResidents: async (endpoint: string = DEFAULT_ENDPOINT) => {
        // Skip if already fetched or currently loading
        if (get().hasFetched || get().loading) {
            return;
        }

        try {
            set({ loading: true, error: null });

            const users = await httpClient.getUsers(endpoint);

            // Transform API users into our Resident format
            const transformedResidents: Resident[] = users.map((user) => ({
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                city: user.address.city,
                company: user.company.name,
                catchphrase: user.company.catchPhrase,
                business: user.company.bs,
                emoji: "🧑",
            }));

            set({ residents: transformedResidents, hasFetched: true });
        } catch (err) {
            set({
                error:
                    err instanceof Error ? err.message : "Failed to fetch residents",
            });
        } finally {
            set({ loading: false });
        }
    },
}));
