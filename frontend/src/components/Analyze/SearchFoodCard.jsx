import React from "react";

const SearchFoodCard = ({ food }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
      {/* IMAGE */}
      <img
        src={food.image}
        alt={food.name}
        className="w-24 h-24 rounded-2xl object-cover bg-gray-100"
      />

      {/* CONTENT */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-lg mb-1">{food.name}</h3>
        <p className="text-sm text-[#22C55E] font-semibold mb-4">
          {food.calories} kcal
        </p>

        {/* MACROS */}
        <div className="flex gap-5 text-sm">
          <div>
            <span className="font-bold text-gray-800">{food.proteins}g</span>
            <p className="text-gray-500 text-xs">Protein</p>
          </div>

          <div>
            <span className="font-bold text-gray-800">
              {food.carbohydrate}g
            </span>
            <p className="text-gray-500 text-xs">Carbs</p>
          </div>

          <div>
            <span className="font-bold text-gray-800">{food.fat}g</span>
            <p className="text-gray-500 text-xs">Fat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFoodCard;
