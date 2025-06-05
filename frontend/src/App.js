import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPages from "./pages/LandingPages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPages />} />
        {/* Tambahkan route lain sesuai kebutuhan */}
      </Routes>
    </Router>
  );
}

export default App;