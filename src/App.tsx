import "./App.css";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import WelcomeBoard from "./components/WelcomeBoard/WelcomeBoard";
import { useThemeStore } from "./stores/useThemeStore";

function App() {
  const theme = useThemeStore((state) => state.theme);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="App">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Routes>
        <Route path="/" element={<WelcomeBoard />} />
        {/* Add more routes here as needed */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
