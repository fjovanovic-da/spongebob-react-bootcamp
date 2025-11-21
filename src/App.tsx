import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import WelcomeBoard from "./components/WelcomeBoard/WelcomeBoard";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomeBoard />} />
        {/* Add more routes here as needed */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
