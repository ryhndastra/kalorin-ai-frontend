import React from "react";

const MacroBar = ({ label, percentage, color, bgTrack }) => (
  <div className="mb-3 last:mb-0">
    <div className="flex justify-between text-white text-xs font-medium mb-1">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className={`w-full h-2 rounded-full overflow-hidden ${bgTrack}`}>
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const HeroDashboard = ({ user }) => {
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "User";

  return (
    <div className="bg-[#4ADE80] rounded-b-[40px] pt-8 pb-12 px-6 shadow-sm">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-white text-sm font-medium">Hello,</h2>
        <h1 className="text-white text-2xl font-bold mb-6">{firstName}!</h1>

        <div className="bg-[#86EFAC]/40 backdrop-blur-sm border border-white/20 rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-center">
          <div className="relative flex flex-col items-center justify-center w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-green-700/20"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray="502"
                strokeDashoffset="165"
                className="text-white"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-white">
              <span className="text-3xl font-bold">1,240</span>
              <span className="text-xs opacity-90">kcal eaten</span>
            </div>
          </div>

          <div className="text-white text-center md:hidden">
            <p className="font-bold">610 kcal left</p>
            <p className="text-xs opacity-80">of 1,850 kcal goal</p>
          </div>

          <div className="flex-1 w-full flex flex-col justify-center">
            <div className="hidden md:block text-white mb-6">
              <p className="font-bold text-lg">610 kcal left</p>
              <p className="text-sm opacity-80">of 1,850 kcal goal</p>
            </div>

            <MacroBar
              label="Protein"
              percentage={100}
              color="bg-[#22C55E]"
              bgTrack="bg-green-700/20"
            />
            <MacroBar
              label="Carbs"
              percentage={75}
              color="bg-[#60A5FA]"
              bgTrack="bg-white/40"
            />
            <MacroBar
              label="Fat"
              percentage={50}
              color="bg-[#F59E0B]"
              bgTrack="bg-white/40"
            />
            <MacroBar
              label="Water"
              percentage={75}
              color="bg-[#818CF8]"
              bgTrack="bg-white/40"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;
