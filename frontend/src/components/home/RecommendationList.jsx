import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronRight, BrainCircuit, Loader2 } from "lucide-react";
import FoodDetailModal from "../common/FoodDetailModal";

const FoodCard = ({ food, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiData, setAiData] = useState(() => {
    if (!userId) return null;
    const cached = sessionStorage.getItem(`rinai-${userId}-${food.id}`);
    return cached ? JSON.parse(cached) : null;
  });

  return (
    <>
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-50 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full relative group">
        {/* badge score AI: prioritas data dari list, fallback ke session cache */}
        {(food.matchScore || aiData?.match_score_percent) && (
          <div className="absolute top-2 right-2 bg-[#22C55E] text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-sm flex items-center gap-1 z-10">
            <BrainCircuit size={10} />{" "}
            {food.matchScore || aiData.match_score_percent}%
          </div>
        )}

        <img
          src={food.image || "https://via.placeholder.com/150"}
          alt={food.name}
          className="w-full h-32 object-cover rounded-xl mb-3"
        />
        <h4 className="font-bold text-gray-800 text-sm truncate">
          {food.name}
        </h4>
        <p className="text-[10px] text-gray-400 mb-1">{food.calories} kcal</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="mt-auto w-full py-2 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-xl hover:bg-[#22C55E] hover:text-white transition-all border border-gray-100"
        >
          Details
        </button>
      </div>

      <FoodDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        food={food}
        userId={userId}
        onAiDataReceived={(data) => setAiData(data)}
      />
    </>
  );
};

const RecommendationList = ({ userId }) => {
  const [foods, setFoods] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAiRecommendations = async () => {
      if (!userId || !isMounted) return;

      setIsFetching(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/ai/food-list",
          {
            userId: userId,
          },
        );

        if (response.data.success && isMounted) {
          setFoods(response.data.data);
        }
      } catch (error) {
        console.error("❌ Gagal load AI Recommendation:", error);
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    fetchAiRecommendations();

    return () => {
      isMounted = false; // cleanup pas komponen unmount
    };
  }, [userId]);
  return (
    <div className="max-w-5xl mx-auto px-6 mt-8 mb-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-gray-800 font-bold">Recommended for You</h3>
          <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] px-2 py-0.5 rounded-full font-bold border border-[#22C55E]/20">
            BY RINAI
          </span>
        </div>
        <button className="flex items-center text-[#22C55E] text-sm font-medium hover:underline">
          See All <ChevronRight size={16} />
        </button>
      </div>

      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Loader2 className="animate-spin text-[#22C55E] mb-2" size={32} />
          <p className="text-gray-400 text-sm font-medium">
            RinAI sedang memilihkan makanan terbaik untukmu...
          </p>
        </div>
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* FIX: Membatasi hanya 4 makanan saja sesuai request */}
          {foods.slice(0, 4).map((food) => (
            <FoodCard key={food.id} food={food} userId={userId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-3xl">
          Belum ada rekomendasi yang cocok dengan profilmu.
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
