import React from "react";
import { ethers } from "ethers";

const TokenTransfersTable = ({ apiData }) => {
  // ✅ Filter only transactions that have tokenTransfers
  const tokenTransfers = apiData?.data
    ?.filter((item) => item.tokenTransfers && item.tokenTransfers.length > 0)
    .flatMap((item) =>
      item.tokenTransfers.map((t) => ({
        ...t,
        transactionHash: item.hash,
        blockNumber: item.blockNumber,
        timeStamp: item.timeStamp,
      }))
    ) || [];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">
          Token Transfers ({tokenTransfers.length})
        </h2>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Txn Hash
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              From
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Token
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {tokenTransfers.length > 0 ? (
            tokenTransfers.map((transfer, idx) => {
              // ✅ Format token value properly
              const formattedValue = transfer.value
                ? parseFloat(
                    (transfer.value / Math.pow(10, transfer.decimals || 18)).toFixed(6)
                  )
                : 0;

              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-blue-600">
                    {transfer.transactionHash
                      ? `${transfer.transactionHash.slice(0, 10)}...${transfer.transactionHash.slice(-8)}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">
                    {transfer.from
                      ? `${transfer.from.slice(0, 10)}...${transfer.from.slice(-6)}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700">
                    {transfer.to
                      ? `${transfer.to.slice(0, 10)}...${transfer.to.slice(-6)}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {transfer.symbol || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">
                    {formattedValue} {transfer.symbol}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                No token transfers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTransfersTable;
