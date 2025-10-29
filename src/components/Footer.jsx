import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Twitter,
  Facebook,
  Instagram,
  X,
  CheckCircle,
  Copy,
} from "lucide-react";
import metaimg from "../assets/metamask.png";
import logo from "../assets/logo.png";

const Footer = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState("idle"); // idle, loading, success, error
  const [copied, setCopied] = useState(null);

  const networkDetails = [
    { label: "Network", value: "CBM Network" },
    { label: "Chain ID", value: "706" },
    { label: "Symbol", value: "CBM" },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const addCBMNetwork = async () => {
    if (window.ethereum) {
      try {
        setShowPopup(true);
        setPopupStatus("loading");

        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2C2",
              chainName: "CBM Mainnet",
              nativeCurrency: {
                name: "CBM",
                symbol: "CBM",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.cbmscan.com"],
              blockExplorerUrls: ["https://cbmscan.com"],
            },
          ],
        });

        setPopupStatus("success");
        setTimeout(() => {
          setShowPopup(false);
          setPopupStatus("idle");
        }, 3000);
      } catch (error) {
        console.error("Error adding CBM network:", error);
        setPopupStatus("error");
        setTimeout(() => {
          setShowPopup(false);
          setPopupStatus("idle");
        }, 3000);
      }
    } else {
      setShowPopup(true);
      setPopupStatus("error");
      setTimeout(() => {
        setShowPopup(false);
        setPopupStatus("idle");
      }, 3000);
    }
  };

  return (
    <>
      {/* Professional Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Loading State */}
            {popupStatus === "loading" && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Adding Network
                </h3>
                <p className="text-gray-600 text-sm">
                  Please confirm the transaction in MetaMask...
                </p>
              </div>
            )}

            {/* Success State */}
            {popupStatus === "success" && (
              <>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 text-center border-b border-green-100">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Network Added Successfully!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    CBM Network has been added to your MetaMask wallet
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {networkDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer"
                        onClick={() => handleCopy(detail.value)}
                      >
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            {detail.label}
                          </p>
                          <p className="text-gray-900 font-medium text-sm">
                            {detail.value}
                          </p>
                        </div>
                        <button className="ml-3 p-2 text-gray-400 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Copy className="w-4 h-4" />
                        </button>
                        {copied === detail.value && (
                          <span className="ml-2 text-xs text-green-600 font-medium animate-pulse">
                            Copied!
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border-t border-blue-100 px-6 py-4">
                  <p className="text-xs text-blue-700 text-center leading-relaxed">
                    💡 You can now interact with CBM Network. Make sure your
                    wallet is connected.
                  </p>
                </div>
              </>
            )}

            {/* Error State */}
            {popupStatus === "error" && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Failed to Add Network
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {!window.ethereum
                    ? "MetaMask is not installed. Please install MetaMask extension first."
                    : "There was an error adding the network. Please try again."}
                </p>
                {!window.ethereum && (
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                  >
                    Install MetaMask
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 text-gray-800">
        <div className=" mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Left - Powered by CBM Smart Chain */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logo}
                  className="w-14 h-14 rounded-lg shadow-md"
                  alt="CBM Logo"
                />
                <div>
                  <span className="text-lg font-bold text-gray-900 block leading-tight">
                    CBM Smart Chain
                  </span>
                  <span className="text-xs text-gray-500">
                    Blockchain Explorer
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Advanced Block Explorer and Analytics Platform for the CBM Smart
                Chain ecosystem.
              </p>

              <button
                onClick={addCBMNetwork}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <img src={metaimg} alt="MetaMask" className="w-5 h-5" />
                <span className="text-sm font-medium">Add to MetaMask</span>
              </button>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-base">
                Company
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/delegate"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      Delegate to CBMScan
                    </span>
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      Staking
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/brand-assets"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Brand Assets
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Terms & Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bug-bounty"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Bug Bounty
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-base">
                Community
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/api-docs"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/knowledge"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <Link
                    to="/network-status"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Network Status
                  </Link>
                </li>
                <li>
                  <Link
                    to="/learn-cbm"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Learn CBM
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products & Services */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-base">
                Products & Services
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/advertise"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Advertise
                  </Link>
                </li>
                <li>
                  <Link
                    to="/eaas"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Explorer as a Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/api-plans"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    API Plans
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Priority Support
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blockscan"
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-block hover:translate-x-1 transform duration-200"
                  >
                    Blockscan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-600 text-sm">
                CBM © 2025 | Built by Team{" "}
                <Link
                  to="/etherscan"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  CBMSCAN
                </Link>
              </p>

              {/* Social Icons */}
              <div className="flex gap-3">
                <Link
                  to="https://twitter.com"
                  target="_blank"
                  className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Twitter className="text-blue-500 w-4 h-4" />
                </Link>
                <Link
                  to="https://facebook.com"
                  target="_blank"
                  className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Facebook className="text-blue-600 w-4 h-4" />
                </Link>
                <Link
                  to="https://instagram.com"
                  target="_blank"
                  className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Instagram className="text-pink-500 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Footer;
