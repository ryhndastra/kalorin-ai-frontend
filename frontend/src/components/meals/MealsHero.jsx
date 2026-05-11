import React from "react";

import { Brain } from "lucide-react";

const MealsHero = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-6 mt-8">
      <div className="bg-[#22C55E] rounded-2xl px-8 py-5 shadow-lg shadow-[#22C55E]/10">
        <div className="flex items-center gap-4">
          {/* ICON */}
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <Brain size={28} />
          </div>

          {/* TEXT */}
          <div>
            <h2 className="text-white font-bold text-xl leading-none mb-2">
              AI-Powered Picks
            </h2>

            <p className="text-white/80 text-sm">
              Based on your diet goal & today's intake
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealsHero;
