// import React from 'react'
// import { motion } from 'framer-motion'
// import bg from "../../assets/bg.jpg"
// const About = () => {
//   const stats = [
//     { number: "3.7K", label: "Token holders" },
//     { number: "3.6M", label: "Votes delegated" },
//     { number: "146", label: "Delegated addresses" },
//     { number: "23", label: "Proposals" },
//   ];

//   return (
//     <div
//       id='about'
//       className="bg-gradient-to-r from-[#249ec7] via-[#071232] to-[#071232] text-white py-20 px-6 text-center relative overflow-hidden"
//     >
//       {/* Background animation */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.15 }}
//         transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
//         className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#249ec7_0%,_transparent_70%)]"
//       ></motion.div>

//       <motion.h2
//         initial={{ y: -30, opacity: 0 }}
//         whileInView={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="text-3xl md:text-4xl font-bold mb-4 relative z-10"
//       >
//         What is ROBOMINE Token
//       </motion.h2>

//       <motion.p
//         initial={{ y: 20, opacity: 0 }}
//         whileInView={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.9, delay: 0.2 }}
//         className="text-lg text-gray-300 max-w-3xl mx-auto mb-10 relative z-10"
//       >
//         <strong>ROBOMINE Token</strong> is a decentralized blockchain-based currency designed to empower users in the digital financial ecosystem. Seamless, secure, and transparent transactions are at the heart of our mission.
//       </motion.p>

//       <motion.p
//         initial={{ y: 20, opacity: 0 }}
//         whileInView={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.9, delay: 0.4 }}
//         className="text-gray-400 max-w-4xl mx-auto mb-12 relative z-10"
//       >
//         The rise of blockchain technology has ushered in a new wave of financial systems. ROBOMINE Token leverages the power of smart contracts to create decentralized solutions across industries, providing global access to secure and cost-effective transactions. Join the revolution of digital finance.
//       </motion.p>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto relative z-10">
//         {stats.map((item, i) => (
//           <motion.div
//             key={i}
//             whileHover={{ scale: 1.1 }}
//             transition={{ type: "spring", stiffness: 200 }}
//             className="p-4 bg-white/10 rounded-xl shadow-md"
//           >
//             <h3 className="text-2xl font-bold">{item.number}</h3>
//             <p className="text-gray-400">{item.label}</p>
//           </motion.div>
//         ))}
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 0.6 }}
//         className="mt-12 flex justify-center gap-4 relative z-10"
//       >
//         <button className="px-6 py-2 bg-white text-[#071232] font-semibold rounded-lg shadow hover:bg-gray-200 transition">
//           Visit Forum
//         </button>
//         <button className="px-6 py-2 bg-[#249ec7] font-semibold rounded-lg shadow hover:bg-[#1c7da0] transition">
//           Enter Governance
//         </button>
//       </motion.div>
//     </div>
//   )
// }

// export default About



import React from 'react'
import { motion } from 'framer-motion'
import bg from "../../assets/bg.png"

const About = () => {
  const stats = [
    { number: "3.7K", label: "Token holders" },
    { number: "3.6M", label: "Votes delegated" },
    { number: "146", label: "Delegated addresses" },
    { number: "23", label: "Proposals" },
  ];

  return (
    <div
      id='about'
      className="bg-gradient-to-r from-[#249ec7] via-[#071232] to-[#071232] text-white py-20 px-6 text-center relative overflow-hidden"
    >
      {/* Radial Gradient Background Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#249ec7_0%,_transparent_70%)]"
      ></motion.div>

      {/* Right Side Infinite Rotating BG Image */}
      <motion.img
        src={bg}
        alt="background"
        className="absolute right-[-150px] top-1/2 transform -translate-y-1/2 w-[500px] opacity-20"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      />

      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-4 relative z-10"
      >
        What is ROBOMINE Token
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="text-lg text-gray-300 max-w-3xl mx-auto mb-10 relative z-10"
      >
        <strong>ROBOMINE Token</strong> is a decentralized blockchain-based currency designed to empower users in the digital financial ecosystem. Seamless, secure, and transparent transactions are at the heart of our mission.
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="text-gray-400 max-w-4xl mx-auto mb-12 relative z-10"
      >
        The rise of blockchain technology has ushered in a new wave of financial systems. ROBOMINE Token leverages the power of smart contracts to create decentralized solutions across industries, providing global access to secure and cost-effective transactions. Join the revolution of digital finance.
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto relative z-10">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-4 bg-white/10 rounded-xl shadow-md"
          >
            <h3 className="text-2xl font-bold">{item.number}</h3>
            <p className="text-gray-400">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 flex justify-center gap-4 relative z-10"
      >
        <button className="px-6 py-2 bg-white text-[#071232] font-semibold rounded-lg shadow hover:bg-gray-200 transition">
          Visit Forum
        </button>
        <button className="px-6 py-2 bg-[#249ec7] font-semibold rounded-lg shadow hover:bg-[#1c7da0] transition">
          Enter Governance
        </button>
      </motion.div>
    </div>
  )
}

export default About
