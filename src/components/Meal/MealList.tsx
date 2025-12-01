import { useEffect, useState } from "react";
import { ITEMS_PER_PAGE } from "../../config";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import type { MealListProps } from "../../types";
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
        <span className="loading loading-spinner loading-md"></span>
        <span className="text-lg font-semibold">Loading meals... 🍔</span>
      </div>
    );
  }

  // Show error state if fetch fails
  if (error) {
    return (
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
