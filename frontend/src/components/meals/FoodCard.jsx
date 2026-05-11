import React, { useState } from "react";

import FoodDetailModal from "../common/FoodDetailModal";

const FoodCard = ({ food, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiData, setAiData] = useState(() => {
    if (!userId) {
      return null;
    }
    const cached = sessionStorage.getItem(`rinai-${userId}-${food.id}`);
    return cached ? JSON.parse(cached) : null;
  });

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        {/* IMAGE */}
        <div className="relative">
          <img
            src={food.image || "https://via.placeholder.com/300"}
            alt={food.name}
            className="w-full aspect-[5/4] object-cover bg-gray-100"
          />
          {/* MATCH SCORE */}
          {(food.matchScore || aiData?.match_score_percent) && (
            <div className="absolute top-3 left-3 bg-[#22C55E] text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-sm">
              {food.matchScore || aiData.match_score_percent}% Match
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col flex-1">
          {/* TITLE */}
          <h4 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">
            {food.name}
          </h4>

          {/* KCAL */}
          <p className="text-[#22C55E] font-bold text-sm mb-4">
            {food.calories} kcal
          </p>

          {/* MACROS */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div>
              <p className="font-bold text-gray-800 text-sm">
                {food.proteins}g
              </p>
              <p className="text-xs text-gray-500">Protein</p>
            </div>

            <div>
              <p className="font-bold text-gray-800 text-sm">
                {food.carbohydrate}g
              </p>
              <p className="text-xs text-gray-500">Carbs</p>
            </div>

            <div>
              <p className="font-bold text-gray-800 text-sm">{food.fat}g</p>
              <p className="text-xs text-gray-500">Fat</p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            {/* DETAILS */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="py-3 rounded-2xl bg-[#F3F8F4] text-[#3D7A50] font-semibold text-sm hover:bg-[#E8F5EC] transition-all"
            >
              Details
            </button>

            {/* ADD BUTTON */}
            <button className="py-3 rounded-2xl bg-[#22C55E] text-white font-semibold text-sm hover:bg-[#16A34A] transition-all">
              Add to Meal Plan
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
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

export default FoodCard;
