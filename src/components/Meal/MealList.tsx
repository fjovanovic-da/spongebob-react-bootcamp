import { useEffect, useState } from "react";
import { ITEMS_PER_PAGE } from "../../config";
import { useFavoritesStore } from "../../stores";
import type { MealListProps } from "../../types";
import { LoadingSpinner } from "../common";
import { ErrorIcon } from "../icons";
import Pagination from "../Pagination";
import MealCard from "./MealCard";

function MealList({
  meals,
  loading,
  error,
  emptyMessage = "No meals found.",
  showFavoriteCount = false,
}: MealListProps) {
  const { toggleFavorite, isFavorite, favoriteCount } = useFavoritesStore();
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(meals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMeals = meals.slice(startIndex, endIndex);

  // Reset to page 1 when meals change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when meals list changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only reset when count changes
  useEffect(() => {
    setCurrentPage(1);
  }, [meals.length]);
  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="alert alert-info my-8">
        <LoadingSpinner size="md" />
        <span className="text-lg font-semibold">Loading meals... 🍔</span>
      </div>
    );
  }

  // Show error state if fetch fails
  if (error) {
    return (
      <div className="alert alert-error my-8">
        <ErrorIcon />
        <div>
          <div className="font-semibold">⚠️ Error: {error}</div>
          <div className="text-sm">Please try refreshing the page.</div>
        </div>
      </div>
    );
  }

  // Show meals grid when data is loaded and no error
  return (
    <>
      {showFavoriteCount && favoriteCount > 0 && (
        <div className="w-full bg-accent text-primary-content py-3 px-4 mb-8 rounded text-center font-semibold">
          You have {favoriteCount} favorite
          {favoriteCount > 1 ? "s" : ""}! ⭐
        </div>
      )}
      <div
        className="mb-8 min-h-[300px]"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {meals.length > 0 ? (
          currentMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onFavorite={toggleFavorite}
              isFavorite={isFavorite(meal.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-lg py-8 text-base-content">
            {emptyMessage}
          </div>
        )}
      </div>

      {meals.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={meals.length}
        />
      )}
    </>
  );
}

export default MealList;
