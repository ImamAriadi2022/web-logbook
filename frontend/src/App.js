import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPages from "./pages/LandingPages";
import Login from "./pages/Login";
import Sign from "./pages/Sign";
import User from "./pages/User";
import Admin from "./pages/Admin"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/admin/*" element={<Admin />} /> 
        <Route path="/*" element={<User />} />
        {/* Tambahkan route lain sesuai kebutuhan */}
      </Routes>
    </Router>
  );
}

export default App;