import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MealFilter, MealList } from "../components/Meal";
import Pagination from "../components/Pagination";
import { ITEMS_PER_PAGE } from "../config";
import { useMealFilter, useMeals } from "../hooks";
import { useFavoritesStore } from "../stores";
import {
  containerVariants,
  emptyStateVariants,
  itemVariants,
} from "../utils/animations";

function FavoritesBoard() {
  const { meals, loading, error } = useMeals();
  // Use the Zustand favorites store
  const { favoriteCount, favorites } = useFavoritesStore();
  const [currentPage, setCurrentPage] = useState(1);

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE);

  // Reset to page 1 when favorites change or adjust if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedMeals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMeals, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleOriginChange = (origin: string) => {
    setOriginFilter(origin);
    setCurrentPage(1);
  };

  // Style classes
  const containerClasses =
    "welcome-board-container max-w-7xl mx-auto p-8 rounded-3xl shadow-2xl bg-base-200";
  const headingClasses =
    "text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-base-content";
  const subtitleClasses = "text-center text-lg mb-4 text-base-content";

  return (
    <motion.div
      className={containerClasses}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className={headingClasses} variants={itemVariants}>
        Your Favorites ⭐
      </motion.h1>
      <motion.p className={subtitleClasses} variants={itemVariants}>
        Here are your favorite meals:
      </motion.p>

      {/* Filter controls - only show if there are favorites */}
      {favoriteCount > 0 && (
        <motion.div variants={itemVariants}>
          <MealFilter
            searchText={searchText}
            categoryFilter={categoryFilter}
            originFilter={originFilter}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onOriginChange={handleOriginChange}
            availableCategories={availableCategories}
            availableOrigins={availableOrigins}
          />
        </motion.div>
      )}

      {!loading && !error && favoriteCount === 0 ? (
        <motion.div
          className="text-center py-12"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }}
          >
            ⭐
          </motion.div>
          <h2 className="text-2xl font-bold mb-2 text-base-content">
            No favorites yet!
          </h2>
          <p className="text-lg text-base-content">
            Start adding meals to your favorites from the menu page.
          </p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <MealList
            meals={paginatedMeals}
            loading={loading}
            error={error}
            emptyMessage="No favorites found matching your filters."
            showFavoriteCount={true}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredMeals.length}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export default FavoritesBoard;
