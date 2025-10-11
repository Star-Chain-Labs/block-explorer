import React from "react";

const LatestTransactions = ({ transactions }) => {
  console.log(transactions, "transactions");
  return (
    <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-700">
        Latest Transactions
      </h2>
      <table className="w-full text-sm text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2">Txn Hash</th>
            <th>From</th>
            <th>To</th>
            <th>Value (CBM)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2 text-blue-600 font-semibold truncate">
                {tx.hash.slice(0, 12)}...
              </td>
              <td className="truncate text-gray-700">
                {tx.from ? tx.from.slice(0, 10) + "..." : "—"}
              </td>
              <td className="truncate text-gray-700">
                {tx.to ? tx.to.slice(0, 10) + "..." : "—"}
              </td>
              <td className="text-gray-800">{tx.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestTransactions;
