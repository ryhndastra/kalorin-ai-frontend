import React from "react";
import {
  Flame,
  Beef,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const comparisonConfig = {
  calories: {
    title: "Calories",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-50",
    positiveText: "Calorie intake became more stable than last week.",
    negativeText:"Calorie consistency dropped compared to last week.",
  },
  protein: {
    title: "Protein",
    icon: Beef,
    color: "text-blue-500",
    bg: "bg-blue-50",
    positiveText: "Protein intake improved compared to last week.",
    negativeText: "Protein intake consistency decreased this week.",
  },
  tracking: {
    title: "Tracking Consistency",
    icon: CalendarCheck,
    color: "text-green-500",
    bg: "bg-green-50",
    positiveText: "You tracked meals more consistently this week.",
    negativeText: "Tracking consistency was lower than last week.",
  },
};

const WeeklyComparisonCard = ({ type, percentage, hasPreviousData }) => {
  const config = comparisonConfig[type] || comparisonConfig.calories;
  const Icon = config.icon;
  const positive = percentage >= 0;
  return (
    <div className="bg-gradient-to-br from-white to-[#F8FAFC] border border-gray-100 rounded-[2rem] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* TOP */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${config.bg}`}
          >
            <Icon className={config.color} size={24} />
          </div>
          <p className="text-sm text-gray-500 font-medium">{config.title}</p>
        </div>

        {!hasPreviousData && (
          <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-semibold">
            Locked
          </div>
        )}
      </div>

      {/* CONTENT */}
      {hasPreviousData ? (
        <>
          {/* VALUE */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                positive ? "bg-[#DCFCE7]" : "bg-red-50"
              }`}
            >
              {positive ? (
                <TrendingUp className="text-[#22C55E]" size={20} />
              ) : (
                <TrendingDown className="text-red-500" size={20} />
              )}
            </div>
            <h3
              className={`text-4xl font-bold tracking-tight ${
                positive ? "text-[#22C55E]" : "text-red-500"
              }`}
            >
              {positive ? "+" : ""}
              {percentage}%
            </h3>
          </div>

          {/* LABEL */}
          <p className="text-gray-600 leading-relaxed">
            {positive ? config.positiveText : config.negativeText}
          </p>
          <div className="mt-5 text-sm text-gray-400">
            Compared to previous week
          </div>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Build Your Baseline
          </h3>
          <p className="text-gray-500 leading-relaxed">
            Track another week to unlock personalized comparison insights and
            weekly progress trends.
          </p>
        </>
      )}
    </div>
  );
};

export default WeeklyComparisonCard;
