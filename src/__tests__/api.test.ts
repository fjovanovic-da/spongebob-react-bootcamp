import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "../api";
import { DEFAULT_TIMEOUT, MEAL_API_ENDPOINT } from "../config";
import type { MealApiResponse, User } from "../types";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("HttpClient", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("getUsers", () => {
        const mockUsers: User[] = [
            {
                id: 1,
                name: "SpongeBob SquarePants",
                email: "spongebob@bikinibottom.com",
                username: "spongebob",
                address: { city: "Bikini Bottom" },
                company: {
                    name: "Krusty Krab",
                    catchPhrase: "I'm ready!",
                    bs: "fry cooking",
                },
            },
            {
                id: 2,
                name: "Patrick Star",
                email: "patrick@rock.com",
                username: "patrick",
                address: { city: "Bikini Bottom" },
                company: {
                    name: "Unemployed",
                    catchPhrase: "Is mayonnaise an instrument?",
                    bs: "sleeping",
                },
            },
        ];

        it("should fetch users successfully", async () => {
            const url = "https://api.example.com/users";
            mockedAxios.get.mockResolvedValueOnce({ data: mockUsers });

            const result = await httpClient.getUsers(url);

            expect(mockedAxios.get).toHaveBeenCalledWith(url, {
                timeout: DEFAULT_TIMEOUT,
            });
            expect(result).toEqual(mockUsers);
        });

        it("should return empty array when API returns empty array", async () => {
            const url = "https://api.example.com/users";
            mockedAxios.get.mockResolvedValueOnce({ data: [] });

            const result = await httpClient.getUsers(url);

            expect(result).toEqual([]);
        });

        it("should throw error when API call fails", async () => {
            const url = "https://api.example.com/users";
            const networkError = new Error("Network Error");
            mockedAxios.get.mockRejectedValueOnce(networkError);

            await expect(httpClient.getUsers(url)).rejects.toThrow(
                "Network Error"
            );
        });

        it("should throw error on timeout", async () => {
            const url = "https://api.example.com/users";
            const timeoutError = new Error("timeout of 10000ms exceeded");
            mockedAxios.get.mockRejectedValueOnce(timeoutError);

            await expect(httpClient.getUsers(url)).rejects.toThrow(
                "timeout of 10000ms exceeded"
            );
        });

        it("should use correct timeout value", async () => {
            const url = "https://api.example.com/users";
            mockedAxios.get.mockResolvedValueOnce({ data: [] });

            await httpClient.getUsers(url);

            expect(mockedAxios.get).toHaveBeenCalledWith(
                url,
                expect.objectContaining({ timeout: DEFAULT_TIMEOUT })
            );
        });
    });

    describe("getMealsByFirstLetter", () => {
        const createMockMealResponse = (
            overrides: Partial<MealApiResponse> = {}
        ): MealApiResponse => ({
            idMeal: "12345",
            strMeal: "Krabby Patty",
            strCategory: "Seafood",
            strArea: "American",
            strMealThumb: "https://example.com/krabby.jpg",
            strIngredient1: "Bun",
            strIngredient2: "Patty",
            strIngredient3: "Lettuce",
            strIngredient4: "Cheese",
            strIngredient5: "Pickles",
            strIngredient6: "Secret Sauce",
            strIngredient7: "",
            strIngredient8: undefined,
            ...overrides,
        });

        it("should fetch meals by first letter successfully", async () => {
            const mockMealResponse = createMockMealResponse();
            mockedAxios.get.mockResolvedValueOnce({
                data: { meals: [mockMealResponse] },
            });

            const result = await httpClient.getMealsByFirstLetter("k");

            expect(mockedAxios.get).toHaveBeenCalledWith(MEAL_API_ENDPOINT, {
                params: { f: "k" },
                timeout: DEFAULT_TIMEOUT,
            });
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: "12345",
                name: "Krabby Patty",
                category: "Seafood",
                origin: "American",
                ingredients: [
                    "Bun",
                    "Patty",
                    "Lettuce",
                    "Cheese",
                    "Pickles",
                    "Secret Sauce",
                ],
                imageUrl: "https://example.com/krabby.jpg",
            });
        });

        it("should return empty array when no meals found (null response)", async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { meals: null },
            });

            const result = await httpClient.getMealsByFirstLetter("x");

            expect(result).toEqual([]);
        });

        it("should handle multiple meals", async () => {
            const mockMeals: MealApiResponse[] = [
                createMockMealResponse({ idMeal: "1", strMeal: "Krabby Patty" }),
                createMockMealResponse({
                    idMeal: "2",
                    strMeal: "Kelp Shake",
                    strCategory: "Beverage",
                }),
            ];
            mockedAxios.get.mockResolvedValueOnce({
                data: { meals: mockMeals },
            });

            const result = await httpClient.getMealsByFirstLetter("k");

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("Krabby Patty");
            expect(result[1].name).toBe("Kelp Shake");
        });

        it("should filter out empty ingredients", async () => {
            const mockMeal: MealApiResponse = {
                idMeal: "12345",
                strMeal: "Test Meal",
                strCategory: "Test",
                strArea: "Test",
                strMealThumb: "https://example.com/test.jpg",
                strIngredient1: "Bun",
                strIngredient2: "", // empty string
                strIngredient3: "   ", // whitespace only
                strIngredient4: "Patty",
                strIngredient5: undefined, // undefined
            };
            mockedAxios.get.mockResolvedValueOnce({
                data: { meals: [mockMeal] },
            });

            const result = await httpClient.getMealsByFirstLetter("k");

            expect(result[0].ingredients).toEqual(["Bun", "Patty"]);
        });

        it("should trim ingredient whitespace", async () => {
            const mockMeal = createMockMealResponse({
                strIngredient1: "  Bun  ",
                strIngredient2: " Patty ",
                strIngredient3: "Lettuce",
            });
            mockedAxios.get.mockResolvedValueOnce({
                data: { meals: [mockMeal] },
            });

            const result = await httpClient.getMealsByFirstLetter("k");

            expect(result[0].ingredients).toContain("Bun");
            expect(result[0].ingredients).toContain("Patty");
            expect(result[0].ingredients).toContain("Lettuce");
        });

        it("should handle all 20 possible ingredients", async () => {
            const mockMeal: MealApiResponse = {
                idMeal: "1",
                strMeal: "Super Meal",
                strCategory: "Main",
                strArea: "International",
                strMealThumb: "https://example.com/meal.jpg",
            };

            // Add all 20 ingredients
            for (let i = 1; i <= 20; i++) {
                (mockMeal as unknown as Record<string, string>)[
                    `strIngredient${i}`
                ] = `Ingredient${i}`;
            }

            mockedAxios.get.mockResolvedValueOnce({
                data: { meals: [mockMeal] },
            });

            const result = await httpClient.getMealsByFirstLetter("s");

            expect(result[0].ingredients).toHaveLength(20);
            expect(result[0].ingredients[0]).toBe("Ingredient1");
            expect(result[0].ingredients[19]).toBe("Ingredient20");
        });

        it("should map all meal properties correctly", async () => {
            const mockMeal = createMockMealResponse({
                idMeal: "99999",
                strMeal: "Test Meal",
                strCategory: "Test Category",
                strArea: "Test Area",
                strMealThumb: "https://test.com/image.jpg",
            });
            mockedAxios.get.mockResolvedValueOnce({
                data: { meals: [mockMeal] },
            });

            const result = await httpClient.getMealsByFirstLetter("t");

            expect(result[0]).toMatchObject({
                id: "99999",
                name: "Test Meal",
                category: "Test Category",
                origin: "Test Area",
                imageUrl: "https://test.com/image.jpg",
            });
        });

        it("should throw error when API call fails", async () => {
            const networkError = new Error("Network Error");
            mockedAxios.get.mockRejectedValueOnce(networkError);

            await expect(httpClient.getMealsByFirstLetter("a")).rejects.toThrow(
                "Network Error"
            );
        });

        it("should use correct API endpoint and parameters", async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { meals: null },
            });

            await httpClient.getMealsByFirstLetter("z");

            expect(mockedAxios.get).toHaveBeenCalledWith(MEAL_API_ENDPOINT, {
                params: { f: "z" },
                timeout: DEFAULT_TIMEOUT,
            });
        });

        it("should handle meal with no ingredients", async () => {
            const mockMeal: MealApiResponse = {
                idMeal: "1",
                strMeal: "Empty Meal",
                strCategory: "None",
                strArea: "Nowhere",
                strMealThumb: "https://example.com/empty.jpg",
                // No ingredients defined
            };
            mockedAxios.get.mockResolvedValueOnce({
                data: { meals: [mockMeal] },
            });

            const result = await httpClient.getMealsByFirstLetter("e");

            expect(result[0].ingredients).toEqual([]);
        });
    });
});
