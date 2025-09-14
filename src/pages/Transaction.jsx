import React from "react";
// Remove unused imports
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Table from "../components/Table";

const Transaction = () => {
  // Stats data (cards)
  const statsData = [
    { title: "Transactions", value: "9 (24h)" },
    { title: "Pending Transactions", value: "0 (1h)" },
    { title: "Transaction fees", value: "0 (24h)" },
    { title: "Avg. transaction fee", value: "0.0000373333... (24h)" },
  ];

  // Transaction table data (fixed syntax error)
  const transactionData = [
    {
      txnHash: "0x7a1d6d7a...38e",
      timeAgo: "27m ago",
      type: "Coin transfer",
      method: "Deposit",
      block: "72651080",
      fromTo: ["0xd...7511", "0x31...3290"],
      amount: "0.00025",
      txnFee: "0.000021",
    },
    {
      txnHash: "0x81ac5c74...f25",
      timeAgo: "28m ago",
      type: "Coin transfer",
      method: "Transfer",
      block: "72651019",
      fromTo: ["0xd...7511", "0x31...3290"],
      amount: "0.0027",
      txnFee: "0.000021",
    },
    {
      txnHash: "0x1fdBa79fc...d404",
      timeAgo: "29m ago",
      type: "Coin transfer",
      method: "Deposit",
      block: "72650798",
      fromTo: ["0xd...7511", "0x31...3290"],
      amount: "0.041",
      txnFee: "0.000021",
    },
    {
      txnHash: "0x0edec18f3...d0ef",
      timeAgo: "30m ago",
      type: "Coin transfer",
      method: "Swap",
      block: "72650488",
      fromTo: ["0x24...49c5", "0xd...7511"],
      amount: "0.0006",
      txnFee: "0.000021",
    },
    {
      txnHash: "0x99ecd61fa...47b6",
      timeAgo: "32m ago",
      type: "Coin transfer",
      method: "Transfer",
      block: "72650371",
      fromTo: ["0x24...49c5", "0xd...7511"],
      amount: "0.193",
      txnFee: "0.000021",
    },
    {
      txnHash: "0xa8e7c8412...d47",
      timeAgo: "33m ago",
      type: "Coin transfer",
      method: "Deposit",
      block: "72650285",
      fromTo: ["0xcc...2a74", "0xd...7511"],
      amount: "0.1145",
      txnFee: "0.000021",
    },
    {
      txnHash: "0x49c71184e...e7d",
      timeAgo: "1h ago", // Fixed: Added colon
      type: "Coin transfer",
      method: "Transfer",
      block: "72646057",
      fromTo: ["0xf9...c134", "0x12...5ae8"],
      amount: "0.49745",
      txnFee: "0.000021",
    },
  ];

  // Table columns
  const tableColumns = [
    {
      field: "txnHash",
      header: "Txn hash",
      minWidth: "200px",
      body: (rowData) => (
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">{rowData.txnHash}</span>
          <span className="text-gray-500 text-sm">{rowData.timeAgo}</span>
        </div>
      ),
    },
    { field: "type", header: "Type", minWidth: "150px" },
    {
      field: "method",
      header: "Method",
      minWidth: "150px",
      body: (rowData) => (
        <span
          className="px-2 py-1 rounded-full text-white text-sm capitalize"
          style={{ backgroundColor: rowData.method === "Success" ? "#28a745" : "#6c757d" }}
        >
          {rowData.method}
        </span>
      ),
    },
    { field: "block", header: "Block", minWidth: "120px" },
    {
      field: "fromTo",
      header: "From/To",
      minWidth: "200px",
      body: (rowData) => (
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">↓</span>
          {rowData.fromTo.map((addr, i) => (
            <span key={i} className="flex items-center">
              <i
                className="pi pi-circle-fill"
                style={{ color: i === 0 ? "#ff9800" : "#4caf50", marginRight: "4px" }}
              />
              <span className="text-blue-600">{addr}</span>
            </span>
          ))}
        </div>
      ),
    },
    { field: "amount", header: "Amount", minWidth: "150px" },
    { field: "txnFee", header: "Txn fee", minWidth: "150px" },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black shadow">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by address / txn hash / block / token..."
          className="w-full p-2 bg-gray-50 text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Transaction Section Header */}
      <div className="p-4 text-2xl font-bold text-gray-800">Ozone Chain transactions</div>

      {/* Transaction Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {statsData.map((item, index) => (
          <div key={index} className="bg-white border border-gray-300 p-4 rounded-lg shadow">
            <p className="text-gray-500 font-medium">{item.title}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="p-4">
        <Table columns={tableColumns} data={transactionData} />
      </div>
    </div>
  );
};

export default Transaction;