import React, { useEffect } from "react";

const CommingSoon = ({ setIsCommingSoon }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsCommingSoon(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setIsCommingSoon]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      {/* Fireworks Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="firework"></div>
        <div className="firework"></div>
        <div className="firework"></div>
      </div>

      {/* Popup Box */}
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-7 text-center animate-popup">
        <h2 className="text-3xl font-extrabold mb-3 text-blue-600 drop-shadow">
          Coming Soon 🚀
        </h2>

        <p className="text-gray-600 text-lg mb-6">
          This feature is under active development.
        </p>

        <button
          onClick={() => setIsCommingSoon(false)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CommingSoon;
