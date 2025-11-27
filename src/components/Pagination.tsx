/** biome-ignore-all lint/suspicious/noArrayIndexKey: using index as key for static ellipsis elements */
import type { PaginationProps } from "../types";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8 mb-4">
      {/* Items info */}
      <div className="text-sm text-base-content font-medium">
        Showing <span className="font-bold text-primary">{startItem}</span> to{" "}
        <span className="font-bold text-primary">{endItem}</span> of{" "}
        <span className="font-bold text-primary">{totalItems}</span> items
      </div>

      {/* Pagination controls */}
      <div className="join shadow-lg">
        <button
          type="button"
          className="join-item btn btn-sm btn-primary hover:btn-secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <button
                key={`ellipsis-${currentPage}-${index}`}
                type="button"
                className="join-item btn btn-sm btn-disabled"
              >
                ...
              </button>
            );
          }

          return (
            <button
              key={page}
              type="button"
              className={`join-item btn btn-sm ${
                currentPage === page
                  ? "btn-primary font-bold"
                  : "btn-ghost hover:btn-secondary"
              }`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          className="join-item btn btn-sm btn-primary hover:btn-secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
}

export default Pagination;
