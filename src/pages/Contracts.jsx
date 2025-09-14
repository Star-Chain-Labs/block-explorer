import React from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Table from "../components/Table";

const Contracts = () => {
  // Stats data (cards) based on image data
  const statsData = [
    { title: "Contracts Deployed (Total)", value: "31,142,222" },
    { title: "Contracts Deployed (24h)", value: "24,363" },
    { title: "Contracts Verified (Total)", value: "1,497,163" },
    { title: "Contracts Verified (24h)", value: "294" },
  ];

  // Contract table data (adapted from image)
  const contractData = [
    {
      address: "0x7FcE7781...413C17e94",
      contractName: "Token",
      compiler: "Solidity/Json",
      version: "0.8.30",
      balance: "0 BNB",
      txn: "1",
      setting: "✓",
      verified: "9/14/2025",
      audit: "-",
      license: "-",
    },
    {
      address: "0x86553Bfc...e64baA300",
      contractName: "FatTokenV5",
      compiler: "Solidity",
      version: "0.8.30",
      balance: "0 BNB",
      txn: "1",
      setting: "✓",
      verified: "9/14/2025",
      audit: "-",
      license: "MIT",
    },
    {
      address: "0x8645b590...6277f6fA8",
      contractName: "RoyalToken",
      compiler: "Solidity/Json",
      version: "0.8.25",
      balance: "0 BNB",
      txn: "14",
      setting: "✓",
      verified: "9/14/2025",
      audit: "-",
      license: "-",
    },
    {
      address: "0x31Bdc26...70d6972d4",
      contractName: "ParallelTrustModel",
      compiler: "Solidity",
      version: "0.8.20",
      balance: "0 BNB",
      txn: "1",
      setting: "✓",
      verified: "9/14/2025",
      audit: "-",
      license: "MIT",
    },
    {
      address: "0xB1053fec...BeAc2aA91",
      contractName: "HerenciaModule",
      compiler: "Solidity",
      version: "0.8.20",
      balance: "0 BNB",
      txn: "1",
      setting: "✓",
      verified: "9/14/2025",
      audit: "-",
      license: "MIT",
    },
    {
      address: "0xe9217bd6...6EAc7Ba4",
      contractName: "ToylandSlots",
      compiler: "Solidity/Json",
      version: "0.8.28",
      balance: "0 BNB",
      txn: "1",
      setting: "✓",
      verified: "9/14/2025",
      audit: "-",
      license: "MIT",
    },
    {
      address: "0xB117461...597BC691",
      contractName: "ToylandPlinko",
      compiler: "Solidity/Json",
      version: "0.8.28",
      balance: "0.000384 BNB",
      txn: "2",
      setting: "✓",
      verified: "9/14/2025",
      audit: "-",
      license: "MIT",
    },
  ];

  // Table columns
  const tableColumns = [
    { field: "address", header: "Address", minWidth: "200px" },
    { field: "contractName", header: "Contract Name", minWidth: "150px" },
    { field: "compiler", header: "Compiler", minWidth: "150px" },
    { field: "version", header: "Version", minWidth: "100px" },
    { field: "balance", header: "Balance", minWidth: "150px" },
    { field: "txn", header: "Txn", minWidth: "100px" },
    { field: "setting", header: "Setting", minWidth: "100px" },
    { field: "verified", header: "Verified", minWidth: "150px" },
    { field: "audit", header: "Audit", minWidth: "100px" },
    { field: "license", header: "License", minWidth: "100px" },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black shadow">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by address / contract name..."
          className="w-full p-2 bg-gray-50 text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Contracts Section Header */}
      <div className="p-4 text-2xl font-bold text-gray-800">Verified Contracts</div>

      {/* Contracts Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {statsData.map((item, index) => (
          <div key={index} className="bg-white border border-gray-300 p-4 rounded-lg shadow">
            <p className="text-gray-500 font-medium">{item.title}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Contracts Table */}
      <div className="p-4">
        <Table columns={tableColumns} data={contractData} />
      </div>
    </div>
  );
};

export default Contracts;