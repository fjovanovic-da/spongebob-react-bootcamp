import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import FavoritesBoard from "./pages/FavoritesBoard.tsx";
import MenuBoard from "./pages/MenuBoard.tsx";
import SettingsBoard from "./pages/SettingsBoard.tsx";
import TaskBoard from "./pages/TaskBoard.tsx";
import WelcomeBoard from "./pages/WelcomeBoard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "menu",
        element: <MenuBoard />,
      },
      {
        path: "tasks",
        element: <TaskBoard />,
      },
      {
        path: "settings",
        element: <SettingsBoard />,
      },
      {
        path: "favorites",
        element: <FavoritesBoard />,
      },
      {
        path: "residents",
        element: <WelcomeBoard />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
