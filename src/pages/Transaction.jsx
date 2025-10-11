import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const LatestTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("https://rpc.cbmscan.com/");

      const latestBlockNumber = await provider.getBlockNumber();
      const recentTxs = [];

      // Check last 10 blocks for transactions
      for (let i = latestBlockNumber; i > latestBlockNumber - 10; i--) {
        const block = await provider.getBlock(i, true); // include txs
        if (block && block.transactions.length > 0) {
          block.transactions.forEach((tx) => {
            recentTxs.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: ethers.formatEther(tx.value),
              block: tx.blockNumber,
            });
          });
        }
      }

      // Latest 10 transactions only
      setTransactions(recentTxs.slice(0, 10));
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-700">
        Latest Transactions
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading transactions...</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2">Txn Hash</th>
              <th>From</th>
              <th>To</th>
              <th>Value (ETH)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.hash} className="border-b hover:bg-gray-50">
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
      )}
    </div>
  );
};

export default LatestTransactions;
