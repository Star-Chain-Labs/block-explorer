import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { ethers } from "ethers";
import { Search, TrendingUp, Activity, Zap, Clock } from "lucide-react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { getCbmNewPeice } from "../api/userApi";

const RPC_URL = "https://rpc.cbmscan.com/";

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

const TransactionItem = memo(({ tx, navigate }) => {
  const truncateMiddle = (str, front = 10, back = 8) => {
    if (!str) return "";
    if (str.length <= front + back) return str;
    return `${str.slice(0, front)}...${str.slice(-back)}`;
  };

  return (
    <div
      className="border-b border-gray-100 pb-3 last:border-0 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div onClick={() => navigate(`/search?query=${encodeURIComponent(tx.hash)}`)} className="text-sm font-mono text-blue-600 hover:text-blue-500 mb-1">
            {truncateMiddle(tx.hash, 12, 10)}
          </div>
          <div onClick={() => navigate(`/search?query=${encodeURIComponent(tx.from)}`)} className="text-xs text-gray-600 hover:text-blue-500 mb-1">
            From: <span className="font-mono">{truncateMiddle(tx.from)}</span>
          </div>
          <div onClick={() => navigate(`/search?query=${encodeURIComponent(tx.to)}`)} className="text-xs text-gray-600 hover:text-blue-500">
            To:{" "}
            <span className="font-mono">
              {typeof tx.to === "string" ? truncateMiddle(tx.to) : tx.to}
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
  );
});

const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
const CBM_RECEIVER = "0xDc3E2a75dD6B99d5671f377Ae21F055e6aCa41D5";
const CBM_PRICE = 10;
const USDT_DECIMALS = 18;

const switchToBSC = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }],
    });
  } catch (err) {
    if (err.code === 4902) {
      // Add BSC if not present
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x38",
            chainName: "Binance Smart Chain",
            nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com"],
          },
        ],
      });
    } else {
      throw err;
    }
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalTransactions: 0,
    totalGasFee: "0",
    bnbPrice: 10.0,
    tps: "0",
    medGasPrice: "0",
  });

  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
const [cbmPrice, setCbmPrice] = useState(null)
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

  // const fetchChainData = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const provider = new ethers.JsonRpcProvider(RPC_URL);

  //     const latestBlockNumber = await provider.getBlockNumber();
  //     const latestBlock = await provider.getBlock(latestBlockNumber, true);
  //     const prevBlock = await provider.getBlock(latestBlockNumber - 1);

  //     const blockTime =
  //       latestBlock.timestamp && prevBlock.timestamp
  //         ? (latestBlock.timestamp - prevBlock.timestamp).toFixed(2)
  //         : "0";

  //     const gasPrice = await provider.getFeeData();
  //     const medGasGwei = ethers.formatUnits(gasPrice.gasPrice || 0, "gwei");

  //     const blocksData = [];
  //     const transactionsData = [];
  //     let totalGas = BigInt(0);
  //     let totalTxCount = 0;

  //     for (
  //       let i = latestBlockNumber;
  //       i > Math.max(0, latestBlockNumber - 10);
  //       i--
  //     ) {
  //       const block = await provider.getBlock(i, true);
  //       if (block) {
  //         const timeAgo = Math.floor(
  //           (Date.now() / 1000 - block.timestamp) / 60
  //         );
  //         blocksData.push({
  //           number: block.number,
  //           timeAgo: timeAgo < 1 ? "Just now" : `${timeAgo} min ago`,
  //           validator: block.miner
  //             ? `${block.miner.slice(0, 10)}...${block.miner.slice(-8)}`
  //             : "N/A",
  //           txns: block.transactions.length,
  //           gasUsed: ethers.formatUnits(block.gasUsed || 0, "gwei"),
  //         });

  //         totalTxCount += block.transactions.length;

  //         for (const txHash of block.transactions.slice(0, 2)) {
  //           const tx = await provider.getTransaction(txHash);
  //           const receipt = await provider.getTransactionReceipt(txHash);
  //           if (tx && receipt) {
  //             const gasFee = BigInt(receipt.gasUsed) * BigInt(tx.gasPrice || 0);
  //             totalGas += gasFee;

  //             transactionsData.push({
  //               hash: tx.hash,
  //               from: tx.from,
  //               to: tx.to || "Contract Creation",
  //               value: ethers.formatEther(tx.value),
  //               gasUsed: receipt.gasUsed.toString(),
  //               gasFee: ethers.formatEther(gasFee),
  //               timeAgo: timeAgo < 1 ? "Just now" : `${timeAgo} min ago`,
  //             });
  //           }
  //         }
  //       }
  //     }

  //     const tps =
  //       blockTime > 0
  //         ? (totalTxCount / (10 * parseFloat(blockTime))).toFixed(2)
  //         : "0";

  //     setStats({
  //       totalBlocks: latestBlockNumber,
  //       totalTransactions: totalTxCount,
  //       totalGasFee: ethers.formatEther(totalGas),
  //       bnbPrice: 10.0,
  //       tps,
  //       medGasPrice: parseFloat(medGasGwei).toFixed(2),
  //     });

  //     setLatestBlocks(blocksData);
  //     setLatestTransactions(transactionsData.slice(0, 10));
  //   } catch (err) {
  //     console.error("Error fetching chain data:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);



  const getCbmPrice = async () => {
  try {
    const res = await getCbmNewPeice();
    console.log("✅ CBM Price:", res?.cbmPrice?.cbmPrice);
    setCbmPrice(res?.cbmPrice?.cbmPrice);
  } catch (err) {
    console.error("❌ Error fetching CBM price:", err.message || err);
  }
};

// ✅ Run once when component mounts
useEffect(() => {
  getCbmPrice();
}, []);

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

      for (
        let i = latestBlockNumber;
        i > Math.max(0, latestBlockNumber - 10);
        i--
      ) {
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

              let fromAddress = tx.from;
              let toAddress = tx.to || "Contract Creation";
              let value = ethers.formatEther(tx.value);
              let isTokenTransfer = false;

              // ✅ Check for ERC20 Transfer event (topic[0] == transfer signature)
              const transferSig =
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

              const transferLog = receipt.logs.find(
                (log) => log.topics && log.topics[0] === transferSig
              );

              if (transferLog) {
                isTokenTransfer = true;
                fromAddress =
                  "0x" + transferLog.topics[1].slice(26); // sender
                toAddress =
                  "0x" + transferLog.topics[2].slice(26); // receiver

                // token amount
                const rawValue = BigInt(transferLog.data);
                value = ethers.formatUnits(rawValue, 18);

                // Optional: token contract name
                const tokenContract = new ethers.Contract(
                  transferLog.address,
                  [
                    "function symbol() view returns (string)",
                    "function decimals() view returns (uint8)",
                  ],
                  provider
                );

                try {
                  const symbol = await tokenContract.symbol();
                  value = `${value} ${symbol}`;
                } catch {
                  value = `${value} TOKEN`;
                }
              }

              transactionsData.push({
                hash: tx.hash,
                from: fromAddress,
                to: toAddress,
                value,
                isTokenTransfer,
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
        bnbPrice: 10.0,
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

  const navigateToBlocks = useCallback(() => {
    // console.log("Navigating to blocks with data:", latestBlocks);
    navigate("/blockchain/blocks", {
      state: {
        blocks: latestBlocks,
        stats: stats,
      },
    });
  }, [navigate, latestBlocks, stats]);

  const navigateToTransactions = useCallback(() => {
    // console.log("Navigating to transactions with data:", latestTransactions);
    navigate("/blockchain/transactions", {
      state: {
        transactions: latestTransactions,
        stats: stats,
      },
    });
  }, [navigate, latestTransactions, stats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full">
        <div className="absolute inset-0 h-52 w-full z-0 bg-black text-white"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
          <h1 className="text-3xl font-bold text-white mb-6">
            CBM Block Explorer
          </h1>

          {/* SEARCH BAR & DIWALI OFFER */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* SEARCH BAR */}
            <div className="relative flex-1 text-gray-600 bg-white rounded-xl shadow-md overflow-hidden flex items-center">
              <Search className="absolute left-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by Address / Txn Hash / Block"
                className="w-full pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="hidden lg:block absolute right-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
              >
                Search
              </button>
            </div>

            {/* ✨ DIWALI OFFER CARD */}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mx-auto px-6 mt-20">
        {loading ? (
          <div className=" bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading...</p>
              <p className="text-gray-400 text-sm mt-2">Fetching BlockChain data from API</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
              <StatsCard
                icon={TrendingUp}
                title="CBM PRICE"
                value={`$${cbmPrice}`}
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
