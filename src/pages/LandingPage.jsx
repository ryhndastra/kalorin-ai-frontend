import React from "react";
import LandingHero from "../components/LandingHero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import LandingCTA from "../components/LandingCTA";
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
