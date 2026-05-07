import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import NavUserDropdown from "./NavUserDropdown";

export default function Navbar({ user, loading }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsVisible(false);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Link
        to="/analyze"
        className="flex items-center gap-2 font-bold text-xl cursor-pointer"
      >
        <img
          src="/images/logo/kalorinLogo.png"
          alt="KaloriN AI Logo"
          className="w-24"
        />
      </Link>

      <NavLinks />

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        ) : user ? (
          <NavUserDropdown user={user} />
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-600 transition block"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
