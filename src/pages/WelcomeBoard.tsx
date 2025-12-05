import { motion } from "framer-motion";
import { ResidentFilter, ResidentList } from "../components/Resident";
import { useResidentFilter, useResidents } from "../hooks";
import { containerVariants, itemVariants } from "../utils/animations";

function WelcomeBoard() {
  const { residents, loading, error } = useResidents();
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
    <motion.div
      className={containerClasses}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className={headingClasses} variants={itemVariants}>
        Welcome to Bikini Bottom! 🌊
      </motion.h1>
      <motion.p className={subtitleClasses} variants={itemVariants}>
        Meet the residents:
      </motion.p>

      <motion.div variants={itemVariants}>
        <ResidentFilter
          searchText={searchText}
          roleFilter={roleFilter}
          onSearchChange={setSearchText}
          onRoleChange={setRoleFilter}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ResidentList
          residents={filteredResidents}
          loading={loading}
          error={error}
          emptyMessage="No residents found matching your filters."
        />
      </motion.div>
    </motion.div>
  );
}

export default WelcomeBoard;
