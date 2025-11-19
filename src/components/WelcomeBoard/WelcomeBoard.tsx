import { useEffect, useState } from "react";
import ResidentCard from "../ResidentCard/ResidentCard";
import type { Resident } from "../types";
import { useFavorites } from "../hooks/useFavorites";
import "./WelcomeBoard.css";

// API response type from JSONPlaceholder
interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  address: {
    city: string;
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

function WelcomeBoard() {
  // State for residents fetched from API
  const [residents, setResidents] = useState<Resident[]>([]);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState<string | null>(null);
  // Use the custom favorites hook
  const { toggleFavorite, isFavorite, favoriteCount } = useFavorites();

  // useEffect hook to fetch residents when component mounts
  useEffect(() => {
    // Flag to track if component is still mounted (prevents state updates after unmount)
    let isMounted = true;

    // Async function to fetch users from JSONPlaceholder API
    const fetchResidents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users: User[] = await response.json();

        // Only update state if component is still mounted
        if (isMounted) {
          // Transform API users into our Resident format
          const transformedResidents: Resident[] = users.map((user) => ({
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            city: user.address.city,
            company: user.company.name,
            catchphrase: user.company.catchPhrase,
            business: user.company.bs,
            emoji: "🧑", // Default emoji for all users
          }));

          setResidents(transformedResidents);
          setIsLoading(false);
        }
      } catch (err) {
        // Only update error state if component is still mounted
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch residents"
          );
          setIsLoading(false);
        }
      }
    };

    // Execute the fetch function
    fetchResidents();

    // Cleanup function: runs when component unmounts
    // Sets isMounted to false to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="welcome-board">
      <h1>Welcome to Bikini Bottom! 🌊</h1>
      <p>Meet the residents:</p>

      {/* Show loading state while fetching data */}
      {isLoading && (
        <div className="loading-state">
          <p>Loading residents... 🌊</p>
        </div>
      )}

      {/* Show error state if fetch fails */}
      {error && (
        <div className="error-state">
          <p>⚠️ Error: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      )}

      {/* Show residents grid when data is loaded and no error */}
      {!isLoading && !error && (
        <>
          <div className="residents-grid">
            {residents.map((resident) => (
              <ResidentCard
                key={resident.id}
                resident={resident}
                onFavorite={toggleFavorite}
                isFavorite={isFavorite(resident.id)}
              />
            ))}
          </div>
          {favoriteCount > 0 && (
            <div className="favorites-footer">
              You have {favoriteCount} favorite
              {favoriteCount > 1 ? "s" : ""}! ⭐
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WelcomeBoard;
