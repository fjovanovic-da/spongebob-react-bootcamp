import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useResidentFilter } from "../hooks/useResidentFilter";
import { useResidents } from "../hooks/useResidents";
import ResidentCard from "../ResidentCard/ResidentCard";

function WelcomeBoard() {
  // Use the custom residents hook
  const { residents, loading, error } = useResidents();
  // Use the Zustand favorites store
  const { toggleFavorite, isFavorite, favoriteCount } = useFavoritesStore();
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
  const filterInputClasses =
    "input flex-1 min-w-[200px] h-10 bg-base-100 text-base-content border-2 border-base-300 px-4 rounded focus:outline-none focus:border-primary transition-colors";

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>Welcome to Bikini Bottom! 🌊</h1>
      <p className={subtitleClasses}>Meet the residents:</p>

      {/* Filter controls */}
      <div className="flex gap-4 my-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, city, email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={filterInputClasses}
        />
        <input
          type="text"
          placeholder="Filter by company, business..."
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className={filterInputClasses}
        />
      </div>

      {/* Show loading state while fetching data */}
      {loading && (
        <div className="alert alert-info my-8">
          <span className="loading loading-spinner loading-md"></span>
          <span className="text-lg font-semibold">Loading residents... 🌊</span>
        </div>
      )}

      {/* Show error state if fetch fails */}
      {error && (
        <div className="alert alert-error my-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <title>Error icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <div className="font-semibold">⚠️ Error: {error}</div>
            <div className="text-sm">Please try refreshing the page.</div>
          </div>
        </div>
      )}

      {/* Show residents grid when data is loaded and no error */}
      {!loading && !error && (
        <>
          {favoriteCount > 0 && (
            <div className="w-full bg-accent text-info-content py-3 px-4 mb-8 rounded text-center font-semibold">
              You have {favoriteCount} favorite
              {favoriteCount > 1 ? "s" : ""}! ⭐
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 min-h-[300px]">
            {filteredResidents.length > 0 ? (
              filteredResidents.map((resident) => (
                <ResidentCard
                  key={resident.id}
                  resident={resident}
                  onFavorite={toggleFavorite}
                  isFavorite={isFavorite(resident.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-lg py-8 text-base-content">
                No residents found matching your filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default WelcomeBoard;
