import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Coba tes render Navbar versi landing */}
      <Navbar variant="Landing" />
      <LandingPage />
    </div>
  );
}
