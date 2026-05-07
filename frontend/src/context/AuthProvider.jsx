import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "./AuthContext";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import HomeSkeleton from "../components/skeletons/HomeSkeleton";
import AnalyzeSkeleton from "../components/skeletons/AnalyzeSkeleton";
import DefaultSpinner from "../components/skeletons/DefaultSpinner";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderSkeleton = () => {
    const path = location.pathname;

    switch (path) {
      case "/home":
        return <HomeSkeleton />;
      case "/analyze":
        return <AnalyzeSkeleton />;
      case "/":
        return null;
      case "/profile":
        return <DefaultSpinner />;
      default:
        return <DefaultSpinner />;
    }
  };

  if (authLoading) {
    if (location.pathname === "/") return null;

    return (
      <div className="pt-20">
        <Navbar user={null} loading={true} />
        {renderSkeleton()}
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
