import React from "react";
import LandingHero from "../components/LandingPage/LandingHero";
import Features from "../components/LandingPage/Features";
import HowItWorks from "../components/LandingPage/HowItWorks";
import LandingCTA from "../components/LandingPage/LandingCTA";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar variant="Landing" />
      <LandingHero />
      <Features />
      <HowItWorks />
      <LandingCTA />
      <Footer />
    </div>
  );
}
