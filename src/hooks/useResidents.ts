import { useEffect } from "react";
import { useResidentsStore } from "../stores";
import type { UseResidentsReturn } from "../types";

/**
 * Custom hook to fetch and manage residents data
 * @returns Object containing residents, loading, error states
 */
export function useResidents(): UseResidentsReturn {
    const residents = useResidentsStore((state) => state.residents);
    const loading = useResidentsStore((state) => state.loading);
    const error = useResidentsStore((state) => state.error);
    const fetchResidents = useResidentsStore((state) => state.fetchResidents);

    useEffect(() => {
        fetchResidents();
    }, [fetchResidents]);

    return { residents, loading, error };
}
