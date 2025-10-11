import React from "react";
import { IoMdCube } from "react-icons/io";
import { Link } from "react-router-dom";

const LatestBlocks = ({ blocks }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">Latest Blocks</h3>
        <button className="text-blue-400 hover:text-blue-500 transition duration-200">
          ◆ Customize
        </button>
      </div>
      <div className="divide-y divide-gray-200 h-[60vh] overflow-auto">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="p-4 flex flex-row items-center justify-between gap-4 hover:bg-gray-50 transition duration-200"
          >
            <div className="flex items-center gap-3">
              <IoMdCube className="text-2xl text-gray-500" />
              <div>
                <div className="font-mono text-blue-400">{block.number}</div>
                <div className="text-gray-500 text-sm">{block.timeAgo}</div>
              </div>
            </div>
            <div className="text-gray-600">
              Validator: <span className="text-blue-500">{block.validator}</span>
              <br />
              {block.txns} in ({block.txnsTime})
            </div>
            <div className="text-right text-gray-600">{block.fee}</div>
          </div>
        ))}
      </div>
      <div className="p-4 text-center">
        <Link
          to="/blockchain/blocks"
          className="text-blue-400 hover:text-blue-500 transition duration-200"
        >
          View all blocks
        </Link>
      </div>
    </div>
  );
};

export default LatestBlocks;
