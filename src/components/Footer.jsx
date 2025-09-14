import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiBnbchain } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-white border-t text-gray-800 text-sm">
      <div className="w-full  px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left - Powered by BNB Smart Chain */}
          <div className="">
            <div className="flex items-center gap-2 mb-2">
            <SiBnbchain className="text-yellow-400 size-7" />
              <span className=" text-xl">Powered By CBM Block Explorer</span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed mb-3">
              CBM is a Block Explorer and Analytics Platform for BNB Smart
              Chain.
            </p>
            <button className="bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200 text-xs">
              Add BSC Network
            </button>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-gray-800">
              <li>
                <Link to="/delegate" className="hover:text-gray-700">
                  Delegate to BscScan{" "}
                  <span className="text-white font-semibold bg-[#0784C0] text-xs px-2 py-0.5 rounded-full ml-1">
                    Staking
                  </span>
                </Link>
              </li>
              <li><Link to="/brand-assets" className="hover:text-gray-800">Brand Assets</Link></li>
              <li><Link to="/contact" className="hover:text-gray-800">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-gray-800">Terms & Privacy</Link></li>
              <li><Link to="/bug-bounty" className="hover:text-gray-800">Bug Bounty</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-medium mb-3">Community</h4>
            <ul className="space-y-2 text-gray-800">
              <li><Link to="/api-docs" className="hover:text-gray-700">API Documentation</Link></li>
              <li><Link to="/knowledge" className="hover:text-gray-700">Knowledge Base</Link></li>
              <li><Link to="/network-status" className="hover:text-gray-700">Network Status</Link></li>
              <li><Link to="/learn-bsc" className="hover:text-gray-700">Learn BSC</Link></li>
            </ul>
          </div>

          {/* Products & Services */}
          <div>
            <h4 className="font-medium mb-3">Products & Services</h4>
            <ul className="space-y-2 text-gray-800">
              <li><Link to="/advertise" className="hover:text-gray-700">Advertise</Link></li>
              <li><Link to="/eaas" className="hover:text-gray-700">Explorer as a Service (EaaS)</Link></li>
              <li><Link to="/api-plans" className="hover:text-gray-700">API Plans</Link></li>
              <li><Link to="/support" className="hover:text-gray-700">Priority Support</Link></li>
              <li><Link to="/blockscan" className="hover:text-gray-700">Blockscan</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t pt-4 flex flex-col md:flex-row items-center justify-between text-gray-800 text-xs">
          <p>
            CBM © 2025 | Built by Team{" "}
            <Link to="/etherscan" className="text-blue-500 hover:underline">
              Etherscan
            </Link>
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 mt-3 md:mt-0">
            <Link to="https://twitter.com" target="_blank" className="p-2 bg-gray-100 rounded hover:bg-gray-200">
              <FaTwitter className="text-blue-500" />
            </Link>
            <Link to="https://facebook.com" target="_blank" className="p-2 bg-gray-100 rounded hover:bg-gray-200">
              <FaFacebookF className="text-blue-600" />
            </Link>
            <Link to="https://instagram.com" target="_blank" className="p-2 bg-gray-100 rounded hover:bg-gray-200">
              <FaInstagram className="text-pink-500" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
