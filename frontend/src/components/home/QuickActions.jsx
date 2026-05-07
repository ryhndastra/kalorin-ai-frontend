import React from "react";
import { Camera, Search, Plus, BarChart2 } from "lucide-react";

const actions = [
  { id: 1, label: "Scan Food", icon: Camera },
  { id: 2, label: "Search", icon: Search },
  { id: 3, label: "Add Meal", icon: Plus },
  { id: 4, label: "Insight", icon: BarChart2 },
];

const QuickActions = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 mt-8">
      <h3 className="text-gray-800 font-bold mb-4">Quick Action</h3>
      <div className="bg-white rounded-3xl p-6 shadow-sm flex justify-between items-center border border-gray-50">
        {actions.map((action) => (
          <button
            key={action.id}
            className="flex flex-col items-center gap-2 group transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#22C55E] flex items-center justify-center group-hover:bg-[#22C55E] group-hover:text-white transition-colors">
              <action.icon size={24} />
            </div>
            <span className="text-xs font-medium text-gray-600">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
