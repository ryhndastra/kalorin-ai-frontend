import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import Navbar from "../components/Navbar/Navbar";
import ProfileHero from "../components/Profile/ProfileHero";
import StatsCard from "../components/Profile/StatsCard";
import GoalsCard from "../components/Profile/GoalsCard";
import EditModal from "../components/Profile/EditModal";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return 0;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // State Utama (nanti nyambng ke Supabase)
  const [userData, setUserData] = useState({
    birthdate: "2005-09-09", // default birthdate agar age otomatis terhitung
    weight: 70,
    height: 181,
    goal: "Stay Healthy",
    dailyCalories: 1850,
    proteinTarget: 120,
  });

  // State untuk kontrol modal
  const [modalType, setModalType] = useState(null); // 'stats', 'goals', atau null
  const [tempData, setTempData] = useState({});

  const openModal = (type) => {
    setTempData({ ...userData }); // copy data asli ke data sementara
    setModalType(type);
  };

  const handleSave = () => {
    setUserData(tempData); // update data asli menggunakan data sementara
    setModalType(null);
    console.log("Data saved to local state!");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Gagal Logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#eefaf1] pb-20">
      <Navbar user={user} />

      {/* Hero Section */}
      <div className="mt-20">
        <ProfileHero user={user} />
      </div>

      <main className="max-w-[800px] mx-auto px-6 mt-8 space-y-6">
        {/* Stats Section */}
        <StatsCard
          data={{
            ...userData,
            age: calculateAge(userData.birthdate),
          }}
          onEdit={() => openModal("stats")}
        />

        {/* Goals Section */}
        <GoalsCard data={userData} onEdit={() => openModal("goals")} />

        <button
          onClick={handleLogout}
          className="w-full py-5 text-[#FF4B4B] font-bold text-lg rounded-[24px] border-2 border-[#FFEDED] bg-[#FFF5F5] hover:bg-[#FFEDED] transition-all duration-300 mt-8 mb-10 shadow-sm"
        >
          Sign Out
        </button>
      </main>

      {/* reusable modal */}
      <EditModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        onSave={handleSave}
        title={
          modalType === "stats" ? "Edit Body Stats" : "Change Goal Settings"
        }
      >
        {modalType === "stats" ? (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Birthdate
              </label>
              <input
                type="date"
                className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-green-500 outline-none font-bold text-gray-700"
                value={tempData.birthdate || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, birthdate: e.target.value })
                }
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-green-500 outline-none font-bold text-gray-700"
                  value={tempData.weight || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, weight: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-green-500 outline-none font-bold text-gray-700"
                  value={tempData.height || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, height: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Current Goal
              </label>
              <select
                className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-green-500 outline-none font-bold text-gray-700 appearance-none"
                value={tempData.goal || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, goal: e.target.value })
                }
              >
                <option value="Stay Healthy">Stay Healthy</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Bulking">Bulking</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Daily Calories Goal (kcal)
              </label>
              <input
                type="number"
                className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-green-500 outline-none font-bold text-gray-700"
                value={tempData.dailyCalories || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, dailyCalories: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Protein Target (g)
              </label>
              <input
                type="number"
                className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-green-500 outline-none font-bold text-gray-700"
                value={tempData.proteinTarget || ""}
                onChange={(e) =>
                  setTempData({ ...tempData, proteinTarget: e.target.value })
                }
              />
            </div>
          </div>
        )}
      </EditModal>
    </div>
  );
};

export default ProfilePage;
