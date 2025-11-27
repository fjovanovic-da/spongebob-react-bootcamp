import { useCallback, useEffect, useState } from "react";
import { httpClient } from "../api";
import { DEFAULT_ENDPOINT } from "../config";
import type { Resident, UseResidentsReturn } from "../types";

/**
 * Custom hook to fetch and manage residents data
 * @param endpoint - Optional API endpoint override
 * @returns Object containing residents, loading, error states and refetch function
 */
export function useResidents(
    endpoint: string = DEFAULT_ENDPOINT,
): UseResidentsReturn {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    // Refetch function that can be called to reload data
    const refetch = useCallback(() => {
        setRefetchTrigger((prev) => prev + 1);
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: refetchTrigger is intentionally excluded from dependencies
    useEffect(() => {
        let isMounted = true;

        const fetchResidents = async () => {
            try {
                setLoading(true);
                setError(null);

                const users = await httpClient.getUsers(endpoint);

                if (isMounted) {
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

                    setResidents(transformedResidents);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error ? err.message : "Failed to fetch residents",
                    );
                    setLoading(false);
                }
            }
        };

        fetchResidents();

        return () => {
            isMounted = false;
        };
    }, [endpoint, refetchTrigger]);

    return { residents, loading, error, refetch };
}
