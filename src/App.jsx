import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AnalyzePage from "./pages/AnalyzePage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* landing Page */}
        <Route path="/" element={<LandingPage />} />
        {/* Analyze Page */}
        <Route path="/analyze" element={<AnalyzePage />} />
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
