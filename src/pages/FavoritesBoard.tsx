import { MealFilter, MealList } from "../components/Meal";
import { useMealFilter } from "../hooks";
import { useFavoritesStore } from "../stores";
import type { FavoritesBoardProps } from "../types";

function FavoritesBoard({ meals, loading, error }: FavoritesBoardProps) {
  // Use the Zustand favorites store
  const { favoriteCount, favorites } = useFavoritesStore();

  // Filter meals to only show favorites
  const favoriteMeals = meals.filter((meal) => favorites.includes(meal.id));

  // Use the custom filter hook on favorite meals
  const {
    filteredMeals,
    searchText,
    categoryFilter,
    originFilter,
    setSearchText,
    setCategoryFilter,
    setOriginFilter,
    availableCategories,
    availableOrigins,
  } = useMealFilter(favoriteMeals);

  // Style classes
  const containerClasses =
    "welcome-board-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-base-content";
  const subtitleClasses = "text-center text-lg mb-4 text-base-content";

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>Your Favorites ⭐</h1>
      <p className={subtitleClasses}>Here are your favorite meals:</p>

      {/* Filter controls - only show if there are favorites */}
      {favoriteCount > 0 && (
        <MealFilter
          searchText={searchText}
          categoryFilter={categoryFilter}
          originFilter={originFilter}
          onSearchChange={setSearchText}
          onCategoryChange={setCategoryFilter}
          onOriginChange={setOriginFilter}
          availableCategories={availableCategories}
          availableOrigins={availableOrigins}
        />
      )}

      {!loading && !error && favoriteCount === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold mb-2 text-base-content">
            No favorites yet!
          </h2>
          <p className="text-lg text-base-content">
            Start adding meals to your favorites from the menu page.
          </p>
        </div>
      ) : (
        <MealList
          meals={filteredMeals}
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
