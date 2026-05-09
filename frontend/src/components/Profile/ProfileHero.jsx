import React, { memo } from "react";

// memo() bakal ngecek: "data yang masuk (user & userData) berubah ga?"
// kalau isinya sama kayak sebelumnya, dia skip re render.
const ProfileHero = memo(({ user, userData }) => {
  console.log(
    "DEBUG - Render ProfileHero:",
    userData?.fullName || "Loading...",
  );

  // ambil data fisik dengan proteksi default
  const weight = userData?.weight || "--";
  const height = userData?.height || "--";
  const bmi = userData?.bmi || "0.0";
  const bmiStatus = userData?.bmiStatus || "Unknown";

  // helper untuk warna badge status BMI
  const getStatusStyle = (status) => {
    switch (status) {
      case "Ideal/Normal":
        return "bg-white text-[#22C55E]";
      case "Underweight":
        return "bg-yellow-400 text-white";
      case "Overweight":
      case "Obese":
        return "bg-red-500 text-white";
      default:
        return "bg-white/30 text-white";
    }
  };

  return (
    <div className="w-full bg-[#22C55E] pt-12 pb-16 flex flex-col items-center justify-center text-white rounded-b-[40px] shadow-sm relative overflow-hidden transition-all duration-500">
      {/* dekorasi background */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* profile picture */}
      <div className="relative z-10 w-28 h-28 bg-white/20 rounded-full border-4 border-white/40 overflow-hidden mb-4 shadow-2xl transition-transform hover:scale-105 duration-300">
        <img
          src={
            user?.photoURL ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || "Felix"}`
          }
          className="w-full h-full object-cover"
          alt="profile"
        />
      </div>

      {/* nama & email */}
      <div className="text-center z-10 mb-6 px-4">
        <h2 className="text-2xl font-bold tracking-tight uppercase">
          {userData?.fullName || user?.displayName || "User"}
        </h2>
        <p className="text-white/70 text-sm font-medium">
          {user?.email || "user@example.com"}
        </p>
      </div>

      {/* stats grid */}
      <div className="z-10 flex gap-4 w-full max-w-[350px] justify-center px-4">
        {/* Weight Box */}
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center flex flex-col justify-center">
          <p className="text-[10px] uppercase opacity-70 font-bold tracking-widest mb-1">
            Weight
          </p>
          <p className="text-xl font-bold">
            {weight}
            <span className="text-[10px] ml-0.5 font-normal opacity-80">
              kg
            </span>
          </p>
        </div>

        {/* height box */}
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center flex flex-col justify-center">
          <p className="text-[10px] uppercase opacity-70 font-bold tracking-widest mb-1">
            Height
          </p>
          <p className="text-xl font-bold">
            {height}
            <span className="text-[10px] ml-0.5 font-normal opacity-80">
              cm
            </span>
          </p>
        </div>

        {/* BMI Box */}
        <div className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3 text-center flex flex-col items-center justify-center">
          <p className="text-[10px] uppercase opacity-70 font-bold tracking-widest mb-1">
            BMI
          </p>
          <p className="text-xl font-bold leading-tight">{bmi}</p>
          <span
            className={`mt-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm transition-colors duration-300 ${getStatusStyle(bmiStatus)}`}
          >
            {bmiStatus}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ProfileHero;
