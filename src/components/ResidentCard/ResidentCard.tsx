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
      <p className="business">{resident.business}</p>
      <p className="catchphrase">{resident.catchphrase}</p>
      <p className="city">📍 {resident.city}</p>
      <p className="company">🏢 {resident.company}</p>
      <p className="email">{resident.email}</p>
      {onFavorite && (
        <button type="button" onClick={handleClick}>
          {isFavorite ? "⭐ Remove from Favorites" : "☆ Add to Favorites"}
        </button>
      )}
    </div>
  );
}

export default ResidentCard;
