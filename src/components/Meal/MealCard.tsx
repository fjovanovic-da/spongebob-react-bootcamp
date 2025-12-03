import { motion } from "framer-motion";
import type { MealCardProps } from "../../types";
import { buttonHoverTap } from "../../utils/animations";

function MealCard({ meal, onFavorite, isFavorite = false }: MealCardProps) {
  const handleClick = () => {
    if (onFavorite) {
      onFavorite(meal.id);
    }
  };

  const cardClasses =
    "card bg-base-100 shadow-xl transition-colors duration-200 border-2 border-base-300 hover:border-primary overflow-hidden rounded-2xl p-6";
  const imageContainerClasses =
    "w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center rounded-2xl";

  return (
    <motion.div
      className={cardClasses}
      whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      transition={{ duration: 0.2 }}
    >
      {meal.imageUrl && (
        <figure className={`${imageContainerClasses} p-2`}>
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </figure>
      )}
      <div className="card-body items-center p-4 pt-2 pb-2">
        <h2 className="text-2xl font-bold text-base-content mb-2 w-full text-center">
          {meal.name}
        </h2>
        <div className="w-full flex justify-between items-center">
          <span className="text-secondary-content text-sm font-semibold uppercase tracking-wide">
            {meal.category}
          </span>
          <span className="text-secondary-content text-sm font-semibold">
            🌍 {meal.origin}
          </span>
        </div>
        <div className="w-full text-left mt-4">
          <p className="text-base-content font-semibold mb-2">
            🥘 Ingredients:
          </p>
          <div className="flex flex-wrap gap-2">
            {meal.ingredients.slice(0, 8).map((ingredient, index) => (
              <span
                key={`${meal.id}-${ingredient}-${index}`}
                className="badge badge-outline badge-sm text-xs"
              >
                {ingredient}
              </span>
            ))}
            {meal.ingredients.length > 8 && (
              <span className="badge badge-outline badge-sm text-xs">
                +{meal.ingredients.length - 8} more
              </span>
            )}
          </div>
        </div>
        {onFavorite && (
          <div className="card-actions w-full mt-4">
            <motion.button
              type="button"
              onClick={handleClick}
              className={`btn w-full h-12 rounded-lg ${
                isFavorite
                  ? "bg-error text-error-content hover:opacity-80"
                  : "bg-warning text-warning-content hover:opacity-80"
              }`}
              {...buttonHoverTap}
            >
              {isFavorite ? "⭐ Remove from Favorites" : "☆ Add to Favorites"}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default MealCard;
