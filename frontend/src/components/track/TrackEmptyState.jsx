import React from "react";
import { Utensils } from "lucide-react";

const TrackEmptyState = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 py-20 px-6 text-center shadow-sm">
      <div className="w-20 h-20 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-5 text-[#22C55E]">
        <Utensils size={36} />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        No meals tracked yet
      </h2>

      <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
        Start adding meals from Analyze or Recommendations to build your
        nutrition history.
      </p>
    </div>
  );
};

export default TrackEmptyState;
