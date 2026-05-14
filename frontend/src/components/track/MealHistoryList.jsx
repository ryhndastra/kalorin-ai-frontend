import React from "react";
import MealHistoryCard from "./MealHistoryCard";

const MealHistoryList = ({ logs, selectedDate }) => {
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-5">
        {formattedDate} Meal Log
      </h2>

      <div className="space-y-4">
        {logs.map((log) => (
          <MealHistoryCard key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
};

export default MealHistoryList;
