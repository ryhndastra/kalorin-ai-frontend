import React from "react";

const ProfileHero = ({ user }) => {
  return (
    <div className="w-full bg-[#22C55E] py-12 flex flex-col items-center justify-center text-white rounded-b-[40px] shadow-sm">
      <div className="w-24 h-24 bg-white/20 rounded-full border-4 border-white/30 overflow-hidden mb-4 shadow-lg">
        <img
          src={
            user?.photoURL ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          }
          className="w-full h-full object-cover"
          alt="profile"
        />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold">{user?.displayName || "User"}</h2>
        <p className="text-white/80 text-sm mt-1">
          {user?.email || "user@example.com"}
        </p>
      </div>
    </div>
  );
};

export default ProfileHero;
