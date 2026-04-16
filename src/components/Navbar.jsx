import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ variant = "Landing" }) {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

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
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 font-bold text-xl cursor-pointer"
      >
        <img
          src="/images/logo/kalorinLogo.png"
          alt="KaloriN AI Logo"
          className="w-24"
        />
      </div>

      {/* Nav buat User yg udah login dan Guest */}
      {variant !== "Landing" && (
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <li className="cursor-pointer hover:text-gray-900">Home</li>
          <li className="cursor-pointer text-green-500">Analyze</li>{" "}
          <li className="cursor-pointer hover:text-gray-900">Meals</li>
          <li className="cursor-pointer hover:text-gray-900">Track</li>
          <li className="cursor-pointer hover:text-gray-900">Insights</li>
        </ul>
      )}

      {/* Nav buat landing Page */}
      <div className="flex items-center gap-4">
        {variant === "Landing" && (
          <>
            <button
              onClick={() => navigate("/analyze")}
              className="text-sm font-semibold text-gray-600 hover:text-green-600"
            >
              Guest
            </button>
            <button className="bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-green-600 transition">
              Masuk
            </button>
          </>
        )}

        {variant === "Guest" && (
          <>
            <button className="text-sm font-semibold text-gray-600 hover:text-green-600">
              Sign In
            </button>
            <button className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition">
              Get Started
            </button>
          </>
        )}

        {variant === "User" && (
          // TODO : bikin user profil
          <></>
        )}
      </div>
    </nav>
  );
}
