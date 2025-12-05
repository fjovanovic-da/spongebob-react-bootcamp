import { useMemo } from "react";
import { useFilterStore } from "../stores";
import type { Resident, UseResidentFilterReturn } from "../types";
import { useDebounce } from "./useDebounce";

/**
 * Custom hook to filter residents by search text and role
 * @param residents - Array of residents to filter
 * @returns Object containing filtered residents, filter states, and setters
 */
export function useResidentFilter(
  residents: Resident[],
): UseResidentFilterReturn {
  const { searchText, roleFilter, setSearchText, setRoleFilter } =
    useFilterStore();

  // Debounce both search text and role filter
  const debouncedSearchText = useDebounce(searchText, 300);
  const debouncedRoleFilter = useDebounce(roleFilter, 300);

  const filteredResidents = useMemo(() => {
    return residents.filter((resident) => {
      // Filter by search text (name, city, email)
      const matchesSearch =
        debouncedSearchText === "" ||
        resident.name
          .toLowerCase()
          .includes(debouncedSearchText.toLowerCase()) ||
        resident.city
          .toLowerCase()
          .includes(debouncedSearchText.toLowerCase()) ||
        resident.email
          .toLowerCase()
          .includes(debouncedSearchText.toLowerCase());

      // Filter by role (company,business)
      const matchesRole =
        debouncedRoleFilter === "" ||
        resident.company
          .toLowerCase()
          .includes(debouncedRoleFilter.toLowerCase()) ||
        resident.business
          .toLowerCase()
          .includes(debouncedRoleFilter.toLowerCase());

      return matchesSearch && matchesRole;
    });
  }, [residents, debouncedSearchText, debouncedRoleFilter]);

  return {
    filteredResidents,
    searchText,
    roleFilter,
    setSearchText,
    setRoleFilter,
  };
}
