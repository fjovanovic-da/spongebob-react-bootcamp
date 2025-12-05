import { motion } from "framer-motion";
import { MealFilter, MealList } from "../components/Meal";
import { useMealFilter, useMeals } from "../hooks";
import { containerVariants, itemVariants } from "../utils/animations";

function MenuBoard() {
  const { meals, loading, error } = useMeals();
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
    <motion.div
      className={containerClasses}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className={headingClasses} variants={itemVariants}>
        🍔 Krusty Krab Menu
      </motion.h1>
      <motion.p className={subtitleClasses} variants={itemVariants}>
        Browse our delicious meals from around the world!
      </motion.p>

      <motion.div variants={itemVariants}>
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
      </motion.div>

      <motion.div variants={itemVariants}>
        <MealList
          meals={filteredMeals}
          loading={loading}
          error={error}
          emptyMessage="No meals found."
          showFavoriteCount={true}
        />
      </motion.div>
    </motion.div>
  );
}

export default MenuBoard;
