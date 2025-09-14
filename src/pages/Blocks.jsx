import React from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Table from "../components/Table";

const Blocks = () => {
  // Stats data (cards) based on image data
  const statsData = [
    { title: "Network Utilization", value: "25.5% (24h)" },
    { title: "Block Size", value: "84,901 Bytes" },
    { title: "Block Rewards", value: "540.41 BNB (24h)" },
    { title: "Burnt Fees", value: "268,512.44 BNB" },
  ];

  // Transaction table data (adapted from image)
  const transactionData = [
    {
      block: "61147789",
      age: "4 secs ago",
      blobs: "-",
      txn: "130",
      validator: "Feynman",
      gasUsed: "18,904,557 (25%)",
      gasLimit: "75,000,000",
      reward: "0.00228 BNB",
      burntFees: "0 BNB",
    },
    {
      block: "61147788",
      age: "5 secs ago",
      blobs: "-",
      txn: "115",
      validator: "Feynman",
      gasUsed: "14,425,385 (19%)",
      gasLimit: "75,000,000",
      reward: "0.00313 BNB",
      burntFees: "0.00031 BNB",
    },
    {
      block: "61147787",
      age: "5 secs ago",
      blobs: "-",
      txn: "128",
      validator: "Feynman",
      gasUsed: "23,766,467 (32%)",
      gasLimit: "75,000,000",
      reward: "0.00375 BNB",
      burntFees: "0.00037 BNB",
    },
    {
      block: "61147786",
      age: "6 secs ago",
      blobs: "1 (17%)",
      txn: "115",
      validator: "Feynman",
      gasUsed: "50,562,716 (67%)",
      gasLimit: "75,000,000",
      reward: "0.00625 BNB",
      burntFees: "0.00063 BNB",
    },
    {
      block: "61147785",
      age: "7 secs ago",
      blobs: "-",
      txn: "140",
      validator: "Feynman",
      gasUsed: "21,560,290 (29%)",
      gasLimit: "75,000,000",
      reward: "0.00403 BNB",
      burntFees: "0.0004 BNB",
    },
    {
      block: "61147784",
      age: "8 secs ago",
      blobs: "-",
      txn: "134",
      validator: "Feynman",
      gasUsed: "21,611,503 (29%)",
      gasLimit: "75,000,000",
      reward: "0.00326 BNB",
      burntFees: "0.00032 BNB",
    },
    {
      block: "61147783",
      age: "8 secs ago",
      blobs: "-",
      txn: "166",
      validator: "Feynman",
      gasUsed: "17,563,660 (23%)",
      gasLimit: "75,000,000",
      reward: "0.00304 BNB",
      burntFees: "0.0003 BNB",
    },
  ];

  // Table columns
  const tableColumns = [
    { field: "block", header: "Block", minWidth: "120px" },
    { field: "age", header: "Age", minWidth: "150px" },
    { field: "blobs", header: "Blobs", minWidth: "100px" },
    { field: "txn", header: "Txn", minWidth: "100px" },
    { field: "validator", header: "Validator", minWidth: "150px" },
    { field: "gasUsed", header: "Gas Used", minWidth: "150px" },
    { field: "gasLimit", header: "Gas Limit", minWidth: "150px" },
    { field: "reward", header: "Reward", minWidth: "150px" },
    { field: "burntFees", header: "Burnt Fees", minWidth: "150px" },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black shadow">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by block / validator / gas..."
          className="w-full p-2 bg-gray-50 text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Transaction Section Header */}
      <div className="p-4 text-2xl font-bold text-gray-800">Blockchain Blocks</div>

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

export default Blocks;