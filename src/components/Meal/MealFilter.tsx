import type { MealFilterProps } from "../../types";

function MealFilter({
  searchText,
  categoryFilter,
  originFilter,
  onSearchChange,
  onCategoryChange,
  onOriginChange,
  availableCategories,
  availableOrigins,
}: MealFilterProps) {
  const filterInputClasses =
    "input flex-1 min-w-[200px] h-10 bg-base-100 text-base-content border-2 border-base-300 px-4 rounded focus:outline-none focus:border-primary transition-colors";

  const selectClasses =
    "select flex-1 min-w-[200px] h-10 bg-base-100 text-base-content border-2 border-base-300 px-4 rounded focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="flex gap-4 my-6 flex-wrap">
      <input
        type="text"
        placeholder="Search by name or ingredients..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className={filterInputClasses}
      />
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={selectClasses}
      >
        <option value="">All Categories</option>
        {availableCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        value={originFilter}
        onChange={(e) => onOriginChange(e.target.value)}
        className={selectClasses}
      >
        <option value="">All Origins</option>
        {availableOrigins.map((origin) => (
          <option key={origin} value={origin}>
            {origin}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MealFilter;
