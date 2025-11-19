import "./WelcomeBoard.css";
import { useFavorites } from "../hooks/useFavorites";
import { useResidents } from "../hooks/useResidents";
import ResidentCard from "../ResidentCard/ResidentCard";

function WelcomeBoard() {
  // Use the custom residents hook
  const { residents, loading, error } = useResidents();
  // Use the custom favorites hook
  const { toggleFavorite, isFavorite, favoriteCount } = useFavorites();

  return (
    <div className="welcome-board">
      <h1>Welcome to Bikini Bottom! 🌊</h1>
      <p>Meet the residents:</p>

      {/* Show loading state while fetching data */}
      {loading && (
        <div className="loading-state">
          <p>Loading residents... 🌊</p>
        </div>
      )}

      {/* Show error state if fetch fails */}
      {error && (
        <div className="error-state">
          <p>⚠️ Error: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      )}

      {/* Show residents grid when data is loaded and no error */}
      {!loading && !error && (
        <>
          {favoriteCount > 0 && (
            <div className="favorites-footer">
              You have {favoriteCount} favorite
              {favoriteCount > 1 ? "s" : ""}! ⭐
            </div>
          )}
          <div className="residents-grid">
            {residents.map((resident) => (
              <ResidentCard
                key={resident.id}
                resident={resident}
                onFavorite={toggleFavorite}
                isFavorite={isFavorite(resident.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default WelcomeBoard;
