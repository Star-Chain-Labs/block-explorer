import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaCubes, FaUsers, FaCoins, FaSignInAlt } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md"; // Added for dropdown indicator
import { routes } from "../routes/routes";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const dropdownRefs = useRef([]); // Store refs for each dropdown
  let timeoutId = null;

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !dropdownRefs.current.some((ref) => ref && ref.contains(event.target))
      ) {
        setIsDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (index) => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsDropdownOpen(index);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsDropdownOpen(null);
    }, 200); // 200ms delay to allow moving to dropdown
  };

  const toggleDropdown = (index) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };

  return (
    <nav className="fixed top-13 left-0 w-full bg-white text-black shadow-md z-40 border-t border-gray-200">
      <div className=" w-full mx-auto flex justify-between items-center px-4 py-5 sm:px-6 lg:px-8">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-black font-bold text-xl">CBM BlockExplorer</span>
          {/* <span className="text-gray-500 text-sm">A Scan Original</span> */}
        </div>

        {/* Center - Menu Items */}
        <div className="flex space-x-6">
          {routes.map((item, index) => (
            <div
              key={index}
              className="relative group"
              ref={(el) => (dropdownRefs.current[index] = el)} // Assign ref to each menu item
              onMouseEnter={() => item.dropdown && handleMouseEnter(index)}
              onMouseLeave={() => item.dropdown && handleMouseLeave()}
            >
              <NavLink
                to={item.path}
                onClick={() => item.dropdown && toggleDropdown(index)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 text-black hover:text-blue-600 transition duration-300 py-2 ${isActive ? "text-blue-600 font-bold" : ""
                  }`
                }
              >
                <item.icon />
                <span>{item.name}</span>
                {item.dropdown && <MdOutlineArrowDropDown />}
              </NavLink>

              {item.dropdown && isDropdownOpen === index && (
                <div
                  className="absolute top-full left-0 mt-2 w-60 bg-white border border-gray-300 rounded-lg shadow-lg"
                  onMouseEnter={() => clearTimeout(timeoutId)} // Keep dropdown open
                  onMouseLeave={() => item.dropdown && handleMouseLeave()}
                >
                  {item.dropdown.map((subItem, subIndex) => (
                    <NavLink
                      to={subItem.path}
                      key={subIndex}
                      onClick={() => setIsDropdownOpen(null)} // Close dropdown on selection
                      className={({ isActive }) =>
                        `flex items-center gap-1 px-4 py-2 text-black hover:bg-gray-100 hover:text-blue-500 transition duration-300 ${isActive ? "text-blue-500 bg-gray-100" : ""
                        }`
                      }
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
            className={({ isActive }) =>
              `flex items-center space-x-2 text-black hover:text-blue-500 transition duration-300 ${isActive ? "text-blue-500 font-bold" : ""
              }`
            }
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