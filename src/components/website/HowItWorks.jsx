import React from "react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Set Up Wallet",
      desc: "Create your personal wallet to store digital assets.",
    },
    {
      step: "2",
      title: "Make Secure Payments",
      desc: "Send & receive crypto payments safely.",
    },
    {
      step: "3",
      title: "Buy or Sell",
      desc: "Start crypto trading instantly.",
    },
  ];

  return (
    <div className="bg-gradient from:bg-gray-800 to:bg-blue-800 text-center py-16">
      <h2 className="text-2xl font-bold mb-10">How It Works</h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="p-6 border rounded-2xl shadow-md bg-gray-50"
          >
            <h3 className="text-xl font-semibold mb-2">
              {s.step}. {s.title}
            </h3>
            <p className="text-sm text-gray-600">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
