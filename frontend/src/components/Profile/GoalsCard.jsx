import React from "react";
import { Target, Flame, Zap, PencilLine } from "lucide-react";
import ProfileItem from "./ProfileItem";

const GoalsCard = ({ data, onEdit }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-lg text-gray-800">Goal Settings</h3>
      <button
        onClick={onEdit}
        className="text-green-600 flex items-center gap-2 text-sm font-semibold hover:bg-green-50 px-3 py-1 rounded-lg transition-all"
      >
        <PencilLine size={16} /> Change Goal
      </button>
    </div>
    <div className="flex flex-col">
      <ProfileItem icon={Target} label="Current Goal" value={data?.goal} />
      <ProfileItem
        icon={Flame}
        label="Daily Calories"
        value={data?.dailyCalories}
        unit="kcal"
      />
      <ProfileItem
        icon={Zap}
        label="Protein Target"
        value={data?.proteinTarget}
        unit="g / day"
      />
    </div>
  </div>
);

export default GoalsCard;
