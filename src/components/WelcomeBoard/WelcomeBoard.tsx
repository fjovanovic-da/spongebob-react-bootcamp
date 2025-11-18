import { useState } from "react";
import type { Resident } from "../types";
import ResidentCard from "../ResidentCard/ResidentCard";
import "./WelcomeBoard.css";

const residents: Resident[] = [
  {
    id: "1",
    name: "SpongeBob SquarePants",
    role: "Fry Cook",
    description:
      "Optimistic sea sponge who loves his job at the Krusty Krab. Always ready for an adventure!",
    imageUrl: "",
    emoji: "🧽",
  },
  {
    id: "2",
    name: "Patrick Star",
    role: "Best Friend",
    description:
      "SpongeBob's best friend and neighbor. Loves jellyfishing and having fun!",
    imageUrl: "",
    emoji: "⭐",
  },
  {
    id: "3",
    name: "Squidward Tentacles",
    role: "Cashier",
    description:
      "Grumpy octopus who works at the Krusty Krab. Enjoys playing clarinet in his free time.",
    imageUrl: "",
    emoji: "🐙",
  },
];

function WelcomeBoard() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleFavorite = (id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  return (
    <div className="welcome-board">
      <h1>Welcome to Bikini Bottom! 🌊</h1>
      <p>Meet the residents:</p>
      <div className="residents-grid">
        {residents.map((resident) => (
          <ResidentCard
            key={resident.id}
            resident={resident}
            onFavorite={handleFavorite}
            isFavorite={favorites.includes(resident.id)}
          />
        ))}
      </div>
      {favorites.length > 0 && (
        <div className="favorites-footer">
          You have {favorites.length} favorite{favorites.length > 1 ? "s" : ""}!
          ⭐
        </div>
      )}
    </div>
  );
}

export default WelcomeBoard;
