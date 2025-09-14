import React from "react";
import { motion } from "framer-motion";
import {
  FaMoneyCheckAlt,
  FaWallet,
  FaKey,
  FaChartPie,
  FaShieldAlt,
  FaCreditCard,
} from "react-icons/fa";

const Services = () => {
  const services = [
    {
      icon: <FaMoneyCheckAlt size={40} className="text-green-400" />,
      title: "INSTANT BLOCKCHAIN TRANSACTIONS",
      desc: "Experience fast and secure transactions with ROBOMINE Token, eliminating delays often seen in traditional financial systems.",
    },
    {
      icon: <FaWallet size={40} className="text-red-400" />,
      title: "RECURRING STAKING REWARDS",
      desc: "Earn consistent returns by participating in our staking programs, designed to maximize your investment in a secure ecosystem.",
    },
    {
      icon: <FaKey size={40} className="text-blue-400" />,
      title: "SAFE AND DECENTRALIZED",
      desc: "With blockchain's decentralized nature, your assets are fully secure, with complete control over your transactions.",
    },
    {
      icon: <FaChartPie size={40} className="text-yellow-400" />,
      title: "CUSTOM INVESTMENT STRATEGIES",
      desc: "Robomine offers tailored investment plans that suit both beginners and experienced traders to optimize returns.",
    },
    {
      icon: <FaShieldAlt size={40} className="text-teal-400" />,
      title: "INSURED ASSET PROTECTION",
      desc: "Your investments are protected, with built-in insurance to ensure peace of mind while engaging in the crypto market.",
    },
    {
      icon: <FaCreditCard size={40} className="text-purple-400" />,
      title: "SEAMLESS CRYPTO TRANSACTIONS",
      desc: "Enjoy hassle-free transactions with ROBOMINE Token, ensuring that sending and receiving crypto is as easy as possible.",
    },
  ];

  return (
    <div id="services" className="relative overflow-hidden">
      {/* 🔵 Background moving blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-r from-[#249ec7] via-[#071232] to-[#071232] text-white py-20 px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-[#249ec7] uppercase tracking-wide">
            Buy and Sell ROBOMINE Token
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            WHY CHOOSE ROBOMINE TOKEN
          </h2>
          <p className="text-gray-300 mt-4 max-w-3xl mx-auto">
            ROBOMINE Token offers a new wave of secure, decentralized finance,
            providing seamless and transparent transactions with significant
            growth potential in the digital ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.08, rotate: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center 
                         border border-white/20 cursor-pointer"
            >
              <motion.div
                initial={{ rotate: -15, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                {service.icon}
              </motion.div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {service.title}
              </h3>
              <p className="text-gray-300 text-sm">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;