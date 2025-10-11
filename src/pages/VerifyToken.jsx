import React, { useState } from "react";
import { Search, FileCode, CheckCircle, Loader2 } from "lucide-react";

const VerifyToken = () => {
  const [step, setStep] = useState(1);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [sourceCode, setSourceCode] = useState("");
  const [compiler, setCompiler] = useState("");
  const [license, setLicense] = useState("MIT");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchToken = async () => {
    if (!tokenAddress) return;
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("http://localhost:8080/api/token/get-all-tokens");
      const data = await res.json();

      if (data.success) {
        const found = data.tokens.find(
          (t) => t.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
        );
        if (found) {
          setTokenData(found);
          setStep(2);
        } else {
          setMsg("❌ Token not found in database.");
        }
      }
    } catch (error) {
      console.error(error);
      setMsg("⚠️ Error fetching token data.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!sourceCode || !compiler) {
      setMsg("⚠️ Please provide complete verification details.");
      return;
    }
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:8080/api/token/verify-auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenAddress,
          sourceCode,
          compilerVersion: compiler,
          license,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(3);
        setMsg("✅ Token verified & published successfully!");
      } else {
        setMsg("❌ Verification failed. Please check the details.");
      }
    } catch (error) {
      console.error(error);
      setMsg("Error while verifying token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-3 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 p-5 sm:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b pb-3 text-center md:text-left">
          Verify and Publish Contract Source Code
        </h1>

        {/* Step Indicators */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-between items-center mb-8 text-xs sm:text-sm gap-4 sm:gap-0">
          {["Enter Address", "Provide Source Code", "Verification Done"].map(
            (label, index) => (
              <div
                key={index}
                className="flex items-center justify-center sm:justify-start gap-2"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold ${
                    step > index
                      ? "bg-green-600 text-white"
                      : step === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`font-medium text-center sm:text-left ${
                    step === index + 1 ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {label}
                </span>
              </div>
            )
          )}
        </div>

        {/* Step 1 - Search */}
        {step === 1 && (
          <>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 text-center sm:text-left">
              Enter the token address you want to verify.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="0x123...YourTokenAddress"
                className="flex-1 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />
              <button
                onClick={fetchToken}
                disabled={loading}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
            {msg && (
              <p className="text-center text-sm text-gray-700 break-words">
                {msg}
              </p>
            )}
          </>
        )}

        {/* Step 2 - Source Code Upload */}
        {step === 2 && tokenData && (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700 text-center sm:text-left">
              Token: {tokenData.name} ({tokenData.symbol})
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 text-center sm:text-left">
              Address:{" "}
              <span className="font-mono break-all text-gray-800">
                {tokenData.tokenAddress}
              </span>
            </p>

            <div className="space-y-4">
              {/* Compiler */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
                  Compiler Version
                </label>
                <select
                  value={compiler}
                  onChange={(e) => setCompiler(e.target.value)}
                  className="w-full border px-3 py-2 sm:px-4 sm:py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                >
                  <option value="">Select Compiler</option>
                  <option value="v0.8.14">v0.8.14+commit...</option>
                  <option value="v0.8.19">v0.8.19+commit...</option>
                  <option value="v0.8.20">v0.8.20+commit...</option>
                </select>
              </div>

              {/* License */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
                  License Type
                </label>
                <select
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full border px-3 py-2 sm:px-4 sm:py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                >
                  <option value="MIT">MIT</option>
                  <option value="Apache-2.0">Apache-2.0</option>
                  <option value="Unlicense">Unlicense</option>
                </select>
              </div>

              {/* Source Code */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
                  Paste Solidity Source Code
                </label>
                <textarea
                  rows="8"
                  placeholder="Paste your verified Solidity code here..."
                  className="w-full border rounded-lg px-3 py-2 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 resize-none"
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                ></textarea>
              </div>

              {/* Button */}
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileCode className="w-5 h-5" />
                )}
                Verify & Publish
              </button>
            </div>
            {msg && (
              <p className="mt-4 text-center text-sm text-gray-700 break-words">
                {msg}
              </p>
            )}
          </div>
        )}

        {/* Step 3 - Done */}
        {step === 3 && (
          <div className="text-center py-10 px-2 sm:px-6">
            <CheckCircle className="w-12 sm:w-14 h-12 sm:h-14 text-green-600 mx-auto mb-3" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Contract Verified Successfully 🎉
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Your token is now verified and publicly visible on CBMScan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyToken;
