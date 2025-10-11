import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Table from "../components/Table";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const RPC_URL = "https://rpc.cbmscan.com";

  // fetch latest blocks dynamically
  const fetchBlocks = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const latestBlockNumber = await provider.getBlockNumber();

      const blockPromises = [];
      // last 10 blocks fetch kro
      for (let i = 0; i < 10; i++) {
        blockPromises.push(provider.getBlock(latestBlockNumber - i));
      }

      const fetchedBlocks = await Promise.all(blockPromises);

      const formattedData = await Promise.all(
        fetchedBlocks.map(async (block) => {
          const blockDetails = await provider.getBlock(block.number);
          const transactionsCount = blockDetails.transactions?.length || 0;

          return {
            block: block.number.toString(),
            age: new Date(block.timestamp * 1000).toLocaleTimeString(),
            blobs: "-",
            txn: transactionsCount,
            validator: block.miner || "Unknown",
            gasUsed: block.gasUsed?.toString() || "0",
            gasLimit: block.gasLimit?.toString() || "0",
            reward: "0 CBM",
            burntFees: "0 CBM",
          };
        })
      );

      setBlocks(formattedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blocks:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
    const interval = setInterval(fetchBlocks, 15000); // auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  // filter logic
  const filteredBlocks = blocks.filter(
    (b) =>
      b.block.includes(search) ||
      b.validator.toLowerCase().includes(search.toLowerCase()) ||
      b.gasUsed.includes(search)
  );

  // table columns
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
    <div className="min-h-screen w-full bg-white text-black shadow md:p-5">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by block / validator / gas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 bg-gray-50 text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Header */}
      <div className="p-4 text-2xl font-bold text-gray-800">
        Blockchain Blocks (Live)
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow">
          <p className="text-gray-500 font-medium">Network</p>
          <p className="text-lg font-bold">CBM Mainnet</p>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow">
          <p className="text-gray-500 font-medium">Latest Block</p>
          <p className="text-lg font-bold">
            {blocks[0]?.block || "Loading..."}
          </p>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow">
          <p className="text-gray-500 font-medium">Transactions (Recent)</p>
          <p className="text-lg font-bold">
            {blocks.reduce((a, b) => a + b.txn, 0)} Txns
          </p>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow">
          <p className="text-gray-500 font-medium">Validators Seen</p>
          <p className="text-lg font-bold">
            {new Set(blocks.map((b) => b.validator)).size}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        {loading ? (
          <div className="text-center text-gray-600">Fetching blocks...</div>
        ) : (
          <Table columns={tableColumns} data={filteredBlocks} />
        )}
      </div>
    </div>
  );
};

export default Blocks;
