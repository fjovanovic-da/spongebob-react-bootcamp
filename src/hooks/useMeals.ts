import { useEffect } from "react";
import { useMealsStore } from "../stores";

export function useMeals() {
    const meals = useMealsStore((state) => state.meals);
    const loading = useMealsStore((state) => state.loading);
    const error = useMealsStore((state) => state.error);
    const fetchMeals = useMealsStore((state) => state.fetchMeals);

    useEffect(() => {
        fetchMeals();
    }, [fetchMeals]);

    return { meals, loading, error };
}
