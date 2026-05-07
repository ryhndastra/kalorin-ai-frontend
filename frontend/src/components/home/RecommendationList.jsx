import React from "react";
import { ChevronRight } from "lucide-react";

// Dummy Data, nanti ganti pake API
const recommendations = Array(4).fill({
  id: Math.random(),
  name: "Salad with Chicken",
  calories: "420 kcal",
  image:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80",
});

const RecommendationList = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 mt-8 mb-12">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 font-bold">Recommended for You</h3>
        <button className="flex items-center text-[#22C55E] text-sm font-medium hover:underline">
          See All <ChevronRight size={16} />
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-50 hover:shadow-md transition-shadow cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-32 object-cover rounded-xl mb-3"
            />
            <h4 className="font-bold text-gray-800 text-sm truncate">
              {item.name}
            </h4>
            <p className="text-xs text-gray-500">{item.calories}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
