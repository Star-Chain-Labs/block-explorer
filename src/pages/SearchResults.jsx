import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Copy, RefreshCw } from "lucide-react";
import axios from "axios";
import { ethers } from "ethers";

const RPC_URL = "https://rpc.cbmscan.com/";
const provider = new ethers.JsonRpcProvider(RPC_URL, undefined, {
  staticNetwork: true,
  timeout: 10000,
});

// Popular CBM tokens list - Add your known tokens here
const KNOWN_TOKENS = [
  // Example format - replace with your actual tokens
  // { address: "0x...", name: "Token Name", symbol: "TKN", decimals: 18 },
];

const SearchResults = memo(() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query")?.trim();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(null);
  const [activeTab, setActiveTab] = useState("transactions");
  const [tokenHoldings, setTokenHoldings] = useState([]);
  const [loadingHoldings, setLoadingHoldings] = useState(false);
  const [copied, setCopied] = useState(null);

  const goBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Utility Functions
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
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const shortenAddress = (addr) => {
    if (!addr) return "N/A";
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const isAddress = (query) => /^0x[a-fA-F0-9]{40}$/.test(query);
  const isTransactionHash = (query) => /^0x[a-fA-F0-9]{64}$/.test(query);
  const isBlockNumber = (query) => /^\d+$/.test(query);

  // ERC20 ABI
  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
  ];

  // Fetch token holdings with multiple methods
  const fetchTokenHoldings = async (address) => {
    setLoadingHoldings(true);
    try {
      const allTokenAddresses = new Set();

      // Method 1: Try API for token list
      try {
        const tokenListResponse = await axios.get(
          `https://api.cbmscan.com/api/tokens/holdings/${address}`,
          { timeout: 10000 }
        );

        if (tokenListResponse.data.success && tokenListResponse.data.tokens) {
          tokenListResponse.data.tokens.forEach((t) =>
            allTokenAddresses.add(t.address)
          );
        }
      } catch (apiError) {
        console.log("Token list API not available, using fallback methods");
      }

      // Method 2: Get tokens from transaction history
      if (result?.data) {
        result.data.forEach((tx) => {
          if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
            tx.tokenTransfers.forEach((transfer) => {
              if (transfer.tokenAddress) {
                allTokenAddresses.add(transfer.tokenAddress);
              }
            });
          }
        });
      }

      // Method 3: Add known popular tokens
      KNOWN_TOKENS.forEach((token) => allTokenAddresses.add(token.address));

      // Fetch balances for all discovered tokens
      const holdings = [];
      for (const tokenAddr of allTokenAddresses) {
        try {
          const contract = new ethers.Contract(tokenAddr, ERC20_ABI, provider);

          const [balance, symbol, name, decimals] = await Promise.all([
            contract.balanceOf(address),
            contract.symbol().catch(() => "UNKNOWN"),
            contract.name().catch(() => "Unknown Token"),
            contract.decimals().catch(() => 18),
          ]);

          const formattedBalance = ethers.formatUnits(balance, decimals);

          // Only include tokens with non-zero balance
          if (parseFloat(formattedBalance) > 0) {
            holdings.push({
              address: tokenAddr,
              name,
              symbol,
              decimals: decimals.toString(),
              balance: parseFloat(formattedBalance).toFixed(6),
              rawBalance: balance.toString(),
            });
          }
        } catch (err) {
          console.error(`Error fetching token ${tokenAddr}:`, err);
        }
      }

      setTokenHoldings(holdings);
    } catch (error) {
      console.error("Error fetching token holdings:", error);
    } finally {
      setLoadingHoldings(false);
    }
  };

  // Fetch Data
  useEffect(() => {
    if (!query || query === "") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        setResult(null);
        setBalance(null);

        const apiUrl = `https://api.cbmscan.com/api/transactions/search/${encodeURIComponent(
          query
        )}`;

        const res = await axios.get(apiUrl, {
          timeout: 15000,
          headers: { Accept: "application/json" },
        });

        const data = res.data;

        if (data.success && data.data && data.data.length > 0) {
          const resultData = {
            type: data.type,
            data: data.data,
            total: data.totalRecords || data.data.length,
            pagination: {
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              perPage: data.perPage,
            },
          };
          setResult(resultData);

          if (data.type === "address") {
            try {
              const balanceWei = await provider.getBalance(query);
              const balanceCBM = formatValue(balanceWei);
              setBalance(balanceCBM);

              // Fetch token holdings after setting result
              setTimeout(() => {
                fetchTokenHoldings(query);
              }, 500);
            } catch (err) {
              console.error("Balance Error:", err.message);
              setBalance("0.000000");
            }
          }
        } else {
          throw new Error("No results found");
        }
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        setError(`No results found for "${query}". ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, navigate]);

  // ✅ Auto-fetch holdings jab user "Token Holdings" tab pe jaye
  useEffect(() => {
    if (
      activeTab === "tokenHoldings" && // tab holdings pe hai
      query && // valid address present hai
      !loadingHoldings && // already fetch nahi ho raha
      tokenHoldings.length === 0 // agar data pehle se nahi hai
    ) {
      fetchTokenHoldings(query);
    }
  }, [activeTab, query]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 sm:py-20 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg sm:text-xl font-semibold text-gray-600 break-words px-4">
          Searching blockchain for "{query}"...
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </button>
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <div className="text-red-600 text-base sm:text-lg font-semibold mb-2 break-words">
              {error}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Tips: Check address format (0x...), transaction hash (64 chars),
              or block number
            </div>
            <div className="text-xs text-gray-400 break-all">
              Searched for:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">{query}</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result || !result.data || result.data.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-50 py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </button>
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <div className="text-gray-600 text-base sm:text-lg font-semibold mb-2 break-words">
              No results found for "{query}"
            </div>
            <div className="text-sm text-gray-500">
              {isAddress(query) &&
                "This address may not have any transactions yet."}
              {isTransactionHash(query) && "Transaction hash not found."}
              {isBlockNumber(query) && "Block number not found."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transaction Details
  const renderTransactionDetails = () => {
    const tx = result.data[0];
    const gasFee = parseFloat(
      formatValue(
        ethers.toBigInt(tx.gasUsed || 0) * ethers.toBigInt(tx.gasPrice || 0)
      )
    );

    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Transaction Details
            </h2>
            <div className="text-sm text-gray-500 mt-1">
              {formatTimestamp(tx.timeStamp)}
            </div>
          </div>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
            Confirmed • Block #{tx.blockNumber}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Transaction Hash
            </div>
            <div className="flex items-start sm:items-center gap-2">
              <code className="font-mono text-blue-600 text-xs sm:text-sm break-all flex-1">
                {tx.hash}
              </code>
              <button
                onClick={() => copyToClipboard(tx.hash)}
                className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                title="Copy hash"
              >
                {copied === tx.hash ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">From</div>
            <div className="flex items-start gap-2">
              <code className="font-mono text-gray-700 text-xs sm:text-sm break-all flex-1">
                {shortenAddress(tx.from)}
              </code>
              <button
                onClick={() => copyToClipboard(tx.from)}
                className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                title="Copy from address"
              >
                {copied === tx.from ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">To</div>
            <div className="flex items-start gap-2">
              <code className="font-mono text-gray-700 text-xs sm:text-sm break-all flex-1">
                {tx.to ? shortenAddress(tx.to) : "Contract Creation"}
              </code>
              {tx.to && (
                <button
                  onClick={() => copyToClipboard(tx.to)}
                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                  title="Copy to address"
                >
                  {copied === tx.to ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Value</div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600 break-all">
              {formatValue(tx.value)} CBM
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Gas Used
            </div>
            <div className="font-mono text-gray-900 text-sm sm:text-base">
              {formatGasUsed(tx.gasUsed)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Gas Price
            </div>
            <div className="font-mono text-gray-900 text-sm sm:text-base">
              {formatGasPrice(tx.gasPrice)}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Gas Fee
            </div>
            <div className="font-bold text-orange-600 text-sm sm:text-base">
              {gasFee.toFixed(6)} CBM
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Nonce</div>
            <div className="font-mono text-sm sm:text-base">{tx.nonce}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">Block</div>
            <div className="font-semibold text-blue-600 text-sm sm:text-base">
              #{tx.blockNumber}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddressDetails = () => {
    const nativeTxs = result.data.filter((tx) => tx.type === "native");
    const tokenTxs = result.data.filter(
      (tx) =>
        tx.type === "token" && tx.tokenTransfers && tx.tokenTransfers.length > 0
    );

    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Address Details
          </h2>
          {activeTab === "tokenHoldings" && (
            <button
              onClick={() => fetchTokenHoldings(query)}
              disabled={loadingHoldings}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingHoldings ? "animate-spin" : ""}`}
              />
              Refresh Holdings
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Address
            </div>
            <div className="flex items-start gap-2">
              <code className="font-mono text-blue-600 text-xs sm:text-sm break-all flex-1">
                {query}
              </code>
              <button
                onClick={() => copyToClipboard(query)}
                className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                title="Copy address"
              >
                {copied === query ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Balance
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600 break-all">
              {balance || "0.000000"} CBM
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max px-1">
            <button
              className={`${
                activeTab === "transactions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs sm:text-sm`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions ({nativeTxs.length})
            </button>
            <button
              className={`${
                activeTab === "tokenTransfers"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs sm:text-sm`}
              onClick={() => setActiveTab("tokenTransfers")}
            >
              Token Transfers ({tokenTxs.length})
            </button>
            <button
              className={`${
                activeTab === "tokenHoldings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs sm:text-sm`}
              onClick={() => setActiveTab("tokenHoldings")}
            >
              Token Holdings ({tokenHoldings.length})
            </button>
          </nav>
        </div>
        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Txn Hash
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Block
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Age
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Direction
                    </th>

                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nativeTxs.length > 0 ? (
                    nativeTxs.map((tx, idx) => {
                      const direction =
                        tx.from?.toLowerCase() === query.toLowerCase()
                          ? "OUT"
                          : tx.to?.toLowerCase() === query.toLowerCase()
                          ? "IN"
                          : "-";

                      return (
                        <tr
                          key={tx._id || idx}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Transaction Hash */}
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-mono text-blue-600 flex items-center gap-1 sm:gap-2">
                              <span className="hidden sm:inline">
                                {tx.hash.slice(0, 12)}...{tx.hash.slice(-8)}
                              </span>
                              <span className="sm:hidden">
                                {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                              </span>
                              <button
                                onClick={() => copyToClipboard(tx.hash)}
                                className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                title="Copy transaction hash"
                              >
                                {copied === tx.hash ? (
                                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : (
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Block Number */}
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-xs sm:text-sm font-semibold text-gray-700">
                              #{tx.blockNumber}
                            </div>
                          </td>

                          {/* Age */}
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                            {formatTimestamp(tx.timeStamp)}
                          </td>

                          {/* From */}
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-mono flex items-center gap-1 sm:gap-2">
                              {shortenAddress(tx.from)}
                              <button
                                onClick={() => copyToClipboard(tx.from)}
                                className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                title="Copy from address"
                              >
                                {copied === tx.from ? (
                                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : (
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Direction Column (BscScan Style) */}
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center">
                            {direction === "IN" ? (
                              <span className="bg-green-100 text-green-700 font-semibold text-xs px-3 py-1 rounded-full">
                                IN
                              </span>
                            ) : direction === "OUT" ? (
                              <span className="bg-red-100 text-red-700 font-semibold text-xs px-3 py-1 rounded-full">
                                OUT
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                -
                              </span>
                            )}
                          </td>

                          {/* To */}
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-mono flex items-center gap-1 sm:gap-2">
                              {shortenAddress(tx.to)}
                              {tx.to && (
                                <button
                                  onClick={() => copyToClipboard(tx.to)}
                                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                  title="Copy to address"
                                >
                                  {copied === tx.to ? (
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  ) : (
                                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Value */}
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-xs sm:text-sm font-semibold text-green-600">
                              {formatValue(tx.value)} CBM
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-3 sm:px-6 py-8 text-center text-xs sm:text-sm text-gray-500"
                      >
                        No native transactions found for this address.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Token Transfers Tab */}
        {activeTab === "tokenTransfers" && (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Txn Hash
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Age
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Direction
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    const transfersWithTimestamp = result.data
                      .filter(
                        (tx) =>
                          tx.tokenTransfers && tx.tokenTransfers.length > 0
                      )
                      .flatMap((tx) =>
                        tx.tokenTransfers.map((t) => ({
                          ...t,
                          parentHash: tx.hash,
                          timeStamp: tx.timeStamp,
                          blockNumber: tx.blockNumber,
                          from: t.from,
                          to: t.to,
                          tokenAddress: t.tokenAddress,
                          value: t.value,
                          symbol: t.symbol,
                          name: t.name,
                        }))
                      );

                    return transfersWithTimestamp.length > 0 ? (
                      transfersWithTimestamp.map((transfer, idx) => {
                        // ✅ Determine IN / OUT direction
                        const direction =
                          transfer.from?.toLowerCase() === query?.toLowerCase()
                            ? "OUT"
                            : transfer.to?.toLowerCase() ===
                              query?.toLowerCase()
                            ? "IN"
                            : "-";

                        return (
                          <tr
                            key={`${transfer.tokenAddress}-${idx}`}
                            className="hover:bg-gray-50"
                          >
                            {/* Txn Hash */}
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-mono text-blue-600 flex items-center gap-1 sm:gap-2">
                                <span className="hidden sm:inline">
                                  {transfer.parentHash.slice(0, 12)}...
                                  {transfer.parentHash.slice(-8)}
                                </span>
                                <span className="sm:hidden">
                                  {transfer.parentHash.slice(0, 6)}...
                                  {transfer.parentHash.slice(-4)}
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(transfer.parentHash)
                                  }
                                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                  title="Copy transaction hash"
                                >
                                  {copied === transfer.parentHash ? (
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  ) : (
                                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Age */}
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                              {formatTimestamp(transfer.timeStamp)}
                            </td>

                            {/* From */}
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-mono flex items-center gap-1 sm:gap-2">
                                {shortenAddress(transfer.from)}
                                <button
                                  onClick={() => copyToClipboard(transfer.from)}
                                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                  title="Copy from address"
                                >
                                  {copied === transfer.from ? (
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  ) : (
                                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* ✅ Direction Column */}
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center">
                              {direction === "IN" ? (
                                <span className="bg-green-100 text-green-700 font-semibold text-xs px-3 py-1 rounded-full">
                                  IN
                                </span>
                              ) : direction === "OUT" ? (
                                <span className="bg-red-100 text-red-700 font-semibold text-xs px-3 py-1 rounded-full">
                                  OUT
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                  -
                                </span>
                              )}
                            </td>

                            {/* To */}
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-mono flex items-center gap-1 sm:gap-2">
                                {shortenAddress(transfer.to)}
                                <button
                                  onClick={() => copyToClipboard(transfer.to)}
                                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                  title="Copy to address"
                                >
                                  {copied === transfer.to ? (
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  ) : (
                                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Token */}
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                                <span className="font-mono text-blue-600">
                                  {shortenAddress(transfer.tokenAddress)}
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(transfer.tokenAddress)
                                  }
                                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                  title="Copy token address"
                                >
                                  {copied === transfer.tokenAddress ? (
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  ) : (
                                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                  )}
                                </button>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {transfer.name || transfer.symbol || "Unknown"}
                              </div>
                            </td>

                            {/* Value */}
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-xs sm:text-sm font-semibold text-green-600">
                                {transfer.value} {transfer.symbol || ""}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-3 sm:px-6 py-8 text-center text-xs sm:text-sm text-gray-500"
                        >
                          No Token Transfers Found
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Token Holdings Tab */}
        {activeTab === "tokenHoldings" && (
          <div>
            {loadingHoldings ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-sm sm:text-base text-gray-600">
                  Loading token holdings...
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Token
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Token Address
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Decimals
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tokenHoldings.length > 0 ? (
                        tokenHoldings.map((token, idx) => (
                          <tr
                            key={token.address || idx}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-semibold text-gray-900">
                                {token.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {token.symbol}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                              <div className="text-xs sm:text-sm font-mono text-blue-600 flex items-center gap-1 sm:gap-2">
                                {token.address.slice(0, 12)}...
                                {token.address.slice(-8)}
                                <button
                                  onClick={() => copyToClipboard(token.address)}
                                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                                  title="Copy token address"
                                >
                                  {copied === token.address ? (
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  ) : (
                                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-xs sm:text-sm font-bold text-green-600">
                                {token.balance}
                              </div>
                              <div className="text-xs text-gray-500">
                                {token.symbol}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center hidden md:table-cell">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {token.decimals}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-3 sm:px-6 py-8 text-center text-xs sm:text-sm text-gray-500"
                          >
                            <div className="mb-2">No Token Holdings Found</div>
                            <div className="text-xs text-gray-400 px-4">
                              This address doesn't hold any tokens. Try clicking
                              "Refresh Holdings" or add known token addresses to
                              the KNOWN_TOKENS list.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Block Transactions
  const renderBlockTransactions = () => {
    const blockNumber = result.data[0]?.blockNumber;
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Block #{blockNumber} Transactions ({result.total})
          </h2>
          <div className="mt-2 text-xs sm:text-sm text-gray-600">
            Timestamp: {formatTimestamp(result.data[0]?.timeStamp)}
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Txn Hash
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Gas Used
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.data.map((tx, idx) => (
                  <tr key={tx._id || idx} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-mono text-blue-600 flex items-center gap-1 sm:gap-2">
                        <span className="hidden sm:inline">
                          {tx.hash.slice(0, 12)}...{tx.hash.slice(-8)}
                        </span>
                        <span className="sm:hidden">
                          {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(tx.hash)}
                          className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                          title="Copy transaction hash"
                        >
                          {copied === tx.hash ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-mono flex items-center gap-1 sm:gap-2">
                        {shortenAddress(tx.from)}
                        <button
                          onClick={() => copyToClipboard(tx.from)}
                          className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                          title="Copy from address"
                        >
                          {copied === tx.from ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-mono flex items-center gap-1 sm:gap-2">
                        {shortenAddress(tx.to)}
                        {tx.to && (
                          <button
                            onClick={() => copyToClipboard(tx.to)}
                            className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                            title="Copy to address"
                          >
                            {copied === tx.to ? (
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-xs sm:text-sm text-green-600">
                        {formatValue(tx.value)} CBM
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right hidden md:table-cell">
                      <div className="text-xs sm:text-sm text-gray-500">
                        {formatGasUsed(tx.gasUsed)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (result.type) {
      case "transaction":
        return renderTransactionDetails();
      case "address":
        return renderAddressDetails();
      case "block":
        return renderBlockTransactions();
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Search Results
            </h2>
            <pre className="bg-gray-100 p-4 rounded text-xs sm:text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back to Explorer</span>
          </button>
          <div className="w-full sm:w-auto">
            <p className="text-xs sm:text-sm text-gray-600 break-words">
              Found {result.total} result{result.total !== 1 ? "s" : ""} for{" "}
              <code className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 text-xs break-all inline-block max-w-full">
                {query}
              </code>
            </p>
          </div>
        </div>
        {renderContent()}
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 text-center text-gray-500 text-xs sm:text-sm px-4">
          © 2025 CBM Block Explorer • Powered by CBMScan API
        </footer>
      </div>
    </div>
  );
});

export default SearchResults;
