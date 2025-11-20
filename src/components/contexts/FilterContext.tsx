import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEY } from "../../config";
import type { FilterContextType } from "../types";

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage
  const [searchText, setSearchTextState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.searchText || "";
      }
    } catch {
      // Ignore errors
    }
    return "";
  });

  const [roleFilter, setRoleFilterState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.roleFilter || "";
      }
    } catch {
      // Ignore errors
    }
    return "";
  });

  // Persist to localStorage whenever filters change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ searchText, roleFilter })
      );
    } catch {
      // Ignore errors
    }
  }, [searchText, roleFilter]);

  const setSearchText = (text: string) => {
    setSearchTextState(text);
  };

  const setRoleFilter = (role: string) => {
    setRoleFilterState(role);
  };

  return (
    <FilterContext.Provider
      value={{ searchText, roleFilter, setSearchText, setRoleFilter }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
}
