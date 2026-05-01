import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "./AuthContext";

import AnalyzeSkeleton from "../components/skeletons/AnalyzeSkeleton";
import DefaultSkeleton from "../components/skeletons/DefaultSkeleton";

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

  // skeleton router
  const renderSpecificSkeleton = () => {
    const path = window.location.pathname;

    switch (path) {
      case "/analyze":
        return <AnalyzeSkeleton />;
      case "/meals":
        return (
          <div className="p-20 text-center">
            Ini Skeleton Meals (Bikin kayak Analyze)
          </div>
        );
      case "/track":
        return (
          <div className="p-20 text-center">
            Ini Skeleton Track (Bikin Grafik abu-abu)
          </div>
        );
      default:
        return <DefaultSkeleton />;
    }
  };

  if (authLoading) {
    return renderSpecificSkeleton();
  }

  return (
    <AuthContext.Provider value={{ user, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
