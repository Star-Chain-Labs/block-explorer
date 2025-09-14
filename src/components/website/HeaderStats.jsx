import React from "react";
import { motion } from "framer-motion";

// Header Stats Component
const HeaderStats = () => {
  const stats = [
    { number: "35", label: "Global Reach" },
    { number: "700", label: "Blockchain Nodes" },
    { number: "300", label: "Active Stakers" },
    { number: "55", label: "Strategic Partners" },
  ];

  return (
    <div className="bg-gradient-to-r from-[#249ec7] via-[#071232] to-[#071232] text-white py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            className="p-4 bg-white/10 rounded-2xl shadow-lg"
          >
            <h2 className="text-3xl font-bold">{stat.number}</h2>
            <p className="text-sm mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeaderStats;
