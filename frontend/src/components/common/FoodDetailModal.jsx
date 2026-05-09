/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Flame,
  Utensils,
  Zap,
  Droplets,
  BrainCircuit,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFoodRecommendation } from "../../api/aiService";
import { useAuth } from "../../context/AuthProvider";

const FoodDetailModal = ({ food, isOpen, onClose, onAiDataReceived }) => {
  const { user } = useAuth(); // ambil user dari Firebase
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const hasFetched = useRef(false);

  const typeText = useCallback((text) => {
    const str = String(text ?? "Rekomendasi sedang disiapkan...");
    let i = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText(str.slice(0, i + 1));
      i++;
      if (i >= str.length) clearInterval(interval);
    }, 15);
    return interval;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText("");
      return;
    }

    if (!food?.id || !user?.id) return;

    // cek cache biar ga boros prompt
    const cacheKey = `rinai-${user.id}-${food.id}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      setAiData(parsed);
      typeText(parsed.explanation); // langsung ngetik dari cache
      return; // stop, ga usah fetch lagi
    }

    // kalau gaada cache, baru fetch
    const fetchAI = async () => {
      setLoading(true);
      try {
        const res = await getFoodRecommendation(user.id, parseInt(food.id));
        const textToDisplay =
          res.recommendation?.explanation || res.recommendation;

        const dataToCache = {
          explanation: textToDisplay,
          match_score_percent: res.recommendation?.match_score_percent || 100,
        };

        // simpen ke state dan cache sekaligus
        setAiData(dataToCache);
        sessionStorage.setItem(cacheKey, JSON.stringify(dataToCache));

        typeText(textToDisplay);
      } catch (err) {
        setDisplayedText("Gagal mengambil analisis.");
      } finally {
        setLoading(false);
      }
    };

    fetchAI();
  }, [isOpen, food?.id, user?.id, typeText, onAiDataReceived]);

  return (
    <AnimatePresence>
      {isOpen && food && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white z-20 transition-colors"
            >
              <X size={20} />
            </button>

            <img
              src={food.image}
              className="w-full h-52 object-cover"
              alt={food.name}
            />

            <div className="p-6 text-left">
              <h2 className="text-2xl font-bold text-gray-800">{food.name}</h2>
              <p className="text-gray-500 text-sm mb-6 italic">
                Nutritional info per serving
              </p>

              {/* nutritions grid */}
              <div className="grid grid-cols-4 gap-2 mb-6 text-center">
                <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
                  <Flame size={14} className="mx-auto" />
                  <p className="text-xs font-bold">{food.calories}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
                  <Utensils size={14} className="mx-auto" />
                  <p className="text-xs font-bold">{food.proteins}g</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded-xl text-yellow-500">
                  <Zap size={14} className="mx-auto" />
                  <p className="text-xs font-bold">{food.fat}g</p>
                </div>
                <div className="bg-purple-50 p-2 rounded-xl text-purple-500">
                  <Droplets size={14} className="mx-auto" />
                  <p className="text-xs font-bold">{food.carbohydrate}g</p>
                </div>
              </div>

              {/* analysis box */}
              <div className="bg-[#22C55E]/5 rounded-2xl p-4 border border-[#22C55E]/10 min-h-[100px]">
                <div className="flex items-center gap-2 mb-2 text-[#22C55E]">
                  <Sparkles size={16} />
                  <span className="font-bold text-sm">RinAI Analysis</span>
                </div>
                {loading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-2 bg-green-100 rounded w-full"></div>
                    <div className="h-2 bg-green-100 rounded w-3/4"></div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    {displayedText}
                    <span className="inline-block w-1 h-4 bg-[#22C55E] ml-1 animate-pulse" />
                  </p>
                )}
              </div>

              <button className="w-full mt-6 py-4 bg-[#22C55E] text-white font-bold rounded-2xl">
                Add to Meal Plan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FoodDetailModal;
