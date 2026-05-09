import axios from "axios";

export const syncUserToDb = async (user, fullName = null) => {
  try {
    await axios.post("http://localhost:5000/api/profile", {
      userId: user.uid,
      name: fullName || user.displayName || "User",
      email: user.email,
    });
    console.log("Supabase Sync: Success (Identity only)");
  } catch (error) {
    console.error("Supabase Sync: Failed", error);
  }
};
