import React from "react";
import Navbar from "../components/Navbar/Navbar";

const HomePage = () => {
  const user = null;
  return (
    <div>
      <Navbar user={user} />
      HomePage
    </div>
  );
};

export default HomePage;
