import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import logo from "../assets/logo.png";
import CommingSoon from "./CommingSoon";
import { TbChartCandle } from "react-icons/tb";
import { LucideChartCandlestick } from "lucide-react";

const Navbar = ({ isCommingSoon, setIsCommingSoon }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef([]);
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest('button[data-prevent-close]')
      ) {
        setIsDropdownOpen(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!isMobileMenuOpen) {
      setIsDropdownOpen(index);
    }
  };

  const handleMouseLeave = (index) => {
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
    setIsDropdownOpen(null);
  };

  return (
    <nav className="fixed  top-0 left-0 w-full bg-white text-black shadow-md z-40 border-b border-gray-200">
      <div className="w-full mx-auto flex justify-between items-center px-4 py-5 sm:px-6 lg:px-8">
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
          <img src={logo} alt="logo" className="w-14 h-14 object-cover" />
          <div className="flex flex-col">
            <span className="text-black font-bold text-xl">
              CBM BlockExplorer
            </span>
            <span className="text-gray-500 text-sm">A Scan Original</span>
          </div>
        </div>

        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-black text-2xl">
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div
          className={`lg:flex lg:space-x-6 ${isMobileMenuOpen ? "flex" : "hidden"
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
                <button
                  onClick={() => toggleDropdown(index)}
                  className={`flex items-center space-x-2 text-black hover:text-blue-600 transition duration-300 py-2 px-4 lg:px-0 ${isDropdownOpen === index ? "text-blue-600 " : ""
                    }`}
                >
                  <item.icon />
                  <span>{item.name}</span>
                  <MdOutlineArrowDropDown />
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDropdownOpen(null);
                  }}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 text-black transition duration-300 py-2 px-4 lg:px-0  hover:text-blue-600 ${isActive ? "text-blue-600 " : ""
                    }`
                  }
                >
                  <item.icon />
                  <span>{item.name}</span>
                </NavLink>
              )}

              {item.dropdown && isDropdownOpen === index && (
                <div
                  className="lg:absolute lg:top-full lg:left-0 lg:mt-2 lg:w-60 lg:bg-white lg:border lg:border-gray-300 lg:rounded-lg lg:shadow-lg flex flex-col w-full bg-gray-50 "
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
                        `flex items-center gap-1 px-4 py-2 text-black transition duration-300 hover:bg-gray-100 hover:text-blue-500 ${isActive ? "text-blue-500 bg-gray-100" : ""
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
          <NavLink
            to="/signin"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsDropdownOpen(null);
            }}
            className={({ isActive }) =>
              `flex items-center space-x-2 text-black transition duration-300 py-2 px-4 lg:px-0 hover:bg-gray-100 hover:text-blue-500 lg:hidden ${isActive ? "text-blue-500 font-bold bg-gray-100" : ""
              }`
            }
          >
            <FaSignInAlt />
            <span>Sign In</span>
          </NavLink>
          <button
            data-prevent-close
            onClick={(e) => {
              e.stopPropagation();
              setIsCommingSoon(true);
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100 lg:hidden animate-pulse"
          >
            <LucideChartCandlestick />
            <span>Exchange</span>
          </button>
        </div>

        {/* Right - Sign In (Desktop) */}
        <div className="hidden lg:flex gap-3">
          <button
            onClick={() => setIsCommingSoon(true)}
            className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 transition duration-300 py-2 px-4 rounded-lg animate-pulse"
          >
            <LucideChartCandlestick />
            <span>Exchange</span>
          </button>

          {/* Sign In */}
          <NavLink
            to="/signin"
            className={({ isActive }) =>
              `flex items-center space-x-2 text-black transition duration-300 hover:bg-gray-100 hover:text-blue-500 py-2 px-2 ${isActive ? "text-blue-500 font-bold bg-gray-100" : ""
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
