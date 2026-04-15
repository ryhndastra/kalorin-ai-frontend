import React from "react";
import LandingHero from "../components/LandingHero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import LandingCTA from "../components/LandingCTA";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHero />
      <Features />
      <HowItWorks />
      <LandingCTA />
      <Footer />
    </div>
  );
}
