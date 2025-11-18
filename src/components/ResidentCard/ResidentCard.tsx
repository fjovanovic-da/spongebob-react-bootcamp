import type { ResidentCardProps } from "../types";
import "./ResidentCard.css";

function ResidentCard({
  resident,
  onFavorite,
  isFavorite = false,
}: ResidentCardProps) {
  const handleClick = () => {
    if (onFavorite) {
      onFavorite(resident.id);
    }
  };

  return (
    <div className="resident-card">
      {resident.imageUrl ? (
        <img src={resident.imageUrl} alt={resident.name} />
      ) : (
        <div className="resident-card-placeholder">
          {resident.emoji || "🦑"}
        </div>
      )}
      <h2>{resident.name}</h2>
      <p className="role">{resident.role}</p>
      <p>{resident.description}</p>
      {onFavorite && (
        <button onClick={handleClick}>
          {isFavorite ? "⭐ Remove from Favorites" : "☆ Add to Favorites"}
        </button>
      )}
    </div>
  );
}

export default ResidentCard;
