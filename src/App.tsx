import "./App.css";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useMeals } from "./hooks/useMeals";
import { useResidents } from "./hooks/useResidents";
import Dashboard from "./pages/Dashboard";
import FavoritesBoard from "./pages/FavoritesBoard";
import MenuBoard from "./pages/MenuBoard";
import SettingsBoard from "./pages/SettingsBoard";
import TaskBoard from "./pages/TaskBoard";
import WelcomeBoard from "./pages/WelcomeBoard";
import { useThemeStore } from "./stores/useThemeStore";

function App() {
  const theme = useThemeStore((state) => state.theme);
  const { residents, loading, error } = useResidents();
  const { meals, loading: mealsLoading, error: mealsError } = useMeals();

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="flex items-center bg-base-300 rounded-2xl mx-6 mt-6 px-6 h-16">
          <div className="flex-none lg:hidden mr-2">
            <label
              htmlFor="app-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <title>Menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <span className="text-lg font-bold">Bikini Bottom Portal</span>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/menu"
              element={
                <MenuBoard
                  meals={meals}
                  loading={mealsLoading}
                  error={mealsError}
                />
              }
            />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/settings" element={<SettingsBoard />} />
            <Route
              path="/favorites"
              element={
                <FavoritesBoard
                  meals={meals}
                  loading={mealsLoading}
                  error={mealsError}
                />
              }
            />
            <Route
              path="/residents"
              element={
                <WelcomeBoard
                  residents={residents}
                  loading={loading}
                  error={error}
                />
              }
            />
            {/* Add more routes here as needed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="app-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
