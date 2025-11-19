import { useMemo, useState } from "react";
import type { Resident, UseResidentFilterReturn } from "../types";

/**
 * Custom hook to filter residents by search text and role
 * @param residents - Array of residents to filter
 * @returns Object containing filtered residents, filter states, and setters
 */
export function useResidentFilter(residents: Resident[]): UseResidentFilterReturn {
    const [searchText, setSearchText] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const filteredResidents = useMemo(() => {
        return residents.filter((resident) => {
            // Filter by search text (name, city, email)
            const matchesSearch =
                searchText === "" ||
                resident.name.toLowerCase().includes(searchText.toLowerCase()) ||
                resident.city.toLowerCase().includes(searchText.toLowerCase()) ||
                resident.email.toLowerCase().includes(searchText.toLowerCase());

            // Filter by role (company,business)
            const matchesRole =
                roleFilter === "" ||
                resident.company.toLowerCase().includes(roleFilter.toLowerCase()) ||
                resident.business.toLowerCase().includes(roleFilter.toLowerCase());

            return matchesSearch && matchesRole;
        });
    }, [residents, searchText, roleFilter]);

    return {
        filteredResidents,
        searchText,
        roleFilter,
        setSearchText,
        setRoleFilter,
    };
}
