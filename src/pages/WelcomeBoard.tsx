import ResidentFilter from "../components/Resident/ResidentFilter";
import ResidentList from "../components/Resident/ResidentList";
import { useResidentFilter } from "../hooks/useResidentFilter";
import type { WelcomeBoardProps } from "../types";

function WelcomeBoard({ residents, loading, error }: WelcomeBoardProps) {
  // Use the custom filter hook
  const {
    filteredResidents,
    searchText,
    roleFilter,
    setSearchText,
    setRoleFilter,
  } = useResidentFilter(residents);

  // Style classes
  const containerClasses =
    "welcome-board-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-base-content";
  const subtitleClasses = "text-center text-lg mb-4 text-base-content";

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>Welcome to Bikini Bottom! 🌊</h1>
      <p className={subtitleClasses}>Meet the residents:</p>

      <ResidentFilter
        searchText={searchText}
        roleFilter={roleFilter}
        onSearchChange={setSearchText}
        onRoleChange={setRoleFilter}
      />

      <ResidentList
        residents={filteredResidents}
        loading={loading}
        error={error}
        emptyMessage="No residents found matching your filters."
        showFavoriteCount={true}
      />
    </div>
  );
}

export default WelcomeBoard;
