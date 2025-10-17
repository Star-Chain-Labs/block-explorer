import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const RPC_URL = "https://rpc.cbmscan.com/";

const Transaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  console.log("Transaction data from location.state:", data);

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions data using ethers.js (same logic as Home component)
  const fetchTransactionsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching transactions from RPC:", RPC_URL);
      const provider = new ethers.JsonRpcProvider(RPC_URL);

      const latestBlockNumber = await provider.getBlockNumber();
      const blocksData = [];
      const transactionsData = [];
      let totalGas = BigInt(0);
      let totalTxCount = 0;

      // Fetch last 10 blocks for transactions
      for (let i = latestBlockNumber; i > Math.max(0, latestBlockNumber - 10); i--) {
        try {
          const block = await provider.getBlock(i, true);
          if (block && block.transactions.length > 0) {
            const timeAgo = Math.floor((Date.now() / 1000 - block.timestamp) / 60);

            // Add block info to blocksData for stats
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

            // Get transactions from this block (limit to first 5 per block)
            for (const txHash of block.transactions.slice(0, 5)) {
              try {
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
                    blockNumber: block.number,
                    timestamp: block.timestamp
                  });
                }
              } catch (txErr) {
                console.warn("Error fetching transaction:", txErr);
              }
            }
          }
        } catch (blockErr) {
          console.warn("Error fetching block:", blockErr);
        }
      }

      // Get gas price for median gas price
      const gasPrice = await provider.getFeeData();
      const medGasGwei = ethers.formatUnits(gasPrice.gasPrice || 0, "gwei");

      // Calculate TPS (rough estimate)
      const prevBlock = await provider.getBlock(latestBlockNumber - 1);
      const blockTime = prevBlock && prevBlock.timestamp
        ? (latestBlockNumber.timestamp - prevBlock.timestamp).toFixed(2)
        : "3"; // default 3 seconds
      const tps = blockTime > 0
        ? (totalTxCount / (10 * parseFloat(blockTime))).toFixed(2)
        : "0";

      const apiData = {
        transactions: transactionsData.slice(0, 50), // Limit to 50 transactions
        stats: {
          totalTransactions: totalTxCount,
          tps: tps,
          totalGasFee: ethers.formatEther(totalGas),
          medGasPrice: parseFloat(medGasGwei).toFixed(2),
          bnbPrice: 100.0, // You can fetch real price from API
          totalBlocks: latestBlockNumber
        }
      };

      console.log("Fetched transactions:", apiData.transactions.length);
      return apiData;
    } catch (err) {
      console.error("Error fetching transactions from RPC:", err);
      setError("Failed to fetch data from CBM network. Please check connection.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Transform transactions data for table (same as before)
  const processTransactionsData = useCallback((apiData) => {
    if (apiData?.transactions && Array.isArray(apiData.transactions)) {
      const formattedTransactions = apiData.transactions.map((tx, index) => ({
        id: tx.hash || `tx-${index + 1}`,
        hash: tx.hash,
        from: tx.from || "Unknown",
        to: tx.to || "—",
        value: parseFloat(tx.value || 0),
        gasUsed: tx.gasUsed || "0",
        gasFee: parseFloat(tx.gasFee || 0),
        timeAgo: tx.timeAgo || "—",
        blockNumber: tx.blockNumber,
        fullData: tx,
        valueFormatted: `${parseFloat(tx.value || 0).toFixed(6)} CBM`,
        gasFeeFormatted: `${parseFloat(tx.gasFee || 0).toFixed(8)} CBM`
      }));

      setTransactions(formattedTransactions);
      setStats(apiData.stats);
      console.log("Processed", formattedTransactions.length, "transactions");
    } else {
      console.warn("No valid transactions data");
      setTransactions([]);
      setStats({});
    }
    setLoading(false);
  }, []);

  // Load data effect
  useEffect(() => {
    const loadData = async () => {
      // Priority 1: Use location.state if available and valid
      if (data && data.transactions && Array.isArray(data.transactions)) {
        console.log("✅ Using location.state data");
        processTransactionsData(data);
        return;
      }

      // Priority 2: Fetch from RPC using ethers.js
      console.log("🔄 Fetching from CBM RPC");
      const apiData = await fetchTransactionsData();
      if (apiData) {
        processTransactionsData(apiData);
      }
    };

    loadData();

    // Cleanup
    return () => {
      setTransactions([]);
      setStats({});
      setError(null);
    };
  }, [data, fetchTransactionsData, processTransactionsData]);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    const apiData = await fetchTransactionsData();
    if (apiData) {
      processTransactionsData(apiData);
    }
  }, [fetchTransactionsData, processTransactionsData]);

  // Table columns
  const tableColumns = [
    {
      field: "hash",
      header: "Transaction Hash",
      minWidth: "250px",
      sortable: true,
      body: (rowData) => (
        <div className="flex items-center space-x-2">
          <span
            className="text-blue-600 hover:text-blue-800 font-mono text-sm truncate cursor-pointer transition-colors"
            title={rowData.hash}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/search?query=${encodeURIComponent(rowData.hash)}`);
            }}
          >
            {rowData.hash.slice(0, 10)}...
          </span>
        </div>
      )
    },
    {
      field: "from",
      header: "From",
      minWidth: "180px",
      body: (rowData) => (
        <span
          className="text-gray-700 font-mono text-sm truncate cursor-pointer hover:text-blue-600 transition-colors"
          title={rowData.from}
          onClick={async (e) => {
            e.stopPropagation();
            navigate(`/search?query=${encodeURIComponent(rowData.from)}`);
          }}
        >
          {rowData.from.slice(0, 8)}...
        </span>
      )
    },
    {
      field: "to",
      header: "To",
      minWidth: "200px",
      body: (rowData) => (
        <span
          className="text-gray-700 font-mono text-sm truncate cursor-pointer hover:text-blue-600 transition-colors"
          title={rowData.to === "Contract Creation" ? rowData.to : rowData.to}
          onClick={async (e) => {
            e.stopPropagation();
            navigate(`/search?query=${encodeURIComponent(rowData.to)}`);
          }}
        >
          {rowData.to === "Contract Creation"
            ? "Contract Creation"
            : rowData.to.slice(0, 8) + "..."}
        </span>
      )
    },
    {
      field: "valueFormatted",
      header: "Value",
      minWidth: "120px",
      sortable: true,
      body: (rowData) => (
        <span className="text-green-600 font-semibold">
          {rowData.valueFormatted}
        </span>
      )
    },
    {
      field: "gasUsed",
      header: "Gas Used",
      minWidth: "120px",
      body: (rowData) => (
        <span className="text-gray-700">
          {parseInt(rowData.gasUsed).toLocaleString()}
        </span>
      )
    },
    {
      field: "gasFeeFormatted",
      header: "Gas Fee",
      minWidth: "140px",
      body: (rowData) => (
        <span className="text-orange-600 font-medium">
          {rowData.gasFeeFormatted}
        </span>
      )
    },
    {
      field: "timeAgo",
      header: "Age",
      minWidth: "140px",
      sortable: true,
      body: (rowData) => (
        <span className="text-gray-600" title={rowData.timeAgo}>
          {rowData.timeAgo}
        </span>
      )
    },
    {
      field: "blockNumber",
      header: "Block",
      minWidth: "100px",
      body: (rowData) => (
        <span className="text-blue-600 font-mono text-sm">
          #{rowData.blockNumber}
        </span>
      )
    }
  ];

  const formatGasFee = (fee) => {
    return parseFloat(fee || 0).toFixed(8);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading transactions from CBM network...</p>
          <p className="text-gray-400 text-sm mt-2">Fetching latest data via RPC</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-3">
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between w-full bg-white border-b border-gray-200 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Recent Transactions</h1>
          <p className="text-gray-600 mt-2">
            Latest transactions on CBM Mainnet
            {data ? " (from navigation)" : " (live from RPC)"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            title="Refresh data from RPC"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 bg-white">
          <div className="bg-white border border-green-200 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 font-medium text-sm">Total Transactions</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.totalTransactions?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 font-medium text-sm">Total Blocks</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {stats.totalBlocks?.toLocaleString() || 0}
            </p>
          </div>

          <div className="bg-white border border-orange-200 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 font-medium text-sm">Total Gas Fee</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {formatGasFee(stats.totalGasFee)} CBM
            </p>
          </div>
          <div className="bg-white border border-indigo-200 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 font-medium text-sm">CBM Price</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              ${stats.bnbPrice?.toFixed(2) || 0}
            </p>
          </div>
          {/* <div className="bg-white border border-purple-200 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 font-medium text-sm">Median Gas Price</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {stats.medGasPrice} Gwei
            </p>
          </div> */}
          {/* <div className="bg-white border border-blue-200 p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 font-medium text-sm">TPS</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.tps || 0}</p>
          </div> */}


        </div>
      )}

      {/* Transactions Table */}
      <div className="p-6 bg-white">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-xl mb-2">No transactions available</p>
            <p className="text-gray-400">Network might be idle or connection issue</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <div className="mb-4">
            {/* <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Transactions ({transactions.length})
              </h2>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Refresh
              </button>
            </div> */}
            <Table
              columns={tableColumns}
              data={transactions}
              // navigatePath="/transaction-details"
              navigateState={(rowData) => ({
                transaction: rowData.fullData,
                stats: stats
              })}
              emptyMessage="No transactions found"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;