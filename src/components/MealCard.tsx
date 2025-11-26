import type { MealCardProps } from "../types";

function MealCard({ meal }: MealCardProps) {
  const cardClasses =
    "card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 border-2 border-base-300 hover:border-primary overflow-hidden rounded-2xl p-6";
  const imageContainerClasses =
    "w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center rounded-2xl";

  return (
    <div className={cardClasses}>
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
      </div>
    </div>
  );
}

export default MealCard;
