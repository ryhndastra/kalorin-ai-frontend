import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AnalyzePage from "./pages/AnalyzePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import GuestRoute from "./components/Navbar/GuestRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/analyze" element={<AnalyzePage />} />
      <Route path="/home" element={<HomePage />} />

      <Route element={<GuestRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}
