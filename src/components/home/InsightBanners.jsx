import React from "react";
import { Target, Brain, ChevronRight } from "lucide-react";

const InsightBanners = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 mt-6 flex flex-col gap-4">
      {/* Target Banner */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#22C55E]">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Your current goal</p>
            <p className="font-bold text-gray-800">Stay Healthy</p>
          </div>
        </div>
        <button className="flex items-center text-[#22C55E] text-sm font-medium hover:underline">
          Edit <ChevronRight size={16} />
        </button>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-[#DCFCE7] rounded-2xl p-4 flex items-center gap-4 border border-[#BBF7D0]">
        <div className="w-12 h-12 rounded-xl bg-[#86EFAC] flex items-center justify-center text-green-800 shrink-0">
          <Brain size={24} />
        </div>
        <div>
          <p className="text-xs text-green-800 font-medium">AI Insight</p>
          <p className="text-sm text-gray-700 mt-0.5">
            You need{" "}
            <span className="font-bold text-gray-900">38g more protein</span>{" "}
            today. Try adding a chicken breast or Greek yogurt to your next
            meal!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightBanners;
