import ResidentFilter from "../components/ResidentFilter";
import ResidentList from "../components/ResidentList";
import { useResidentFilter } from "../hooks/useResidentFilter";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import type { FavoritesBoardProps } from "../types";

function FavoritesBoard({ residents, loading, error }: FavoritesBoardProps) {
  // Use the Zustand favorites store
  const { favoriteCount, favorites } = useFavoritesStore();

  // Filter residents to only show favorites
  const favoriteResidents = residents.filter((resident) =>
    favorites.includes(resident.id)
  );

  // Use the custom filter hook on favorite residents
  const {
    filteredResidents,
    searchText,
    roleFilter,
    setSearchText,
    setRoleFilter,
  } = useResidentFilter(favoriteResidents);

  // Style classes
  const containerClasses =
    "welcome-board-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-base-content";
  const subtitleClasses = "text-center text-lg mb-4 text-base-content";

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>Your Favorites ⭐</h1>
      <p className={subtitleClasses}>Here are your favorites:</p>

      {/* Filter controls - only show if there are favorites */}
      {favoriteCount > 0 && (
        <ResidentFilter
          searchText={searchText}
          roleFilter={roleFilter}
          onSearchChange={setSearchText}
          onRoleChange={setRoleFilter}
        />
      )}

      {!loading && !error && favoriteCount === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold mb-2 text-base-content">
            No favorites yet!
          </h2>
          <p className="text-lg text-base-content">
            Start adding residents to your favorites from the home page.
          </p>
        </div>
      ) : (
        <ResidentList
          residents={filteredResidents}
          loading={loading}
          error={error}
          emptyMessage="No favorites found matching your filters."
          showFavoriteCount={true}
        />
      )}
    </div>
  );
}

export default FavoritesBoard;
