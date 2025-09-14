import React from "react";
import { motion } from "framer-motion";

const ImpactfulFacts = () => {
  const facts = [
    { number: "1150", label: "Registered Projects" },
    { number: "5223", label: "Transactions Count" },
    { number: "4522", label: "Active Members" },
  ];

  return (
    <div className="bg-gradient-to-r from-[#071232] via-[#071232] to-[#249ec7] text-white py-16 text-center">
      <h2 className="text-3xl font-bold mb-6">Impactful Facts</h2>
      <p className="max-w-3xl mx-auto mb-10 text-gray-300">
        Cryptocurrency is reshaping the financial ecosystem by making
        transactions faster, transparent, and more secure.
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {facts.map((fact, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white/10 rounded-2xl shadow-lg"
          >
            <h3 className="text-3xl font-bold">{fact.number}</h3>
            <p className="mt-2 text-sm">{fact.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


export default ImpactfulFacts;
