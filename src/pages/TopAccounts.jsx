import React from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Table from "../components/Table";

const TopAccounts = () => {
  // Stats data (cards) based on image data
  const statsData = [
    { title: "Total Accounts", value: "1,999,999" },
    { title: "Total CBM Balance", value: "150,402,483.66 CBM" },
    { title: "Top Accounts Shown", value: "10,000" },
  ];

  // Account table data (adapted from image)
  const accountData = [
    {
      address: "0xF3f4285...0418ACd43",
      nameTag: "",
      balance: "29,880,000.15364949 CBM",
      percentage: "19.87201237%",
      txnCount: "79",
    },
    {
      address: "0x0000000...00001004",
      nameTag: "BSC: Token Hub",
      balance: "26,004,077.34566132 CBM",
      percentage: "-",
      txnCount: "5,605,069",
    },
    {
      address: "0xBE0eB53F...240d433E8",
      nameTag: "Binance #",
      balance: "17,195,730.35988322 CBM",
      percentage: "11.43314255%",
      txnCount: "834",
    },
    {
      address: "0xD37c9B07...5A9aA07CA",
      nameTag: "",
      balance: "11,666,888.05143963 CBM",
      percentage: "7.75711130%",
      txnCount: "43",
    },
    {
      address: "0xF9f7814e...9741aCeC",
      nameTag: "Binance: Hot Wallet 20",
      balance: "10,490,481.95626622 CBM",
      percentage: "6.97499391%",
      txnCount: "11,478",
    },
    {
      address: "0x0000000...0000DEaD",
      nameTag: "Null: 0x00...DEaD",
      balance: "10,471,150.0325872 CBM",
      percentage: "6.96209184%",
      txnCount: "25,130",
    },
    {
      address: "0x77114c69...976a9a2E",
      nameTag: "",
      balance: "8,000,555.9875813 CBM",
      percentage: "5.31943077%",
      txnCount: "40",
    },
    {
      address: "0x9EF34a9E...D562C787",
      nameTag: "",
      balance: "7,999,999.91897 CBM",
      percentage: "5.31906109%",
      txnCount: "38",
    },
    {
      address: "0x5c0D693B...B86ed194",
      nameTag: "",
      balance: "6,888,887.9919716 CBM",
      percentage: "4.58030202%",
      txnCount: "40",
    },
    {
      address: "0x0039542...34d5318C9",
      nameTag: "",
      balance: "3,252,309.02003343 CBM",
      percentage: "2.16240380%",
      txnCount: "48",
    },
  ];

  // Table columns
  const tableColumns = [
    { field: "address", header: "Address", minWidth: "200px" },
    { field: "nameTag", header: "Name/Tag", minWidth: "150px" },
    { field: "balance", header: "Balance", minWidth: "200px" },
    { field: "percentage", header: "Percentage", minWidth: "150px" },
    { field: "txnCount", header: "Txn Count", minWidth: "120px" },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black shadow">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by address / name / balance..."
          className="w-full p-2 bg-gray-50 text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Transaction Section Header */}
      <div className="p-4 text-2xl font-bold text-gray-800">Top Accounts by CBM Balance</div>

      {/* Transaction Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {statsData.map((item, index) => (
          <div key={index} className="bg-white border border-gray-300 p-4 rounded-lg shadow">
            <p className="text-gray-500 font-medium">{item.title}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="p-4">
        <Table columns={tableColumns} data={accountData} />
      </div>
    </div>
  );
};

export default TopAccounts;