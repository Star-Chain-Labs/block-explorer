import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
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

  // 📋 Copy helper with better UX
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleWalletClick = (address) => {
    navigate(`/search?query=${address.toLowerCase()}`);
  };

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

  // ✂️ Safe truncate
  const truncate = (text, start = 6, end = 4) => {
    if (!text || typeof text !== "string") return "N/A";
    return `${text.slice(0, start)}...${text.slice(-end)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 🔙 Back button */}
        <Link
          to="/tokens"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to All Tokens
        </Link>

        {/* 🧾 Token Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
          <div className="text-black px-6 py-8">
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
                  {/* <a
                    href={`https://cbmscan.com/address/${token.address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-white hover:text-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a> */}
                </div>
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

        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Coins className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">
              Total Supply
            </p>
            <p className="text-2xl font-bold text-slate-800">
              {token.totalSupply.toLocaleString()}
            </p>
            <p className="text-slate-400 text-xs mt-1">{token.symbol}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <FileText className="w-10 h-10 text-indigo-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Decimals</p>
            <p className="text-2xl font-bold text-slate-800">
              {token.decimals}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">
              Total Holders
            </p>
            <p className="text-2xl font-bold text-slate-800">
              {token.holdersCount}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">
              Token Status
            </p>
            <p className="text-lg font-bold text-green-600">Active</p>
          </div>
        </div>

        {/* 👥 Holders Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
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
                {holders.map((h, i) => {
                  const pct = token.totalSupply
                    ? ((h.balance / token.totalSupply) * 100).toFixed(4)
                    : 0;
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                          {i + 1}
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
                {holders.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No holders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🔁 Transfers Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
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
                {transfers.map((t, i) => (
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
                {transfers.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No recent transfers
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
