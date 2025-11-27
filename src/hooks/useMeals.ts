import { useEffect, useState } from "react";
import { httpClient } from "../api";
import type { Meal } from "../types";

export function useMeals() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch meals for letters a, b, c, f, s
                const letters = ["a", "b", "c", "f", "s"];
                const promises = letters.map((letter) =>
                    httpClient.getMealsByFirstLetter(letter)
                );

                const results = await Promise.all(promises);

                // Flatten the results into a single array
                const allMeals = results.flat();

                setMeals(allMeals);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch meals");
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, []);

    return { meals, loading, error };
}
