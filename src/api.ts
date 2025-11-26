/**
 * HTTP Client utility for making API requests
 */

import axios from "axios";
import { DEFAULT_TIMEOUT, MEAL_API_ENDPOINT } from "./config";
import type { Meal, MealApiResponse, User } from "./types";

class HttpClient {
  /**
   * Fetch users from the API
   * @param url - The URL to fetch users from
   * @returns Promise with list of users
   */
  async getUsers(url: string): Promise<User[]> {
    const response = await axios.get<User[]>(url, {
      timeout: DEFAULT_TIMEOUT,
    });
    return response.data;
  }

  /**
   * Fetch meals by first letter from TheMealDB API
   * @param letter - The first letter to search for
   * @returns Promise with list of meals
   */
  async getMealsByFirstLetter(letter: string): Promise<Meal[]> {
    const response = await axios.get<{ meals: MealApiResponse[] | null }>(
      MEAL_API_ENDPOINT,
      {
        params: { f: letter },
        timeout: DEFAULT_TIMEOUT,
      }
    );

    if (!response.data.meals) {
      return [];
    }

    return response.data.meals.map((meal) => {
      // Collect all non-empty ingredients
      const ingredients: string[] = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}` as keyof MealApiResponse];
        if (ingredient && typeof ingredient === "string" && ingredient.trim()) {
          ingredients.push(ingredient.trim());
        }
      }

      return {
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory,
        origin: meal.strArea,
        ingredients,
        imageUrl: meal.strMealThumb,
      };
    });
  }
}

// Export a singleton instance
export const httpClient = new HttpClient();
