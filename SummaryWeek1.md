# Week 1 Summary - Interactive Welcome Board

## Overview
This branch implements an interactive Welcome Board application for Bikini Bottom residents using React, TypeScript, and Vite. The application fetches user data from an external API and displays it with rich filtering and favorites functionality.

## Key Features Implemented

### 1. **WelcomeBoard Component**
- Main component displaying a grid of resident cards
- Loading and error state handling
- Integrated search and role filtering controls
- Dynamic favorite count display

### 2. **ResidentCard Component**
- Individual card component for displaying resident information
- Shows name, email, city, company, business, and catchphrase
- Favorite toggle button with visual feedback (⭐/☆)
- Emoji placeholder for resident avatars

### 3. **Custom Hooks**

#### `useResidents`
- Fetches resident data from JSONPlaceholder API
- Transforms API response into `Resident` type
- Provides loading and error states
- Includes refetch capability for data reloading
- Proper cleanup on component unmount

#### `useFavorites`
- Manages favorite residents with localStorage persistence
- Toggle favorite/unfavorite functionality
- Check if a resident is favorited
- Track favorite count
- Clear all favorites option

#### `useResidentFilter`
- Filters residents by search text (name, city, email)
- Filters residents by role (company, business)
- Uses debounced search for performance optimization
- Leverages FilterContext for state management

#### `useDebounce`
- Generic debounce hook for delaying value updates
- Configurable delay (default 300ms)
- Used to optimize filter performance

### 4. **FilterContext**
- Global state management for search and role filters
- LocalStorage persistence for filter values
- Provides `searchText`, `roleFilter`, and their setters
- Restores filter state on page reload

## Technical Highlights

- **Type Safety**: Full TypeScript implementation with custom types defined in `types.ts`
- **Performance**: Debounced search inputs and memoized filtering
- **Persistence**: LocalStorage integration for favorites and filters
- **Error Handling**: Proper error states and user feedback
- **Clean Architecture**: Separation of concerns with custom hooks and context
- **React Best Practices**: Proper use of `useEffect`, `useMemo`, `useCallback`

## Project Structure
```
src/
├── components/
│   ├── WelcomeBoard/        # Main board component
│   ├── ResidentCard/        # Individual card component
│   ├── contexts/            # FilterContext for global state
│   ├── hooks/              # Custom reusable hooks
│   └── types.ts            # TypeScript type definitions
```

## Technologies Used
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Vite** for fast development and building
- **CSS** for styling
- **JSONPlaceholder API** for mock data
