import { useFavoritesStore } from "../stores/useFavoritesStore";
import type { ResidentListProps } from "../types";
import ResidentCard from "./ResidentCard";

function ResidentList({
  residents,
  loading,
  error,
  emptyMessage = "No residents found matching your filters.",
  showFavoriteCount = false,
}: ResidentListProps) {
  const { toggleFavorite, isFavorite, favoriteCount } = useFavoritesStore();

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="alert alert-info my-8">
        <span className="loading loading-spinner loading-md"></span>
        <span className="text-lg font-semibold">Loading residents... 🌊</span>
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

  // Show residents grid when data is loaded and no error
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
        {residents.length > 0 ? (
          residents.map((resident) => (
            <ResidentCard
              key={resident.id}
              resident={resident}
              onFavorite={toggleFavorite}
              isFavorite={isFavorite(resident.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-lg py-8 text-base-content">
            {emptyMessage}
          </div>
        )}
      </div>
    </>
  );
}

export default ResidentList;
