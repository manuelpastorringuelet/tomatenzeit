import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Settings from "./components/Settings";
import Timer from "./components/Timer";
import WellnessActivity from "./components/WellnessActivity";

function App() {
  const imageUrl = "/pomodoro-wellness-image.png"; // Make sure this b exists in your public folder

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Timer imageUrl={imageUrl} />} />
          <Route path="/activity" element={<WellnessActivity />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
