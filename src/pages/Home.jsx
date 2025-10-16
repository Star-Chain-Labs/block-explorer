import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { ethers } from "ethers";
import {
  Search,
  TrendingUp,
  Activity,
  Zap,
  Clock,
  ArrowLeft,
} from "lucide-react";

const RPC_URL = "https://rpc.cbmscan.com/";

const Router = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(
    window.location.hash.slice(1) || "/"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || "/");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  return children({ currentPath, navigate });
};

// Memoized Stats Card Component
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

// Memoized Block Item Component
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

// Memoized Transaction Item Component
const TransactionItem = memo(({ tx, navigate }) => (
  <div onClick={() => navigate(`/search?query=${encodeURIComponent(tx.hash)}`)} className="border-b border-gray-100 pb-3 last:border-0">
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

const Home = memo(({ navigate, searchQuery, setSearchQuery }) => {
  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalTransactions: 0,
    totalGasFee: "0",
    bnbPrice: 100.0,
    tps: "0",
    medGasPrice: "0",
    // blockTime: "0",
    // votingPower: "25,885,289.56 CBM",
    // marketCap: "$39,972,145,681.00",
  });

  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    navigate("/search");
  }, [searchQuery, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        navigate("/search");
      }
    },
    [searchQuery, navigate]
  );

  const fetchChainData = useCallback(async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      setLoading(true);

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
          const timeAgo = Math.floor(
            (Date.now() / 1000 - block.timestamp) / 60
          );
          blocksData.push({
            number: block.number,
            timeAgo:
              timeAgo < 1
                ? "Just now"
                : `${timeAgo} min${timeAgo > 1 ? "s" : ""} ago`,
            validator: block.miner
              ? `${block.miner.slice(0, 10)}...${block.miner.slice(-8)}`
              : "N/A",
            txns: block.transactions.length,
            gasUsed: ethers.formatUnits(block.gasUsed || 0, "gwei"),
            miner: block.miner,
          });

          totalTxCount += block.transactions.length;

          if (block.transactions && Array.isArray(block.transactions)) {
            for (const txHash of block.transactions.slice(0, 2)) {
              try {
                const tx = await provider.getTransaction(txHash);
                const receipt = await provider.getTransactionReceipt(txHash);
                if (tx && receipt) {
                  const gasFee =
                    BigInt(receipt.gasUsed) * BigInt(tx.gasPrice || 0);
                  totalGas += gasFee;

                  transactionsData.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to || "Contract Creation",
                    value: ethers.formatEther(tx.value),
                    block: tx.blockNumber,
                    gasUsed: receipt.gasUsed.toString(),
                    gasFee: ethers.formatEther(gasFee),
                    timeAgo: timeAgo < 1 ? "Just now" : `${timeAgo} mins ago`,
                  });
                }
              } catch (e) {
                console.error("Error fetching tx:", e);
              }
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
        blockTime,
        votingPower: "25,885,289.56 CBM",
        marketCap: "$39,972,145,681.00",
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
    const interval = setInterval(fetchChainData, 3600000);
    return () => clearInterval(interval);
  }, [fetchChainData]);

  const navigateToBlocks = useCallback(
    () => navigate("/blockchain/blocks"),
    [navigate]
  );
  const navigateToTransactions = useCallback(
    () => navigate("/blockchain/transactions"),
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full">
        <div className="absolute inset-0 h-52 w-full z-0 bg-black text-white"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
          <h1 className="text-3xl font-bold text-white mb-6">
            CBM Block Explorer
          </h1>
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

      <div className="mx-auto px-6 mt-20">
        {loading ? (
          <div className="text-center py-20 text-gray-600">
            Loading blockchain data...
          </div>
        ) : (
          <>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Latest Blocks
                  </h2>
                  <button
                    onClick={() => navigate("/blockchain/blocks")}
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

              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Latest Transactions
                  </h2>
                  <button
                    onClick={() => navigate("/blockchain/transactions")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Transactions →
                  </button>
                </div>
                <div className="space-y-4">
                  {latestTransactions.map((tx, idx) => (
                    <TransactionItem key={`${tx.hash}-${idx}`} tx={tx} navigate={navigate} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

const AllBlocksPage = memo(({ navigate }) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const goBack = useCallback(() => navigate("/"), [navigate]);

  useEffect(() => {
    let mounted = true;

    const fetchBlocks = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const latestBlockNumber = await provider.getBlockNumber();

        const results = await Promise.all(
          Array.from({ length: 20 }, (_, i) =>
            provider.getBlock(latestBlockNumber - i)
          )
        );

        const formatted = results.filter(Boolean).map((block) => {
          const timeAgo = Math.floor(
            (Date.now() / 1000 - block.timestamp) / 60
          );
          return {
            number: block.number,
            hash: block.hash,
            miner: block.miner,
            txns: block.transactions.length,
            gasUsed: block.gasUsed?.toString(),
            timeAgo: timeAgo < 1 ? "Just now" : `${timeAgo} mins ago`,
          };
        });

        if (mounted) {
          setBlocks(formatted);
          setLoading(false);
        }
      } catch (err) {
        console.error("Block fetch error:", err);
        if (mounted) setLoading(false);
      }
    };

    fetchBlocks();
    return () => (mounted = false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">All Blocks</h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-600">
            Loading blocks...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Hash
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Miner
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Txns
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Gas Used
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((b, idx) => (
                  <tr
                    key={`${b.number}-${idx}`}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-mono">{b.number}</td>
                    <td className="px-6 py-4 text-sm font-mono text-blue-600">
                      {b.hash.slice(0, 16)}...
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {b.miner.slice(0, 10)}...
                    </td>
                    <td className="px-6 py-4 text-sm">{b.txns}</td>
                    <td className="px-6 py-4 text-sm">{b.gasUsed}</td>
                    <td className="px-6 py-4 text-sm">{b.timeAgo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

const AllTransactionsPage = memo(({ navigate }) => {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  const goBack = useCallback(() => navigate("/"), [navigate]);

  useEffect(() => {
    // Dummy data to simulate transactions
    const dummyTxns = [
      {
        hash: "0x973695ce00a8e8f3e6c9f0d7b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
        method: "Deposit",
        block: 64801256,
        age: "5 mins ago",
        from: "0xA57a4E4f9b3c2D8e7F1g2H3i4J5k6L7m8N9o0P1q2r3S4t5u6v7w8x9y0z1a2b3c4d5",
        to: "0xF9CA931d7a3b2C8e7F1g2H3i4J5k6L7m8N9o0P1q2r3S4t5u6v7w8x9y0z1a2b3c4d5",
        amount: "0.011196256 BNB",
        txnFee: "0.00000258 BNB",
      },
      {
        hash: "0x5c201f8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
        method: "Transfer",
        block: 64801255,
        age: "10 mins ago",
        from: "0x82916c48d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7",
        to: "0xB1C2D3E4F5a6b7c8d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3",
        amount: "0.00010014 BNB",
        txnFee: "0.00000105 BNB",
      },
      {
        hash: "0x51fc087848d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6",
        method: "Transfer",
        block: 64801254,
        age: "15 mins ago",
        from: "0x53D72724e5f6a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3",
        to: "0xE8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K",
        amount: "0 BNB",
        txnFee: "0 BNB",
      },
      {
        hash: "0x82f0c32665d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z",
        method: "Transfer",
        block: 64801253,
        age: "20 mins ago",
        from: "0xC3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I",
        to: "0xD5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J",
        amount: "0.005 BNB",
        txnFee: "0.00000321 BNB",
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setTxns(dummyTxns);
      setLoading(false);
    }, 1000);

    return () => { };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">All Transactions</h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-600">
            Loading transactions...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Txn Hash
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Block
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    From
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    To
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Txn Fee
                  </th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t, i) => (
                  <tr
                    key={`${t.hash}-${i}`}
                    className="border-b border-gray-100 hover:bg-gray-50"
                    onClick={() => navigate(`/search?query=${encodeURIComponent(t.hash)}`)}
                  >
                    <td
                      // onClick={() => navigate(`/search?query=${encodeURIComponent(t.hash)}`)}
                      className="px-6 py-4 text-sm font-mono text-blue-600 cursor-pointer hover:underline"
                    >
                      {t.hash.slice(0, 16)}...
                    </td>
                    <td className="px-6 py-4 text-sm">{t.method}</td>
                    <td className="px-6 py-4 text-sm">{t.block}</td>
                    <td className="px-6 py-4 text-sm">{t.age}</td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {t.from.slice(0, 10)}...
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {typeof t.to === "string" ? t.to.slice(0, 10) + "..." : t.to}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {t.amount}
                    </td>
                    <td className="px-6 py-4 text-sm">{t.txnFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

const SearchResultsPage = memo(({ navigate }) => {
  const [result, setResult] = useState(null);
  const [addressTransactions, setAddressTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const goBack = useCallback(() => navigate("/"), [navigate]);

  const getQueryFromUrl = () => {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    return urlParams.get('query') || '';
  };
  const [query, setQuery] = useState(getQueryFromUrl());


  useEffect(() => {
    const newQuery = getQueryFromUrl();
    if (newQuery !== query) {
      setQuery(newQuery);
      setResult(null);
      setAddressTransactions([]);
      setLoading(true);
      setError("");
    }
  }, [query]);

  useEffect(() => {


    // Dummy data based on query type
    setTimeout(() => {
      if (/^\d+$/.test(query)) {
        setResult({
          type: "block",
          data: {
            number: parseInt(query),
            timestamp: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
            miner: "0xMinerAddress1234567890abcdef",
            transactions: ["0xTx1", "0xTx2", "0xTx3"],
            gasUsed: BigInt("500000"),
            gasLimit: BigInt("1000000"),
            hash: "0xBlockHash1234567890abcdef1234567890abcdef1234567890abcdef",
          },
        });
      } else if (query.startsWith("0x") && query.length === 66) {
        setResult({
          type: "transaction",
          data: {
            hash: query,
            blockNumber: 64801256,
            status: "Success",
            timestamp: "10/16/2025, 03:06 PM IST",
            timeAgo: "5 mins ago",
            from: "0xA57a4E4f9b3c2D8e7F1g2H3i4J5k6L7m8N9o0P1q2r3S4t5u6v7w8x9y0z1a2b3c4d5",
            to: "0xF9CA931d7a3b2C8e7F1g2H3i4J5k6L7m8N9o0P1q2r3S4t5u6v7w8x9y0z1a2b3c4d5",
            value: "0.011196256",
            burn: "Burn 0.00119626 BNB ($1.32)",
            receipt: {
              gasUsed: BigInt("21000"),
            },
            gasPrice: "10",
            internalTxns: [
              {
                type: "Transfer",
                value: "0.00069766030357464 BNB",
                from: "BSC: Validator Set",
                to: "BSC: System Reward",
              },
              {
                type: "Transfer",
                value: "0.01119625648571943 BNB",
                from: "BSC: Validator Set",
                to: "Null: 0x00...dEaD",
              },
            ],
          },
        });
      } else if (query.startsWith("0x") && query.length === 42) {
        setResult({
          type: "address",
          data: {
            address: query,
            balance: "1.23456789",
            txCount: 42,
          },
        });
        setAddressTransactions([
          {
            hash: "0x5c201f8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
            block: 64801255,
            timeAgo: "10 mins ago",
            from: "0x82916c48d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7",
            to: "0xB1C2D3E4F5a6b7c8d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3",
            value: "0.00010014",
            gasFee: "0.00000105",
          },
          {
            hash: "0x51fc087848d9e0f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6",
            block: 64801254,
            timeAgo: "15 mins ago",
            from: "0x53D72724e5f6a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3",
            to: "0xE8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K",
            value: "0",
            gasFee: "0",
          },
        ]);
      } else {
        setError("No results found for this query");
      }
      setLoading(false);
    }, 1000); // Simulate loading delay

    return () => { };
  }, [query]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <div className="text-xl font-semibold">Searching blockchain...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-600 text-lg font-semibold">{error}</div>
          </div>
        </div>
      </div>
    );

  if (!result)
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        No results
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Search Results</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {result.type === "block" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Block #{result.data.number}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">
                    Timestamp:
                  </span>
                  <div className="mt-1 text-gray-800">
                    {new Date(result.data.timestamp * 1000).toLocaleString()}
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">Miner:</span>
                  <div className="mt-1 font-mono text-sm text-blue-600 break-all">
                    {result.data.miner}
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">
                    Transactions:
                  </span>
                  <div className="mt-1 text-gray-800">
                    {result.data.transactions.length}
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">Gas Used:</span>
                  <div className="mt-1 text-gray-800">
                    {result.data.gasUsed.toString()}
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">
                    Gas Limit:
                  </span>
                  <div className="mt-1 text-gray-800">
                    {result.data.gasLimit.toString()}
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">Hash:</span>
                  <div className="mt-1 font-mono text-sm text-blue-600 break-all">
                    {result.data.hash}
                  </div>
                </div>
              </div>
            </div>
          )}

          {result.type === "transaction" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Transaction Details
              </h2>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">Hash:</span>
                  <div className="mt-1 font-mono text-sm text-blue-600 break-all">
                    {result.data.hash}
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">Status:</span>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${result.data.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {result.data.status}
                    </span>
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">
                    Block Number:
                  </span>
                  <div className="mt-1">
                    <span className="bg-gray-100 px-3 py-1 rounded font-mono">
                      {result.data.blockNumber} (1460 Block Confirmations)
                    </span>
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">Timestamp:</span>
                  <div className="mt-1 text-gray-800">
                    {result.data.timestamp} ({result.data.timeAgo})
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">From:</span>
                  <div className="mt-1 font-mono text-sm text-blue-600 break-all">
                    {result.data.from} (Validator: BNBEve)
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">To:</span>
                  <div className="mt-1 font-mono text-sm text-blue-600 break-all">
                    {result.data.to || "Contract Creation"} (BSC: Validator Set)
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">Value:</span>
                  <div className="mt-1 text-lg font-semibold text-gray-800">
                    {result.data.value} BNB ($1.32)
                  </div>
                </div>
                {result.data.burn && (
                  <div className="border-b pb-3">
                    <span className="font-semibold text-gray-600">Burn:</span>
                    <div className="mt-1 text-gray-800">{result.data.burn}</div>
                  </div>
                )}
                {result.data.receipt && (
                  <>
                    <div className="border-b pb-3">
                      <span className="font-semibold text-gray-600">
                        Transaction Fee:
                      </span>
                      <div className="mt-1 text-gray-800">
                        {ethers.formatEther(
                          BigInt(result.data.receipt.gasUsed) *
                          BigInt(result.data.gasPrice || 0)
                        )} BNB ($0.00)
                      </div>
                    </div>
                    <div className="border-b pb-3">
                      <span className="font-semibold text-gray-600">
                        Gas Price:
                      </span>
                      <div className="mt-1 text-gray-800">
                        {result.data.gasPrice} Gwei (0 BNB)
                      </div>
                    </div>
                    <div className="border-b pb-3">
                      <span className="font-semibold text-gray-600">
                        Gas Used:
                      </span>
                      <div className="mt-1 text-gray-800">
                        {result.data.receipt.gasUsed.toString()}
                      </div>
                    </div>
                  </>
                )}
                {result.data.internalTxns.length > 0 && (
                  <div className="border-b pb-3">
                    <span className="font-semibold text-gray-600">
                      Internal Transactions:
                    </span>
                    <div className="mt-1">
                      <button className="text-blue-600 mb-2">All Transfers</button>
                      <div className="space-y-2">
                        {result.data.internalTxns.map((tx, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            {tx.type}: {tx.value} BNB ($0.83) from {tx.from} to{" "}
                            {tx.to}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {result.type === "address" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Address Details
              </h2>
              <div className="space-y-4 mb-8">
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">Address:</span>
                  <div className="mt-1 font-mono text-sm text-blue-600 break-all">
                    {result.data.address}
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">Balance:</span>
                  <div className="mt-1 text-2xl font-bold text-gray-800">
                    {result.data.balance} CBM
                  </div>
                </div>
                <div className="border-b pb-3">
                  <span className="font-semibold text-gray-600">
                    Total Transaction Count:
                  </span>
                  <div className="mt-1 text-gray-800">
                    {result.data.txCount}
                  </div>
                </div>
              </div>

              {addressTransactions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Recent Transactions ({addressTransactions.length})
                  </h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-200 border-b border-gray-300">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Txn Hash
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Block
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Time
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              From
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              To
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Value
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Gas Fee
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {addressTransactions.map((tx, idx) => (
                            <tr
                              key={`${tx.hash}-${idx}`}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm font-mono text-blue-600">
                                {tx.hash.slice(0, 12)}...
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {tx.block}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-600">
                                {tx.timeAgo}
                              </td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">
                                {tx.from.slice(0, 8)}...
                              </td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">
                                {typeof tx.to === "string"
                                  ? tx.to.slice(0, 8) + "..."
                                  : tx.to}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                {parseFloat(tx.value).toFixed(4)} CBM
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {parseFloat(tx.gasFee).toFixed(6)} CBM
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {addressTransactions.length === 0 && (
                <div className="mt-8 text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    No recent transactions found for this address in the last 50
                    blocks
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-16 py-6 bg-white border-t border-gray-200 text-center text-gray-600">
        © 2025 CBM BlockExplorer - Powered by Ethereum RPC
      </footer>
    </div>
  );
});

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      {({ currentPath, navigate }) => {
        if (currentPath === "/blockchain/blocks") {
          return <AllBlocksPage navigate={navigate} />;
        }
        if (currentPath === "/blockchain/transactions") {
          return <AllTransactionsPage navigate={navigate} />;
        }
        if (currentPath === "/search") {
          return <SearchResultsPage query={searchQuery} navigate={navigate} />;
        }

        // Router component ke andar
        if (currentPath.startsWith("/search")) {
          const urlParams = new URLSearchParams(currentPath.split('?')[1]);
          const query = urlParams.get('query') || '';
          return <SearchResultsPage query={query} navigate={navigate} />;
        }
        return (
          <Home
            navigate={navigate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      }}
    </Router>
  );
}
