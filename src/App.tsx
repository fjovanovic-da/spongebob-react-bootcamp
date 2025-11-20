import "./App.css";
import { FilterProvider } from "./components/contexts/FilterContext";
import WelcomeBoard from "./components/WelcomeBoard/WelcomeBoard";

function App() {
  return (
    <FilterProvider>
      <div className="App">
        <WelcomeBoard />
      </div>
    </FilterProvider>
  );
}

export default App;
