import React, { useState, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Camera, Search, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import CameraScanner from "../components/Analyze/CameraScanner";
import ImagePreview from "../components/Analyze/ImagePreview";
import DefaultScanPlaceholder from "../components/Analyze/DefaultScanPlaceholder";
import AnalysisResult from "../components/Analyze/AnalysisResult";
import GuestUpsell from "../components/Analyze/GuestUpsell";
import LoadingCard from "../components/Analyze/LoadingCard";
import { useAuth } from "../context/AuthContext";
import AnalyzeSkeleton from "../components/skeletons/AnalyzeSkeleton";

const AnalyzePage = () => {
  // states
  const { user } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const isGuest = !user;
  const [activeTab, setActiveTab] = useState("scan");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // handler untuk analisis makanan. nanti bakal ganti ke API call, sekarang masih dummy pakai timeout
  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      const dummyData = {
        foodName: "Avocado Toast with Egg",
        calories: 350,
        macros: { protein: "12g", carbs: "25g", fat: "22g" },
        confidence: "95%",
      };
      setAnalysisResult(dummyData);
      setIsAnalyzing(false);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // handler untuk upload file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        setIsCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const capture = useCallback((webcamRef) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (user) {
      const hasSeenToast = sessionStorage.getItem("welcomeToastShown");
      if (!hasSeenToast) {
        toast.success(`Welcome back, ${user.displayName || "User"}!`, {
          icon: "👋",
        });
        sessionStorage.setItem("welcomeToastShown", "true");
      }
    }
  }, [user]);

  if (isPageLoading) {
    return (
      <div className="pt-20 min-h-screen bg-white">
        <Navbar user={user} loading={false} />
        <AnalyzeSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 font-sans flex flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar user={user} loading={false} />

      {/* banner untuk guest */}
      {isGuest && (
        <div className="w-full bg-green-500 p-4">
          <div className="max-w-7xl mx-auto px-4 text-white text-sm font-medium flex justify-between items-center">
            <span>
              Sign in to track meals & get personalized recommendations
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 w-full py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Food Analysis
            </h1>
            <p className="text-sm text-gray-500">
              {isGuest
                ? "Analyze any food with AI — free, no account needed"
                : "Identify your meal and track your daily nutrition"}
            </p>
          </div>

          {/* Hanya tampilkan label GuestMode jika belum login */}
          {isGuest && (
            <span className="px-5 py-2 border border-green-600 bg-[#eefaf1] text-green-600 text-xs font-semibold rounded-lg">
              GuestMode
            </span>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex w-full bg-gray-100/80 rounded-2xl p-1.5 mb-2">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 py-3 text-base font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "scan"
                ? "bg-white text-green-500 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <Camera size={20} /> Scan Image
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 py-3 text-base font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "search"
                ? "bg-white text-green-500 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <Search size={20} /> Search Food
          </button>
        </div>
      </div>

      {/* Scan Area*/}
      <div className="bg-[#eefaf1] w-full flex-grow mt-4 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="border-2 border-green-400 border-dashed rounded-3xl p-6 min-h-[400px] flex items-center justify-center bg-black/5 overflow-hidden mb-6">
            {isCameraActive ? (
              <CameraScanner
                facingMode={facingMode}
                toggleCamera={toggleCamera}
                capture={capture}
                onCancel={() => setIsCameraActive(false)}
              />
            ) : capturedImage ? (
              <ImagePreview
                image={capturedImage}
                onAnalyze={handleAnalyze}
                onRetake={() => setCapturedImage(null)}
              />
            ) : (
              <DefaultScanPlaceholder
                onStart={() => setIsCameraActive(true)}
                onUpload={handleFileUpload}
              />
            )}
          </div>

          {isAnalyzing && <LoadingCard />}
          {analysisResult && (
            <AnalysisResult
              result={analysisResult}
              onClear={() => setAnalysisResult(null)}
            />
          )}
          {isGuest && <GuestUpsell />}
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
