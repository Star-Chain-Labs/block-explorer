import React, { useState } from "react";
import { FaPlus, FaTimes, FaDownload, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How do I start trading RBM tokens?",
      answer:
        "To start trading RBM tokens, you need to create an account on our platform, complete the verification process, and then deposit funds. After that, you can trade RBM tokens securely across supported exchanges or directly within the ROBOMINE ecosystem.",
    },
    {
      question: "How do I find out the status of my RBM token transaction?",
      answer:
        "You can track your transaction status directly from your account dashboard or by using the blockchain explorer integrated with our system.",
    },
    {
      question: "How can I earn with RBM tokens?",
      answer:
        "You can earn with RBM tokens by participating in staking programs, investment plans, or trading them on supported exchanges.",
    },
    {
      question: "Is RBM a secure cryptocurrency for transactions?",
      answer:
        "Yes, RBM leverages blockchain’s decentralized technology to ensure all transactions are secure, transparent, and tamper-proof.",
    },
    {
      question: "What is the turnaround time for RBM token transactions?",
      answer:
        "RBM token transactions are typically processed instantly, though in rare cases network congestion may cause a short delay.",
    },
  ];

  const brochures = [
    { name: "Download .PDF", link: "#", icon: <FaDownload /> },
    { name: "Download .DOC", link: "#", icon: <FaDownload /> },
    { name: "Download .PPT", link: "#", icon: <FaDownload /> },
  ];

  return (
    <div id="faq" className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Left - FAQ */}
        <div className="md:col-span-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-lg shadow-md overflow-hidden border border-white/20"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-semibold text-blue-200"
                >
                  {faq.question}
                  {openIndex === index ? (
                    <FaTimes className="text-blue-400" />
                  ) : (
                    <FaPlus className="text-blue-400" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 text-gray-300 text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Brochures & Contact */}
        <div className="space-y-8">
          {/* Brochures */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-l-4 border-yellow-400 pl-3">
              Brochures
            </h3>
            <div className="space-y-3">
              {brochures.map((b, idx) => (
                <a
                  key={idx}
                  href={b.link}
                  className="flex items-center justify-between bg-white text-gray-900 px-4 py-3 rounded-md shadow hover:bg-gray-100 transition"
                >
                  <span>{b.name}</span>
                  {b.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-l-4 border-yellow-400 pl-3">
              Contact Us
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-yellow-400" />
                <p>Street No:4, ROBOMINE Avenue</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-yellow-400" />
                <p>support@robomine.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
