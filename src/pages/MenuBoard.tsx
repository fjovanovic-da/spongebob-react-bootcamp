import MealFilter from "../components/Meal/MealFilter";
import MealList from "../components/Meal/MealList";
import { useMealFilter } from "../hooks/useMealFilter";
import type { MenuBoardProps } from "../types";

function MenuBoard({ meals, loading, error }: MenuBoardProps) {
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
  } = useMealFilter(meals);

  const containerClasses =
    "menu-board-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-base-content";
  const subtitleClasses = "text-center text-lg mb-8 text-base-content";

  return (
    <div className={containerClasses}>
      <h1 className={headingClasses}>🍔 Krusty Krab Menu</h1>
      <p className={subtitleClasses}>
        Browse our delicious meals from around the world!
      </p>

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

      <MealList
        meals={filteredMeals}
        loading={loading}
        error={error}
        emptyMessage="No meals found."
        showFavoriteCount={true}
      />
    </div>
  );
}

export default MenuBoard;
