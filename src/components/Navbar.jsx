import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCubes,
  FaUsers,
  FaCoins,
  FaSignInAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { routes } from "../routes/routes";
import logo from "../assets/robomine.jpg";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef([]);
  const timeoutRef = useRef(null);

  // Handle clicks outside to close dropdown and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !dropdownRefs.current.some((ref) => ref && ref.contains(event.target))
      ) {
        setIsDropdownOpen(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (index) => {
    // Clear any existing timeout to prevent premature closing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Open dropdown only on desktop (not mobile menu)
    if (!isMobileMenuOpen) {
      setIsDropdownOpen(index);
    }
  };

  const handleMouseLeave = (index) => {
    // Only close dropdown on desktop with a delay
    if (!isMobileMenuOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(null);
      }, 200);
    }
  };

  const toggleDropdown = (index) => {
    setIsDropdownOpen(isDropdownOpen === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(null); // Close all dropdowns when toggling mobile menu
  };

  return (
    <nav className="fixed  top-0 left-0 w-full bg-white text-black shadow-md z-40 border-b border-gray-200">
      <div className="w-full mx-auto flex justify-between items-center px-4 py-5 sm:px-6 lg:px-8">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-14 h-14 object-cover" />
          <div className="flex flex-col">
            <span className="text-black font-bold text-xl">
              CBM BlockExplorer
            </span>
            <span className="text-gray-500 text-sm">A Scan Original</span>
          </div>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-black text-2xl">
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Center - Menu Items */}
        <div
          className={`lg:flex lg:space-x-6 ${
            isMobileMenuOpen ? "flex" : "hidden"
          } flex-col lg:flex-row absolute lg:static top-24 left-0 w-full lg:w-auto bg-white lg:bg-transparent border-t border-gray-200 lg:border-none shadow-lg lg:shadow-none transition-all duration-300`}
        >
          {routes.map((item, index) => (
            <div
              key={index}
              className="relative group"
              ref={(el) => (dropdownRefs.current[index] = el)}
              onMouseEnter={() => item.dropdown && handleMouseEnter(index)}
              onMouseLeave={() => item.dropdown && handleMouseLeave(index)}
            >
              {item.dropdown ? (
                // Non-navigating button for dropdown items
                <button
                  onClick={() => toggleDropdown(index)}
                  className={`flex items-center space-x-2 text-black hover:text-blue-600 transition duration-300 py-2 px-4 lg:px-0 ${
                    isDropdownOpen === index ? "text-blue-600 " : ""
                  }`}
                >
                  <item.icon />
                  <span>{item.name}</span>
                  <MdOutlineArrowDropDown />
                </button>
              ) : (
                // NavLink for non-dropdown items
                <NavLink
                  to={item.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDropdownOpen(null);
                  }}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 text-black transition duration-300 py-2 px-4 lg:px-0  hover:text-blue-600 ${
                      isActive ? "text-blue-600 " : ""
                    }`
                  }
                >
                  <item.icon />
                  <span>{item.name}</span>
                </NavLink>
              )}

              {item.dropdown && isDropdownOpen === index && (
                <div
                  className="lg:absolute lg:top-full lg:left-0 lg:mt-2 lg:w-60 lg:bg-white lg:border lg:border-gray-300 lg:rounded-lg lg:shadow-lg flex flex-col w-full bg-gray-50 lg:bg-white"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(index)}
                  onMouseLeave={() => item.dropdown && handleMouseLeave(index)}
                >
                  {item.dropdown.map((subItem, subIndex) => (
                    <NavLink
                      to={subItem.path}
                      key={subIndex}
                      onClick={() => {
                        setIsDropdownOpen(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-1 px-4 py-2 text-black transition duration-300 hover:bg-gray-100 hover:text-blue-500 ${
                          isActive ? "text-blue-500 bg-gray-100" : ""
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
          {/* Sign In in Mobile Menu */}
          <NavLink
            to="/signin"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsDropdownOpen(null);
            }}
            className={({ isActive }) =>
              `flex items-center space-x-2 text-black transition duration-300 py-2 px-4 lg:px-0 hover:bg-gray-100 hover:text-blue-500 lg:hidden ${
                isActive ? "text-blue-500 font-bold bg-gray-100" : ""
              }`
            }
          >
            <FaSignInAlt />
            <span>Sign In</span>
          </NavLink>
        </div>

        {/* Right - Sign In (Desktop) */}
        <div className="hidden lg:flex">
          <NavLink
            to="/signin"
            className={({ isActive }) =>
              `flex items-center space-x-2 text-black transition duration-300 hover:bg-gray-100 hover:text-blue-500 py-2 px-2 ${
                isActive ? "text-blue-500 font-bold bg-gray-100" : ""
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
