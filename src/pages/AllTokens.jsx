import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const AllTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 Fetch all tokens
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch(
          "https://api.cbmscan.com/api/token/get-all-tokens"
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.tokens)) {
          setTokens(data.tokens);
        } else {
          console.error("❌ Failed to fetch tokens:", data.message);
        }
      } catch (error) {
        console.error("⚠️ Error fetching tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // 🔍 Search filter
  const filteredTokens = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tokenAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncate = (text, start = 6, end = 4) =>
    `${text.slice(0, start)}...${text.slice(-end)}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading Tokens...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b pb-3">
          <h1 className="text-3xl font-bold text-gray-800">Token Tracker</h1>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <input
              type="text"
              placeholder="Search token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">
              Showing {filteredTokens.length} Tokens
            </span>
          </div>
        </div>

        {/* Tokens Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Token Name</th>
                <th className="px-6 py-3 text-left">Symbol</th>
                <th className="px-6 py-3 text-left">Token Address</th>
                <th className="px-6 py-3 text-left">Owner</th>
                <th className="px-6 py-3 text-left">Total Supply</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token, index) => (
                  <tr
                    key={token._id || token.tokenAddress}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>

                    {/* Token Name */}
                    <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                      {token.name}
                      {token.isVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                    </td>

                    {/* Symbol */}
                    <td className="px-6 py-4 text-gray-700">{token.symbol}</td>

                    {/* Token Address */}
                    <td className="px-6 py-4 font-mono text-blue-600">
                      {truncate(token.tokenAddress)}
                    </td>

                    {/* Owner */}
                    <td className="px-6 py-4 font-mono text-gray-600">
                      {truncate(token.owner)}
                    </td>

                    {/* Supply */}
                    <td className="px-6 py-4 text-gray-700">
                      {Number(token.supply || 0).toLocaleString()}
                    </td>

                    {/* Verified Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          token.isVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {token.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>

                    {/* View Button */}
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/token/${token.tokenAddress}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        View <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500 font-medium"
                  >
                    No tokens found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          Showing all verified and unverified tokens deployed on CBM Network
        </div>
      </div>
    </div>
  );
};

export default AllTokens;
