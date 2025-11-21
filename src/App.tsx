import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { FilterProvider } from "./components/contexts/FilterContext";
import WelcomeBoard from "./components/WelcomeBoard/WelcomeBoard";

function App() {
  return (
    <FilterProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeBoard />} />
          {/* Add more routes here as needed */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </FilterProvider>
  );
}

export default App;
