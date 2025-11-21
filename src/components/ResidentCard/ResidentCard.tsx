import type { ResidentCardProps } from "../../types";

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

  const cardClasses =
    "card bg-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 border-2 border-gray-200 hover:border-purple-500 overflow-hidden rounded-2xl p-6";
  const imageContainerClasses =
    "w-full h-48 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center rounded-2xl";

  return (
    <div className={cardClasses}>
      {resident.imageUrl ? (
        <figure className={`${imageContainerClasses} p-8`}>
          <img
            src={resident.imageUrl}
            alt={resident.name}
            className="w-32 h-32 object-contain"
          />
        </figure>
      ) : (
        <div className={`${imageContainerClasses} text-8xl p-8`}>
          {resident.emoji || "🦑"}
        </div>
      )}
      <div className="card-body items-start text-left p-4 pt-2 pb-2">
        <h2 className="card-title text-2xl font-bold text-gray-800 mb-2 w-full text-center">
          {resident.name}
        </h2>
        <div className="w-full flex justify-start">
          <span className="text-indigo-600 text-sm font-semibold uppercase tracking-wide">
            {resident.business}
          </span>
        </div>
        <p className="text-gray-500 italic mt-2 mb-1 w-full text-left">
          {resident.catchphrase}
        </p>
        <div className="w-full text-left space-y-2 mt-2">
          <p className="text-gray-700 font-medium">📍 {resident.city}</p>
          <p className="text-gray-700 font-medium">🏢 {resident.company}</p>
          <p className="text-gray-500 text-sm">{resident.email}</p>
        </div>
        {onFavorite && (
          <div className="card-actions w-full mt-4">
            <button
              type="button"
              onClick={handleClick}
              className={`btn w-full h-12 text-white border-0 rounded-lg ${
                isFavorite
                  ? "!bg-red-500 hover:!bg-red-600"
                  : "!bg-yellow-500 hover:!bg-yellow-600"
              }`}
            >
              {isFavorite ? "⭐ Remove from Favorites" : "☆ Add to Favorites"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResidentCard;
