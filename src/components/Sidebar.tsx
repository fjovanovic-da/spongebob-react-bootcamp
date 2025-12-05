import { Link, useLocation } from "react-router-dom";
import {
  FavoritesIcon,
  FoodMenuIcon,
  ResidentsIcon,
  SettingsIcon,
  TasksIcon,
} from "./icons";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      path: "/residents",
      label: "Residents",
      icon: <ResidentsIcon />,
    },
    {
      path: "/menu",
      label: "Menu",
      icon: <FoodMenuIcon />,
    },
    {
      path: "/tasks",
      label: "Tasks",
      icon: <TasksIcon />,
    },
    {
      path: "/favorites",
      label: "Favorites",
      icon: <FavoritesIcon />,
    },
  ];

  return (
    <aside className="menu bg-base-200 min-h-full w-64 p-4 rounded-r-2xl">
      {/* Logo/Brand */}
      <Link to="/" className="block mb-8 px-4 cursor-pointer">
        <h2 className="text-2xl font-bold text-primary">🍔 Krusty Krab</h2>
        <p className="text-xs text-base-content/60 mt-1">Bikini Bottom</p>
      </Link>

      {/* Navigation Menu */}
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-primary-content font-semibold"
                  : "hover:bg-base-300"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Settings and Footer */}
      <div className="mt-auto">
        {/* Settings Link */}
        <li>
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === "/settings"
                ? "bg-primary text-primary-content font-semibold"
                : "hover:bg-base-300"
            }`}
          >
            <SettingsIcon />
            <span>Settings</span>
          </Link>
        </li>

        {/* Footer Info */}
        <div className="pt-8 px-4 text-xs text-base-content/50">
          <p>© 2025 Krusty Krab</p>
          <p>Home of the Krabby Patty</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
