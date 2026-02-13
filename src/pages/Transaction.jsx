import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { getCbmNewPeice } from "../api/userApi";
import { Download } from "lucide-react";

// const API_URL = "http://192.168.1.3:8080/api/transactions/data";
const API_URL = "https://api.cbmscan.com/api/transactions/data";

const Transaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [cbmprice, setCbmPrice] = useState(null)
  // Truncate helper
  const truncate = (text, start = 6, end = 6) => {
    if (!text || typeof text !== "string") return "N/A";
    return `${text.slice(0, start)}...${text.slice(-end)}`;
  };

  // Fetch transactions data from the API
  const fetchTransactionsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching transactions from API:", API_URL);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const apiResponse = await response.json();
      if (!apiResponse.success || !Array.isArray(apiResponse.data)) {
        throw new Error("Invalid API response format");
      }

      // Transform API data to match expected format
      const transactionsData = apiResponse.data.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to || "Contract Creation",
        value: ethers.formatEther(tx.value || "0x0"),
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice,
        blockNumber: tx.blockNumber,
        timeStamp: tx.timeStamp,
        gasFee: ethers.formatEther(
          (BigInt(tx.gasUsed || "0x0") * BigInt(tx.gasPrice || "0x0")).toString()
        ),
        timeAgo: calculateTimeAgo(tx.timeStamp),
        type: tx.type,                    // Add this
        tokenTransfers: tx.tokenTransfers // Add this
      }));

      // Compute stats (since API doesn't provide them)
      const totalTransactions = apiResponse.totalRecords;
      const totalBlocks = Math.max(...apiResponse.data.map((tx) => tx.blockNumber), 0);
      const totalGasFee = transactionsData
        .reduce((sum, tx) => sum + parseFloat(tx.gasFee || 0), 0)
        .toFixed(8);
      const medGasPrice = ethers.formatUnits(
        apiResponse.data.length > 0
          ? apiResponse.data[Math.floor(apiResponse.data.length / 2)].gasPrice
          : "0x0",
        "gwei"
      );

      const apiData = {
        transactions: transactionsData,
        stats: {
          totalTransactions,
          totalBlocks,
          totalGasFee,
          medGasPrice: parseFloat(medGasPrice).toFixed(2),
          // bnbPrice: 100.0, // Placeholder, as API doesn't provide this
          // tps: "0", // Placeholder, as block time not available
        },
      };

      console.log("Fetched transactions:", apiData.transactions.length);
      return apiData;
    } catch (err) {
      console.error("Error fetching transactions from API:", err);
      setError("Failed to fetch data from the API. Please check the server connection.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to calculate timeAgo from timestamp
  const calculateTimeAgo = (timestamp) => {
    const timeAgo = Math.floor((Date.now() / 1000 - timestamp) / 60);
    return timeAgo < 1 ? "Just now" : `${timeAgo} min ago`;
  };

  // Transform transactions data for table
  // Transform transactions data for table
  const processTransactionsData = useCallback((apiData) => {
    if (apiData?.transactions && Array.isArray(apiData.transactions)) {
      const formattedTransactions = apiData.transactions.map((tx, index) => {
        // Determine from/to based on type
        const isToken = tx.type === "token";
        const tokenTransfer = isToken && tx.tokenTransfers && tx.tokenTransfers[0];

        const displayFrom = isToken && tokenTransfer ? tokenTransfer.from : tx.from;
        const displayTo = isToken && tokenTransfer ? tokenTransfer.to : (tx.to || "Contract Creation");

        return {
          id: tx.hash || `tx-${index + 1}`,
          hash: tx.hash,
          from: displayFrom || "Unknown",
          to: displayTo || "—",
          value: parseFloat(tx.value || 0),
          gasUsed: tx.gasUsed || "0",
          gasFee: parseFloat(tx.gasFee || 0),
          timeAgo: tx.timeAgo || "—",
          blockNumber: tx.blockNumber,
          fullData: tx,
          valueFormatted: `${parseFloat(tx.value || 0).toFixed(6)} CBM`,
          gasFeeFormatted: `${parseFloat(tx.gasFee || 0).toFixed(8)} CBM`,
        };
      });

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

      // Priority 2: Fetch from API
      console.log("🔄 Fetching from API");
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
            {truncate(rowData.hash)}
          </span>
        </div>
      ),
    },
    {
      field: "from",
      header: "From",
      minWidth: "180px",
      body: (rowData) => (
        <span
          className="text-gray-700 font-mono text-sm truncate cursor-pointer hover:text-blue-600 transition-colors"
          title={rowData.from}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/search?query=${encodeURIComponent(rowData.from)}`);
          }}
        >
          {truncate(rowData.from)}
        </span>
      ),
    },
    {
      field: "to",
      header: "To",
      minWidth: "200px",
      body: (rowData) => (
        <span
          className="text-gray-700 font-mono text-sm truncate cursor-pointer hover:text-blue-600 transition-colors"
          title={rowData.to === "Contract Creation" ? rowData.to : rowData.to}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/search?query=${encodeURIComponent(rowData.to)}`);
          }}
        >
          {rowData.to === "Contract Creation" ? "Contract Creation" : truncate(rowData.to)}
        </span>
      ),
    },
    {
      field: "valueFormatted",
      header: "Value",
      minWidth: "120px",
      sortable: true,
      body: (rowData) => (
        <span className="text-green-600 font-semibold">{rowData.valueFormatted}</span>
      ),
    },
    {
      field: "gasUsed",
      header: "Gas Used",
      minWidth: "120px",
      body: (rowData) => (
        <span className="text-gray-700">{parseInt(rowData.gasUsed).toLocaleString()}</span>
      ),
    },
    {
      field: "gasFeeFormatted",
      header: "Gas Fee",
      minWidth: "140px",
      body: (rowData) => (
        <span className="text-orange-600 font-medium">{rowData.gasFeeFormatted}</span>
      ),
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
      ),
    },
    {
      field: "blockNumber",
      header: "Block",
      minWidth: "100px",
      body: (rowData) => (
        <span className="text-blue-600 font-mono text-sm">#{rowData.blockNumber}</span>
      ),
    },
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
          <p className="text-gray-600 text-lg">Loading transactions...</p>
          <p className="text-gray-400 text-sm mt-2">Fetching latest data from API</p>
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
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
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
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }




const handleDownloadCSV = (transactions = []) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    console.warn("No transactions available for export.");
    return;
  }

  try {
    const columns = [
      { label: "Block Number", key: "blockNumber" },
      { label: "Transaction Hash", key: "hash" },
      { label: "From", key: "from" },
      { label: "To", key: "to" },
      { label: "Gas Used", key: "gasUsed" },
      { label: "Gas Fee", key: "gasFeeFormatted" },
      { label: "Value", key: "valueFormatted" },
      { label: "Time Ago", key: "timeAgo" },
    ];

    const header = columns.map(col => col.label).join(",");

    const rows = transactions.map(tx =>
      columns
        .map(col => {
          let value = tx?.[col.key] ?? "";

          // Prevent CSV injection (important for Excel)
          if (typeof value === "string" && /^[=+\-@]/.test(value)) {
            value = `'${value}`;
          }

          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",")
    );

    const csvContent = [header, ...rows].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV export failed:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex md:flex-row flex-col-reverse gap-5 md:items-center justify-between w-full bg-white border-b border-gray-200 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Recent Transactions</h1>
          <p className="text-gray-600 mt-2">
            Latest transactions on CBM Mainnet {data ? "(from navigation)" : "(live from API)"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            title="Refresh data from API"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => handleDownloadCSV(transactions)}
            className="px-4 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
              <Download className="w-4 h-4" />
          Download CSV
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
              ${cbmprice?.toFixed(2) || 0}
            </p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="p-6 bg-white">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-xl mb-2">No transactions available</p>
            <p className="text-gray-400">API might be down or no data available</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <Table
              columns={tableColumns}
              data={transactions}
              navigateState={(rowData) => ({
                transaction: rowData.fullData,
                stats: stats,
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