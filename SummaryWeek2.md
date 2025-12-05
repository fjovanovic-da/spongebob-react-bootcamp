# Week 2 Summary - Krusty Menu Board

## Overview
This branch introduces the Krusty Menu Board, expanding the Bikini Bottom app with a menu management system for meals. The new features allow users to browse and filter menu items, mirroring the interactive experience and structure of the Welcome Board for residents.

## Key Features Implemented

### 1. **MenuBoard Component**
- Main component displaying a grid of meal cards
- Handles loading and error states
- Integrated search and category and origin filtering controls
- Uses the `MealFilterStore` to persist filters across reloads

### 2. **MealCard Component**
- Displays individual meal information (name, category, origin, ingredients)
- Placeholder image or emoji for meal visuals
- Note: Favorite toggle is NOT implemented for meals in this week — favorites are implemented and used for residents only

### 3. **Custom Hooks**

#### `useMeals`
- Fetches meal data from TheMealDB API
- Transforms response into `Meal` type
- Provides loading and error states

#### `useMealFilter`
- Filters meals by search text (name, description) and ingredients
- Filters meals by category and origin
- Uses debounced search for performance
- Leverages `useMealFilterStore` (Zustand) for state persistence between reloads

#### `useFavorites` / Favorites Store
- Global favorites store implemented with Zustand and persisted in LocalStorage
- Currently used by the Residents feature (WelcomeBoard & Favorites board)
- The store is generic and can support favoriting meals in the future, but MealCard does not yet integrate favorites

### 4. **MealFilterStore** (Zustand)
- Global persistent store for meal search and filter state backed by LocalStorage (using `useMealFilterStore`)
- Used by `useMealFilter` to control UI state and persist filter selections
- Restores filter state on reload

 
## Design & Theme
- **Styling**: The project uses Tailwind CSS and the daisyUI plugin for fast, utility-first styling and component classes.
- **Themes**: `daisyUI` themes are configured and a `ThemeToggle` component together with a `useThemeStore` (Zustand) enable switching between themes (`cupcake` and `aqua`) with persistence via LocalStorage.
## Technical Highlights
- **Type Safety**: All new features use TypeScript with types in `types.ts`
- **Performance**: Debounced search and memoized filtering for meals
- **Persistence**: LocalStorage for meal filter state and a persistent favorites store (currently used by residents)
- **Error Handling**: User feedback for loading and error states
- **Pagination**: The `MealList` component implements pagination to limit items per page
- **Architecture**: Clean separation with custom hooks and Zustand stores
- **Best Practices**: Consistent use of React hooks, `useDebounce`, `useMemo`, and `useEffect`

## Project Structure Updates
```
src/
├── components/
│   ├── MenuBoard/         # Main menu board component
│   ├── Meal/              # MealCard, MealList, MealFilter components
│   └── ...                # Existing resident components
├── hooks/                 # useMeals, useMealFilter, useDebounce, etc.
├── stores/                # useFavoritesStore (residents), useMealFilterStore, and other stores
```

## Technologies Used
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Vite** for development and build
- **Tailwind CSS** for utility-first styling
- **daisyUI** for theming and UI helpers
- **Zustand** for persisted stores (favorites, filters, theme)
- **LocalStorage** for persistence

## Summary
Week 2 focused on building a robust menu management system. The Krusty Menu Board implements meal fetching, search and filter controls, debounced inputs, pagination, and persistent filter state, reusing patterns established in Week 1. Meals can be browsed and filtered but do not yet support favorites — favorites are implemented for residents and the favorites store is in place for future integration with meals.

## Limitations & Next Steps
- Meal favorites are not yet implemented in `MealCard` or `MenuBoard`; if desired, the existing `useFavoritesStore` can be integrated to allow favoriting meals and display favorites in `FavoritesBoard`.
- Add favorite toggle to the `MealCard` and update `MenuBoard` to show favorite count if applicable.
- Improve meal visuals and add unit tests for hooks and filtering logic.