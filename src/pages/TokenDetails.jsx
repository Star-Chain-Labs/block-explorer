import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Coins,
  FileText,
  Check,
} from "lucide-react";

const TokenDetails = () => {
  const { tokenAddress } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [holders, setHolders] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  // pagination states
  const [holderPage, setHolderPage] = useState(1);
  const [transferPage, setTransferPage] = useState(1);
  const pageSize = 10;

  // 📋 Copy helper
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleWalletClick = (address) => {
    navigate(`/search?query=${address.toLowerCase()}`);
  };

  // 👇 Hide this address globally
  const hiddenAddress =
    "0x1735ffa5105e997ce4503fb60b530692805f8f86".toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, holdersRes, transfersRes] = await Promise.all([
          fetch(`https://api.cbmscan.com/api/transactions/${tokenAddress}`),
          fetch(
            `https://api.cbmscan.com/api/transactions/${tokenAddress}/holders`
          ),
          fetch(
            `https://api.cbmscan.com/api/transactions/${tokenAddress}/transfers`
          ),
        ]);

        const infoData = await infoRes.json();
        const holdersData = await holdersRes.json();
        const transfersData = await transfersRes.json();

        if (infoData.success) setToken(infoData.token);
        if (holdersData.success) setHolders(holdersData.holders || []);
        if (transfersData.success) setTransfers(transfersData.transfers || []);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tokenAddress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">
            Loading token details...
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-slate-800">
            Token not found
          </p>
        </div>
      </div>
    );
  }

  // ✂️ Truncate helper
  const truncate = (text, start = 6, end = 4) => {
    if (!text || typeof text !== "string") return "N/A";
    return `${text.slice(0, start)}...${text.slice(-end)}`;
  };

  // Pagination logic
  const filteredHolders = holders.filter(
    (h) => h.address.toLowerCase() !== hiddenAddress
  );
  const totalHolderPages = Math.ceil(filteredHolders.length / pageSize);
  const paginatedHolders = filteredHolders.slice(
    (holderPage - 1) * pageSize,
    holderPage * pageSize
  );

  const filteredTransfers = transfers.filter(
    (t) =>
      t.from.toLowerCase() !== hiddenAddress &&
      t.to.toLowerCase() !== hiddenAddress
  );
  const totalTransferPages = Math.ceil(filteredTransfers.length / pageSize);
  const paginatedTransfers = filteredTransfers.slice(
    (transferPage - 1) * pageSize,
    transferPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 🔙 Back */}
        <Link
          to="/tokens"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to All Tokens
        </Link>

        {/* 🔹 Token Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 px-6 py-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {token.name}
                  </h1>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold text-lg">
                    {token.symbol}
                  </span>
                </div>

                {/* 👇 Hide contract address if RBM */}
                {token.address.toLowerCase() !== hiddenAddress && (
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-slate-200 text-sm font-medium">
                      Contract:
                    </span>
                    <code className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white font-mono text-sm">
                      {truncate(token.address, 8, 6)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(token.address, "main")}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {copied === "main" ? (
                        <Check className="w-4 h-4 text-green-300" />
                      ) : (
                        <Copy className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${
                  token.isVerified
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {token.isVerified ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Verified
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Unverified
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 👥 Holders Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Top Holders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedHolders.map((h, i) => {
                  const pct = token.totalSupply
                    ? ((h.balance / token.totalSupply) * 100).toFixed(4)
                    : 0;
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                          {(holderPage - 1) * pageSize + (i + 1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleWalletClick(h.address)}
                          className="font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-sm"
                        >
                          {truncate(h.address)}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-semibold text-slate-800">
                          {h.balance.toLocaleString()}
                        </span>
                        <span className="text-slate-500 text-sm ml-1">
                          {token.symbol}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Holders pagination */}
            <div className="flex justify-center items-center gap-4 py-4">
              <button
                disabled={holderPage === 1}
                onClick={() => setHolderPage(holderPage - 1)}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-semibold text-slate-700">
                Page {holderPage} / {totalHolderPages || 1}
              </span>
              <button
                disabled={holderPage === totalHolderPages}
                onClick={() => setHolderPage(holderPage + 1)}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* 🔁 Transfers Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Recent Transfers
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Txn Hash
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedTransfers.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-blue-600 hover:text-blue-800 text-sm">
                        {truncate(t.hash)}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleWalletClick(t.from)}
                        className="font-mono text-slate-700 hover:text-blue-600 hover:underline cursor-pointer text-sm"
                      >
                        {truncate(t.from)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleWalletClick(t.to)}
                        className="font-mono text-slate-700 hover:text-blue-600 hover:underline cursor-pointer text-sm"
                      >
                        {truncate(t.to)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-semibold text-slate-800">
                        {t.value.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-sm ml-1">
                        {token.symbol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                      {new Date(t.timeStamp * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Transfers pagination */}
            <div className="flex justify-center items-center gap-4 py-4">
              <button
                disabled={transferPage === 1}
                onClick={() => setTransferPage(transferPage - 1)}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-semibold text-slate-700">
                Page {transferPage} / {totalTransferPages || 1}
              </span>
              <button
                disabled={transferPage === totalTransferPages}
                onClick={() => setTransferPage(transferPage + 1)}
                className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
