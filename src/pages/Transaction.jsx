import React, { useEffect, useState } from "react";

const LatestTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://api.cbmscan.com/api/transactions/data");
      const data = await res.json();

      if (data?.success && Array.isArray(data.data)) {
        setTransactions(data.data.slice(0, 10));
      } else {
        console.error("Unexpected API response:", data);
      }
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
      ) : transactions.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-600 border-b bg-gray-100">
              <tr>
                <th className="py-2 px-3">Txn Hash</th>
                <th className="px-3">From</th>
                <th className="px-3">To</th>
                <th className="px-3">Value (CBM)</th>
                <th className="px-3">Block</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.hash} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 text-blue-600 font-semibold truncate">
                    {tx.hash.slice(0, 10)}...
                  </td>
                  <td className="px-3 text-gray-700 truncate">
                    {tx.from ? tx.from.slice(0, 10) + "..." : "—"}
                  </td>
                  <td className="px-3 text-gray-700 truncate">
                    {tx.to ? tx.to.slice(0, 10) + "..." : "—"}
                  </td>
                  <td className="px-3 text-gray-800">{tx.value}</td>
                  <td className="px-3 text-gray-600">{tx.blockNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LatestTransactions;


// import { useEffect, useState } from "react";
// import Table from "../components/Table";

// const Transaction = () => {
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     const sampleData = [
//       {
//         transactionHash: "0x973695ce00...",
//         method: "Deposit",
//         block: 64801256,
//         age: "5 secs ago",
//         from: "Validator: BNBEve",
//         to: "BSC: Validator Set",
//         amount: "0.011196256 BNB",
//         txnFee: "0",
//       },
//       {
//         transactionHash: "0x5c201f8c3...",
//         method: "Transfer",
//         block: 64801256,
//         age: "5 secs ago",
//         from: "0xa57a4E4...7225dB2A",
//         to: "Blockrazor: Builder 1",
//         amount: "0 BNB",
//         txnFee: "0",
//       },
//       {
//         transactionHash: "0x51fc087848...",
//         method: "Transfer",
//         block: 64801256,
//         age: "5 secs ago",
//         from: "0x82916c48...6bF773ca2",
//         to: "BUSD-T Stablecoin",
//         amount: "0 BNB",
//         txnFee: "0.00000258",
//       },
//       {
//         transactionHash: "0x82f0c32665...",
//         method: "Transfer",
//         block: 64801256,
//         age: "5 secs ago",
//         from: "0x53D72724...B458aeC3F",
//         to: "0xF9CA931...66767a15",
//         amount: "0.00010014 BNB",
//         txnFee: "0.00000105",
//       },
//     ];
//     setTransactions(sampleData);
//   }, []);

//   const columns = [
//     { field: "transactionHash", header: "Txn Hash", minWidth: "200px" },
//     { field: "method", header: "Method" },
//     { field: "block", header: "Block" },
//     { field: "age", header: "Age" },
//     { field: "from", header: "From", minWidth: "200px" },
//     { field: "to", header: "To", minWidth: "200px" },
//     { field: "amount", header: "Amount" },
//     { field: "txnFee", header: "Txn Fee" },
//   ];

//   return (
//     <Table
//       columns={columns}
//       data={transactions}
//       navigatePath="/transaction-details" 
//     />
//   );
// };

// export default Transaction;
