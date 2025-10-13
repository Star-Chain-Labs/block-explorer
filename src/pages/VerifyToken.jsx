import React, { useState } from "react";
import {
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Coins,
  Hash,
  Wallet,
} from "lucide-react";

const SubmitToken = () => {
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    owner: "",
    supply: "",
    address: "",
    tokenAddress: "",
    txHash: "",
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("⚠️ Logo size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("⚠️ Please upload a valid image file");
        return;
      }

      setLogo(file);
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("⚠️ Token name is required");
      return false;
    }
    if (!form.symbol.trim()) {
      setError("⚠️ Token symbol is required");
      return false;
    }
    if (!form.owner.trim()) {
      setError("⚠️ Owner address is required");
      return false;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(form.owner.trim())) {
      setError("⚠️ Invalid owner address format");
      return false;
    }
    if (!form.supply || form.supply <= 0) {
      setError("⚠️ Valid supply amount is required");
      return false;
    }
    if (form.address && !/^0x[a-fA-F0-9]{40}$/.test(form.address.trim())) {
      setError("⚠️ Invalid address format");
      return false;
    }
    if (!form.tokenAddress.trim()) {
      setError("⚠️ Token address is required");
      return false;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(form.tokenAddress.trim())) {
      setError("⚠️ Invalid token address format");
      return false;
    }
    if (!form.txHash.trim()) {
      setError("⚠️ Transaction hash is required");
      return false;
    }
    if (!/^0x[a-fA-F0-9]{64}$/.test(form.txHash.trim())) {
      setError("⚠️ Invalid transaction hash format");
      return false;
    }
    if (!logo) {
      setError("⚠️ Please upload a logo");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setForm({
      name: "",
      symbol: "",
      owner: "",
      supply: "",
      address: "",
      tokenAddress: "",
      txHash: "",
    });
    setLogo(null);
    setLogoPreview(null);
  };

  const handleSubmit = async () => {
    setError("");

    if (!validateForm()) return;

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) data.append(key, typeof val === "string" ? val.trim() : val);
    });
    data.append("logo", logo);

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8080/api/token/token-verification",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json.success) {
        setSuccess(true);
        resetForm();
      } else {
        setError(json.message || "❌ Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(
        "❌ Error submitting token. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-10 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Token Submitted Successfully! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your token has been submitted for verification. Our team will
              review it shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-semibold transition-colors"
            >
              Submit Another Token
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 sm:px-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Submit Your Token
          </h1>
          <p className="text-sm text-gray-600">
            Fill in the details below to submit your token for verification
          </p>
        </div>

        <div className="space-y-5">
          {/* Token Name & Symbol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Token Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Bitcoin"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Token Symbol *
              </label>
              <input
                type="text"
                placeholder="e.g., BTC"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                value={form.symbol}
                onChange={(e) =>
                  setForm({ ...form, symbol: e.target.value.toUpperCase() })
                }
                maxLength={10}
              />
            </div>
          </div>

          {/* Owner Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Owner Address *
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
            />
          </div>

          {/* Supply */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Total Supply *
            </label>
            <input
              type="number"
              placeholder="e.g., 1000000"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.supply}
              onChange={(e) => setForm({ ...form, supply: e.target.value })}
              min="0"
            />
          </div>

          {/* Address (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address (Optional)
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Additional address if needed
            </p>
          </div>

          {/* Token Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Token Contract Address *
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.tokenAddress}
              onChange={(e) =>
                setForm({ ...form, tokenAddress: e.target.value })
              }
            />
          </div>

          {/* Transaction Hash */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Transaction Hash *
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.txHash}
              onChange={(e) => setForm({ ...form, txHash: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Deployment transaction hash
            </p>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Token Logo * (Max 5MB)
            </label>

            {!logoPreview ? (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-blue-500 transition-colors">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload logo
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="border-2 border-gray-300 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {logo.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(logo.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Submit Token
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          * Required fields
        </p>
      </div>
    </div>
  );
};

export default SubmitToken;
