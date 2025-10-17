import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { ethers } from "ethers";
import {
  Search,
  TrendingUp,
  Activity,
  Zap,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RPC_URL = "https://rpc.cbmscan.com/";


// ✅ Stats Card Component
const StatsCard = memo(({ icon: Icon, title, value, subtitle, emoji }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500 mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
      {Icon ? (
        <Icon className="text-blue-500 w-8 h-8" />
      ) : (
        <div className="text-3xl">{emoji}</div>
      )}
    </div>
  </div>
));

// ✅ Block Item
const BlockItem = memo(({ block }) => (
  <div className="border-b border-gray-100 pb-3 last:border-0">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {block.number}
          </span>
          <span className="text-xs text-gray-500">{block.timeAgo}</span>
        </div>
        <div className="text-sm text-gray-600">
          Validator:{" "}
          <span className="text-blue-600 font-mono">{block.validator}</span>
        </div>
      </div>
      <div className="text-right text-sm">
        <div className="font-semibold text-gray-800">{block.txns} txns</div>
        <div className="text-xs text-gray-500">
          {parseFloat(block.gasUsed).toFixed(2)} Gwei
        </div>
      </div>
    </div>
  </div>
));

// ✅ Transaction Item
const TransactionItem = memo(({ tx, navigate }) => (
  <div
    onClick={() => navigate(`/search?query=${encodeURIComponent(tx.hash)}`)}
    className="border-b border-gray-100 pb-3 last:border-0 cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="text-sm font-mono text-blue-600 mb-1">
          {tx.hash.slice(0, 16)}...
        </div>
        <div className="text-xs text-gray-600">
          From: <span className="font-mono">{tx.from.slice(0, 10)}...</span>
        </div>
        <div className="text-xs text-gray-600">
          To:{" "}
          <span className="font-mono">
            {typeof tx.to === "string" ? tx.to.slice(0, 10) + "..." : tx.to}
          </span>
        </div>
      </div>
      <div className="text-right text-sm">
        <div className="font-semibold text-gray-800">
          {parseFloat(tx.value).toFixed(4)} CBM
        </div>
        <div className="text-xs text-gray-500">{tx.timeAgo}</div>
      </div>
    </div>
  </div>
));


// ✅ Main Home Component
const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalTransactions: 0,
    totalGasFee: "0",
    bnbPrice: 100.0,
    tps: "0",
    medGasPrice: "0",
  });

  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");


  const handleSearch = useCallback(() => {
    if (searchQuery?.trim()) {
      console.log("Searching for:", searchQuery);
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      e.preventDefault();
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // ✅ Fetch Blockchain Data
  const fetchChainData = useCallback(async () => {
    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider(RPC_URL);

      const latestBlockNumber = await provider.getBlockNumber();
      const latestBlock = await provider.getBlock(latestBlockNumber, true);
      const prevBlock = await provider.getBlock(latestBlockNumber - 1);

      const blockTime =
        latestBlock.timestamp && prevBlock.timestamp
          ? (latestBlock.timestamp - prevBlock.timestamp).toFixed(2)
          : "0";

      const gasPrice = await provider.getFeeData();
      const medGasGwei = ethers.formatUnits(gasPrice.gasPrice || 0, "gwei");

      const blocksData = [];
      const transactionsData = [];
      let totalGas = BigInt(0);
      let totalTxCount = 0;

      for (let i = latestBlockNumber; i > Math.max(0, latestBlockNumber - 10); i--) {
        const block = await provider.getBlock(i, true);
        if (block) {
          const timeAgo = Math.floor((Date.now() / 1000 - block.timestamp) / 60);
          blocksData.push({
            number: block.number,
            timeAgo: timeAgo < 1 ? "Just now" : `${timeAgo} min ago`,
            validator: block.miner
              ? `${block.miner.slice(0, 10)}...${block.miner.slice(-8)}`
              : "N/A",
            txns: block.transactions.length,
            gasUsed: ethers.formatUnits(block.gasUsed || 0, "gwei"),
          });

          totalTxCount += block.transactions.length;

          for (const txHash of block.transactions.slice(0, 2)) {
            const tx = await provider.getTransaction(txHash);
            const receipt = await provider.getTransactionReceipt(txHash);
            if (tx && receipt) {
              const gasFee = BigInt(receipt.gasUsed) * BigInt(tx.gasPrice || 0);
              totalGas += gasFee;

              transactionsData.push({
                hash: tx.hash,
                from: tx.from,
                to: tx.to || "Contract Creation",
                value: ethers.formatEther(tx.value),
                gasUsed: receipt.gasUsed.toString(),
                gasFee: ethers.formatEther(gasFee),
                timeAgo: timeAgo < 1 ? "Just now" : `${timeAgo} min ago`,
              });
            }
          }
        }
      }

      const tps =
        blockTime > 0
          ? (totalTxCount / (10 * parseFloat(blockTime))).toFixed(2)
          : "0";

      setStats({
        totalBlocks: latestBlockNumber,
        totalTransactions: totalTxCount,
        totalGasFee: ethers.formatEther(totalGas),
        bnbPrice: 100.0,
        tps,
        medGasPrice: parseFloat(medGasGwei).toFixed(2),
      });

      setLatestBlocks(blocksData);
      setLatestTransactions(transactionsData.slice(0, 10));
    } catch (err) {
      console.error("Error fetching chain data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChainData();
  }, [fetchChainData]);

  // ✅ Navigation Buttons
  const navigateToBlocks = useCallback(() => {
  // console.log("Navigating to blocks with data:", latestBlocks);
  navigate("/blockchain/blocks", { 
    state: { 
      blocks: latestBlocks,
      stats: stats 
    } 
  });
}, [navigate, latestBlocks, stats]);

const navigateToTransactions = useCallback(() => {
  // console.log("Navigating to transactions with data:", latestTransactions);
  navigate("/blockchain/transactions", { 
    state: { 
      transactions: latestTransactions,
      stats: stats 
    } 
  });
}, [navigate, latestTransactions, stats]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="relative w-full">
        <div className="absolute inset-0 h-52 w-full z-0 bg-black text-white"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
          <h1 className="text-3xl font-bold text-white mb-6">
            CBM Block Explorer
          </h1>

          {/* SEARCH BAR */}
          <div className="relative max-w-3xl text-gray-600 bg-white rounded-lg shadow-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by Address / Txn Hash / Block"
              className="w-full pl-12 pr-32 py-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto px-6 mt-20">
        {loading ? (
          <div className="text-center py-20 text-gray-600">
            Loading blockchain data...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
              <StatsCard
                icon={TrendingUp}
                title="CBM PRICE"
                value={`$${stats.bnbPrice}`}
              />
              <StatsCard
                icon={Activity}
                title="Total Blocks"
                value={stats.totalBlocks.toLocaleString()}
              />
              <StatsCard
                icon={Zap}
                title="Total Transactions"
                value={stats.totalTransactions.toLocaleString()}
                subtitle={`${stats.tps} TPS`}
              />
              <StatsCard
                emoji="⛽"
                title="Total Gas Fee"
                value={`${parseFloat(stats.totalGasFee).toFixed(6)} CBM`}
              />
              <StatsCard
                icon={Clock}
                title="Med Gas Price"
                value={`${stats.medGasPrice} Gwei`}
              />
            </div>

            {/* Latest Blocks & Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Blocks */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Latest Blocks
                  </h2>
                  <button
                    onClick={navigateToBlocks}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Blocks →
                  </button>
                </div>
                <div className="space-y-4">
                  {latestBlocks.map((block, idx) => (
                    <BlockItem key={`${block.number}-${idx}`} block={block} />
                  ))}
                </div>
              </div>

              {/* Transactions */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Latest Transactions
                  </h2>
                  <button
                    onClick={navigateToTransactions}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Transactions →
                  </button>
                </div>
                <div className="space-y-4">
                  {latestTransactions.map((tx, idx) => (
                    <TransactionItem
                      key={`${tx.hash}-${idx}`}
                      tx={tx}
                      navigate={navigate}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(Home);