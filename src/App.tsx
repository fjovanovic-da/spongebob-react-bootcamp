import "./App.css";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { MenuIcon } from "./components/icons";
import Sidebar from "./components/Sidebar";
import { useThemeStore } from "./stores";

function App() {
  const theme = useThemeStore((state) => state.theme);

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
              <MenuIcon />
            </label>
          </div>
          <div className="flex-1">
            <span className="text-lg font-bold">Bikini Bottom Portal</span>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
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
