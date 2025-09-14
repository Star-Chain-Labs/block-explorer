import React from "react";

const Navbar = () => {
  const menuItems = [
    { name: "Home", id: "#home" },
    { name: "About", id: "#about" },
    { name: "Services", id: "#services" },
    { name: "FAQ", id: "#faq" },
    { name: "Contact", id: "#contact" },
  ];

  return (
    <nav className="fixed top-13 left-0 w-full bg-transparent backdrop-blur-lg text-white shadow-md z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          {/* <img src="/logo.png" alt="Logo" className="w-10 h-10" /> */}
          <span className="text-white font-bold text-lg">ROBOMINE</span>
        </div>

        {/* Center - Menu Items */}
        <div className="flex space-x-8">
          {menuItems.map((item, index) => (
            <a
              href={item.id}
              key={index}
              className="relative text-white font-medium transition duration-300 hover:text-yellow-400 nav-link"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right - Start Now Button */}
        <div>
          <a
            href="/start"
            className="bg-white text-black font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 border border-transparent hover:border-black hover:scale-105 transition"
          >
            Start Now
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
