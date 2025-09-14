
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaCube, FaUsers, FaCoins, FaSignInAlt } from "react-icons/fa";
import {routes} from "../routes/routes"
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);


  return (
    <nav className="fixed top-13 left-0 w-full bg-white text-black shadow-md z-40 border-t border-gray-200">
      <div className="max-w-[90%] w-full mx-auto flex justify-between items-center px-4 py-5 sm:px-6 lg:px-8">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-black font-bold text-xl">CBM BlockExplorer</span>
          <span className="text-gray-500 text-sm">A Scan Original</span>
        </div>

        {/* Center - Menu Items */}
        <div className="flex space-x-6">
          {routes.map((item, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => item.dropdown && setIsDropdownOpen(index)}
              onMouseLeave={() => item.dropdown && setIsDropdownOpen(null)}
            >
              <NavLink
                to={item.path}
                className="flex items-center space-x-2 text-black hover:text-blue-600 transition duration-300 py-2"
              >
                <item.icon />
                <span>{item.name}</span>
              </NavLink>

              {item.dropdown && isDropdownOpen === index && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {item.dropdown.map((subItem, subIndex) => (
                    <NavLink
                      to={subItem.path}
                      key={subIndex}
                      className="flex items-center gap-1 px-4 py-2 text-black hover:bg-gray-100 hover:text-blue-500 transition duration-300"
                    >
                      <subItem.icon />
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right - Sign In */}
        <div>
          <NavLink
            to="/signin"
            className="flex items-center space-x-2 text-black hover:text-blue-500"
          >
            <FaSignInAlt />
            <span>Sign In</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
