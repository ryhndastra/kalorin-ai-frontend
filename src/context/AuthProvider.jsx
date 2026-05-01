import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "./AuthContext";

import Navbar from "../components/Navbar/Navbar";
import HomeSkeleton from "../components/skeletons/HomeSkeleton";
import AnalyzeSkeleton from "../components/skeletons/AnalyzeSkeleton";
import DefaultSpinner from "../components/skeletons/DefaultSpinner";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderSkeleton = () => {
    const path = window.location.pathname;
    switch (path) {
      case "/":
      case "/home":
        return <HomeSkeleton />;
      case "/analyze":
        return <AnalyzeSkeleton />;
      default:
        return <DefaultSpinner />;
    }
  };

  if (authLoading) {
    return (
      <div className="pt-20">
        {" "}
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
