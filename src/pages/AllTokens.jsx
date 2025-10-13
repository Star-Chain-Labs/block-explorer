import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

const AllTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch(
          "https://api.cbmscan.com/api/token/get-all-tokens"
        );
        const data = await res.json();
        if (data.success) {
          setTokens(data.tokens);
        } else {
          console.error("Failed to fetch tokens:", data.message);
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

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
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center justify-between">
          <span>Token Tracker</span>
          <span className="text-sm text-gray-500">
            Showing {tokens.length} Tokens
          </span>
        </h1>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Token Name</th>
                <th className="px-6 py-3 text-left">Symbol</th>
                <th className="px-6 py-3 text-left">Token Address</th>
                <th className="px-6 py-3 text-left">Owner</th>
                <th className="px-6 py-3 text-left">Supply</th>
                <th className="px-6 py-3 text-left">Status</th>
                {/* <th className="px-6 py-3 text-left">Tx Hash</th> */}
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {tokens.map((token, index) => (
                <tr
                  key={token._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-gray-500">{index + 1}</td>

                  <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                    {token.name}
                    {token.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-700">{token.symbol}</td>

                  <td className="px-6 py-4 font-mono text-blue-600">
                    {truncate(token.tokenAddress)}
                  </td>

                  <td className="px-6 py-4 font-mono text-gray-600">
                    {truncate(token.owner)}
                  </td>

                  <td className="px-6 py-4 text-gray-700">{token.supply}</td>

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

                  {/* <td className="px-6 py-4 font-mono text-gray-500">
                    {truncate(token.txHash)}
                  </td> */}

                  <td className="px-6 py-4 text-center">
                    <a
                      href={`https://cbmscan.com/address/${token.tokenAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      View <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tokens.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No tokens found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTokens;
