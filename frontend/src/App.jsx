import React, { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AnalyzePage from "./pages/AnalyzePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import GuestRoute from "./components/Navbar/GuestRoute";
import ProfilePage from "./pages/ProfilePage";

// import hooks buat ambil data
import { useAuth } from "./context/AuthProvider";
import { useUser } from "./context/UserContext";
import MealsPage from "./pages/MealsPage";

export default function App() {
  const { user } = useAuth();
  const { fetchProfile, userData, loading } = useUser();
  const isFetching = useRef(false);

  useEffect(() => {
    // kalau ada user, belum ada data, lagi ga loading, dan belum pernah fetch
    if (user?.id && !userData && !loading && !isFetching.current) {
      isFetching.current = true; // lock biar gak bisa masuk lagi
      fetchProfile(user.id);
    }
  }, [user?.id, userData, loading, fetchProfile]);
  return (
    <Routes>
      <Route path="/analyze" element={<AnalyzePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/meals" element={<MealsPage />} />

      <Route element={<GuestRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}
