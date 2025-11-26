import type { ResidentFilterProps } from "../types";

function ResidentFilter({
  searchText,
  roleFilter,
  onSearchChange,
  onRoleChange,
}: ResidentFilterProps) {
  const filterInputClasses =
    "input flex-1 min-w-[200px] h-10 bg-base-100 text-base-content border-2 border-base-300 px-4 rounded focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="flex gap-4 my-6 flex-wrap">
      <input
        type="text"
        placeholder="Search by name, city, email..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className={filterInputClasses}
      />
      <input
        type="text"
        placeholder="Filter by company, business..."
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value)}
        className={filterInputClasses}
      />
    </div>
  );
}

export default ResidentFilter;
