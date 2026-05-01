import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Home", path: "/home" },
  { name: "Analyze", path: "/analyze" },
  { name: "Meals", path: "/meals" },
  { name: "Track", path: "/track" },
  { name: "Insights", path: "/insights" },
];

const NavLinks = () => {
  return (
    <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
      {menuItems.map((item) => (
        <li key={item.name}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "text-green-500 font-bold"
                : "text-gray-500 hover:text-gray-900 transition-colors"
            }
          >
            {item.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
