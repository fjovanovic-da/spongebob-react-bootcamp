import { lazy, memo, Suspense, useCallback, useMemo } from "react";
import { FAVORITES_SECTION } from "../../config";
import type {
  ChartData,
  EmptyFavoritesProps,
  FavoriteStatProps,
  FavoritesSectionProps,
  Meal,
} from "../../types";
import { LoadingSpinner } from "../common";

// Lazy load the pie chart component since it uses recharts (large bundle)
const FavoritesPieChart = lazy(() =>
  import("./FavoritesPieChart").then((module) => ({
    default: module.FavoritesPieChart,
  }))
);

// Helper function to get distribution data from meals
function getDistributionData<T extends Meal>(
  meals: T[],
  fieldExtractor: (meal: T) => string
): ChartData[] {
  if (meals.length === 0) return [];

  const countMap: Record<string, number> = {};
  for (const meal of meals) {
    const field = fieldExtractor(meal);
    countMap[field] = (countMap[field] || 0) + 1;
  }

  return Object.entries(countMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

const ChartLoadingFallback = memo(function ChartLoadingFallback() {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <LoadingSpinner size="lg" />
    </div>
  );
});

const FavoriteStat = memo(function FavoriteStat({
  favoriteCount,
  totalCount,
}: FavoriteStatProps) {
  return (
    <div className="flex justify-center items-center">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <span className="text-3xl">{FAVORITES_SECTION.EMOJI.HEART}</span>
          </div>
          <div className="stat-title">{FAVORITES_SECTION.MESSAGES.TITLE}</div>
          <div className="stat-value text-secondary">{favoriteCount}</div>
          <div className="stat-desc">
            {FAVORITES_SECTION.MESSAGES.TOTAL_DESCRIPTION(totalCount)}
          </div>
        </div>
      </div>
    </div>
  );
});

const EmptyFavorites = memo(function EmptyFavorites({
  totalCount,
}: EmptyFavoritesProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <FavoriteStat favoriteCount={0} totalCount={totalCount} />
      <div className="text-center py-4">
        <div className="text-4xl mb-2">
          {FAVORITES_SECTION.EMOJI.BROKEN_HEART}
        </div>
        <p className="text-base-content/60">
          {FAVORITES_SECTION.MESSAGES.EMPTY_PROMPT}
        </p>
      </div>
    </div>
  );
});

function FavoritesSectionComponent({
  meals,
  favoriteMeals,
  loading,
  error,
}: FavoritesSectionProps) {
  const getCategoryField = useCallback((meal: Meal) => meal.category, []);
  const getOriginField = useCallback((meal: Meal) => meal.origin, []);

  const categoryData = useMemo(
    () => getDistributionData(favoriteMeals, getCategoryField),
    [favoriteMeals, getCategoryField]
  );

  const originData = useMemo(
    () => getDistributionData(favoriteMeals, getOriginField),
    [favoriteMeals, getOriginField]
  );

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">
          {FAVORITES_SECTION.EMOJI.HEART} {FAVORITES_SECTION.MESSAGES.TITLE}
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : favoriteMeals.length > 0 ? (
          <div className="flex flex-col gap-8 favorites-grid overflow-visible">
            <FavoriteStat
              favoriteCount={favoriteMeals.length}
              totalCount={meals.length}
            />

            {/* Pie Charts - Lazy Loaded with single Suspense boundary */}
            <Suspense fallback={<ChartLoadingFallback />}>
              <div className="flex justify-center overflow-visible">
                <FavoritesPieChart data={categoryData} title="By Category" />
              </div>
              <div className="flex justify-center overflow-visible">
                <FavoritesPieChart data={originData} title="By Origin" />
              </div>
            </Suspense>
          </div>
        ) : (
          <EmptyFavorites totalCount={meals.length} />
        )}
      </div>
    </div>
  );
}

export const FavoritesSection = memo(FavoritesSectionComponent);
