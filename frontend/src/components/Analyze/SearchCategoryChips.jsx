import React from "react";

const SearchCategoryChips = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <>
      <p className="text-xs text-gray-500 mb-4">Browse Categories</p>
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setSelectedCategory(item)}
            className={`px-4 py-2 rounded-xl text-xs transition-all border ${
              selectedCategory === item
                ? "bg-[#22C55E] text-white border-[#22C55E]"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#22C55E] hover:text-[#22C55E]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );
};

export default SearchCategoryChips;
