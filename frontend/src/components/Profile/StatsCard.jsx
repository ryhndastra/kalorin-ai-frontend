import React from "react";
import { PencilLine, User, Weight, Ruler } from "lucide-react";
import ProfileItem from "./ProfileItem";

const StatsCard = ({ data, onEdit }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-lg text-gray-800">Body Stats</h3>
      <button
        onClick={onEdit}
        className="text-green-600 flex items-center gap-2 text-sm font-semibold hover:bg-green-50 px-3 py-1 rounded-lg transition-all"
      >
        <PencilLine size={16} /> Edit
      </button>
    </div>
    <div className="flex flex-col">
      <ProfileItem icon={User} label="Age" value={data?.age} unit="years" />
      <ProfileItem
        icon={Weight}
        label="Weight"
        value={data?.weight}
        unit="kg"
      />
      <ProfileItem icon={Ruler} label="Height" value={data?.height} unit="cm" />
    </div>
  </div>
);

export default StatsCard;
