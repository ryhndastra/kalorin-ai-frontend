import React from "react";

const AnalyzeSkeleton = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* NAVBAR SKELETON */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        {/* Logo KaloriN  */}
        <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-16 h-4 bg-gray-200 rounded-md animate-pulse"
            ></div>
          ))}
        </div>

        {/* Profile Avatar */}
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-10 pb-6">
        {/* Title: Food Analysis */}
        <div className="mb-8">
          <div className="w-48 h-8 bg-gray-200 rounded-md mb-3 animate-pulse"></div>
          <div className="w-72 h-4 bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        {/* Tabs: Scan Image & Search Food */}
        <div className="flex bg-gray-50 p-1 rounded-2xl w-full border border-gray-100">
          {/* Active Tab Skeleton */}
          <div className="flex-1 h-12 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
          {/* Inactive Tab Skeleton */}
          <div className="flex-1 h-12 bg-transparent rounded-xl"></div>
        </div>
      </div>

      {/* area foto */}
      <div className="flex-1 bg-[#F0FDF4] w-full flex justify-center pt-10 pb-20 px-6">
        <div className="w-full max-w-5xl bg-transparent border-2 border-dashed border-[#4ADE80] rounded-[32px] flex flex-col items-center justify-center py-20 px-4">
          {/* Icon Kamera / Lingkaran Hijau */}
          <div className="w-16 h-16 bg-[#DCFCE7] rounded-full mb-6 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-[#86EFAC] rounded-md"></div>
          </div>

          {/* Teks "Scan Your Food" & Deskripsi */}
          <div className="w-40 h-6 bg-[#BBF7D0] rounded-md mb-4 animate-pulse"></div>
          <div className="w-80 h-4 bg-[#BBF7D0] rounded-md mb-2 animate-pulse"></div>
          <div className="w-64 h-4 bg-[#BBF7D0] rounded-md mb-10 animate-pulse"></div>

          {/* Tombol Take Photo & Upload Photo */}
          <div className="flex gap-4">
            <div className="w-36 h-12 bg-[#22C55E] opacity-60 rounded-xl animate-pulse"></div>
            <div className="w-36 h-12 bg-white rounded-xl animate-pulse shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeSkeleton;
