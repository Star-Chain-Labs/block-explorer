import React, { useEffect, useState, memo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import axios from "axios";
import { ethers } from "ethers";

const SearchResults = memo(() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const goBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (!query || query.trim() === "") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        setResult(null);

        const apiUrl = `https://api.cbmscan.com/api/transactions/search/${encodeURIComponent(query.trim())}`;
        console.log("🌐 API Call:", apiUrl);

        const res = await axios.get(apiUrl, {
          timeout: 15000,
          headers: { 'Accept': 'application/json' }
        });

        const data = res.data;
        console.log("📊 API Response:", data);

        if (data.success && data.data && data.data.length > 0) {
          setResult({
            type: data.type,
            data: data.data,
            total: data.totalRecords || data.data.length,
            pagination: {
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              perPage: data.perPage
            }
          });
        } else {
          throw new Error("No results found");
        }
      } catch (err) {
        console.error("❌ API Error:", err.response?.data || err.message);
        setError(`No results found for "${query}". ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, navigate]);

  // ✅ Utility Functions
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleString();
    } catch {
      return "Invalid timestamp";
    }
  };

  const formatValue = (hexValue) => {
    try {
      const value = ethers.formatEther(hexValue || "0x0");
      return parseFloat(value).toFixed(6);
    } catch {
      return "0.000000";
    }
  };

  const formatGasUsed = (hexValue) => {
    try {
      return ethers.formatUnits(hexValue || "0x0", "wei");
    } catch {
      return "0";
    }
  };

  const formatGasPrice = (hexValue) => {
    try {
      const gwei = ethers.formatUnits(hexValue || "0x0", "gwei");
      return `${parseFloat(gwei).toFixed(2)} Gwei`;
    } catch {
      return "0 Gwei";
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast or visual feedback
  };

  const shortenAddress = (addr) => {
    if (!addr) return "N/A";
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const isAddress = (query) => /^0x[a-fA-F0-9]{40}$/.test(query);
  const isTransactionHash = (query) => /^0x[a-fA-F0-9]{64}$/.test(query);
  const isBlockNumber = (query) => /^\d+$/.test(query);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-xl font-semibold text-gray-600">
          Searching blockchain for "{query}"...
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
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
            <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
            <div className="text-sm text-gray-500 mb-4">
              Tips: Check address format (0x...), transaction hash (64 chars), or block number
            </div>
            <div className="text-xs text-gray-400">
              Searched for: <code className="bg-gray-100 px-2 py-1 rounded">{query}</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result || !result.data || result.data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <button onClick={goBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </button>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-600 text-lg font-semibold mb-2">
              No results found for "{query}"
            </div>
            <div className="text-sm text-gray-500">
              {isAddress(query) && "This address may not have any transactions yet."}
              {isTransactionHash(query) && "Transaction hash not found."}
              {isBlockNumber(query) && "Block number not found."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- TRANSACTION DETAILS ----------
  const renderTransactionDetails = () => {
    const tx = result.data[0];
    const gasFee = parseFloat(formatValue(
      ethers.toBigInt(tx.gasUsed || 0) * ethers.toBigInt(tx.gasPrice || 0)
    ));

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Transaction Details</h2>
            <div className="text-sm text-gray-500 mt-1">
              {formatTimestamp(tx.timeStamp)}
            </div>
          </div>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Confirmed • Block #{tx.blockNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Transaction Hash */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Transaction Hash</div>
            <div className="flex items-center gap-2">
              <code className="font-mono text-blue-600 text-sm break-all flex-1">
                {tx.hash}
              </code>
              <button
                onClick={() => copyToClipboard(tx.hash)}
                className="p-1 hover:bg-gray-200 rounded"
                title="Copy hash"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* From */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">From</div>
            <div className="flex items-center gap-2">
              <code className="font-mono text-gray-700 text-sm">{tx.from}</code>
              <button onClick={() => copyToClipboard(tx.from)} className="p-1 hover:bg-gray-200 rounded">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* To */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">To</div>
            <div className="flex items-center gap-2">
              <code className="font-mono text-gray-700 text-sm">
                {tx.to || "Contract Creation"}
              </code>
              {tx.to && (
                <button onClick={() => copyToClipboard(tx.to)} className="p-1 hover:bg-gray-200 rounded">
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Value */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Value</div>
            <div className="text-3xl font-bold text-green-600">
              {formatValue(tx.value)} CBM
            </div>
          </div>

          {/* Gas Used */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Gas Used</div>
            <div className="font-mono text-gray-900">{formatGasUsed(tx.gasUsed)}</div>
          </div>

          {/* Gas Price */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Gas Price</div>
            <div className="font-mono text-gray-900">{formatGasPrice(tx.gasPrice)}</div>
          </div>

          {/* Gas Fee */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Gas Fee</div>
            <div className="font-bold text-orange-600">
              {gasFee.toFixed(6)} CBM
            </div>
          </div>

          {/* Nonce */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Nonce</div>
            <div className="font-mono">{tx.nonce}</div>
          </div>

          {/* Block */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Block</div>
            <div className="font-semibold text-blue-600">#{tx.blockNumber}</div>
          </div>
        </div>
      </div>
    );
  };

  // ---------- ADDRESS TRANSACTIONS TABLE ----------
  const renderAddressTransactions = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-800">
            Transactions for Address ({result.total})
          </h2>
          <div className="mt-2 text-sm text-gray-600">
            Address: <code className="font-mono text-blue-600">{query}</code>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Txn Hash</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gas Fee</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.data.map((tx, idx) => {
                const gasFee = parseFloat(formatValue(
                  ethers.toBigInt(tx.gasUsed || 0) * ethers.toBigInt(tx.gasPrice || 0)
                ));
                return (
                  <tr key={tx._id || idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-blue-600">
                        {tx.hash.slice(0, 12)}...{tx.hash.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold">#{tx.blockNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimestamp(tx.timeStamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono">
                        {tx.from === query ? '→ You' : shortenAddress(tx.from)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono">
                        {tx.to === query ? '← You' : shortenAddress(tx.to)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {formatValue(tx.value)} CBM
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {gasFee.toFixed(6)} CBM
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ---------- BLOCK TRANSACTIONS ----------
  const renderBlockTransactions = () => {
    const blockNumber = result.data[0]?.blockNumber;
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-800">
            Block #{blockNumber} Transactions ({result.total})
          </h2>
          <div className="mt-2 text-sm text-gray-600">
            Timestamp: {formatTimestamp(result.data[0]?.timeStamp)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Txn Hash</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gas Used</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.data.map((tx, idx) => (
                <tr key={tx._id || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-blue-600">
                      {tx.hash.slice(0, 12)}...{tx.hash.slice(-8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono">{shortenAddress(tx.from)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono">{shortenAddress(tx.to)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-green-600">{formatValue(tx.value)} CBM</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-500">{formatGasUsed(tx.gasUsed)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (result.type) {
      case "transaction":
        return renderTransactionDetails();
      case "address":
        return renderAddressTransactions();
      case "block":
        return renderBlockTransactions();
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Explorer
          </button>
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">
              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
            </h1> */}
            <p className="text-sm text-gray-600">
              Found {result.total} result{result.total !== 1 ? 's' : ''} for{' '}
              <code className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-600">
                {query}
              </code>
            </p>
          </div>
        </div>

        {/* Content */}
        {renderContent()}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          © 2025 CBM Block Explorer • Powered by CBMScan API
        </footer>
      </div>
    </div>
  );
});

export default SearchResults;