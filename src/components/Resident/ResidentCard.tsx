import type { ResidentCardProps } from "../../types";

function ResidentCard({ resident }: ResidentCardProps) {
  const cardClasses =
    "card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 border-2 border-base-300 hover:border-primary overflow-hidden rounded-2xl p-6";
  const imageContainerClasses =
    "w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center rounded-2xl";

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
      <div className="card-body items-center p-4 pt-2 pb-2">
        <h2 className="text-2xl font-bold text-base-content mb-2 w-full text-center">
          {resident.name}
        </h2>
        <div className="w-full flex justify-start">
          <span className="text-primary text-sm font-semibold uppercase tracking-wide">
            {resident.business}
          </span>
        </div>
        <p className="text-base-content italic mt-2 mb-1 w-full text-left">
          {resident.catchphrase}
        </p>
        <div className="w-full text-left space-y-2 mt-2">
          <p className="text-base-content font-medium">📍 {resident.city}</p>
          <p className="text-base-content font-medium">🏢 {resident.company}</p>
          <p className="text-base-content text-sm">{resident.email}</p>
        </div>
      </div>
    </div>
  );
}

export default ResidentCard;
