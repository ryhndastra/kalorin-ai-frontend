import React from "react";
const MealHistoryCard = ({ log }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E7EFE8] p-5 shadow-sm">
      <h3 className="font-medium text-gray-700 text-base mb-3">
        {log.foodName}
      </h3>
      <p className="text-[#22C55E] font-semibold text-sm mb-5">
        {Math.round(log.calories)} kcal
      </p>
      <div className="flex items-center gap-12 text-sm">
        <div>
          <p className="font-bold text-gray-800">{log.proteins}g</p>
          <p className="text-gray-500 text-xs">Protein</p>
        </div>

        <div>
          <p className="font-bold text-gray-800">{log.carbs}g</p>
          <p className="text-gray-500 text-xs">Carbs</p>
        </div>

        <div>
          <p className="font-bold text-gray-800">{log.fat}g</p>
          <p className="text-gray-500 text-xs">Fat</p>
        </div>
      </div>
    </div>
  );
};

export default MealHistoryCard;
