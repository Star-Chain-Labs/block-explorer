import React, { useState, useEffect } from "react";
import {
  Coins,
  Zap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Wallet,
} from "lucide-react";

const CreateToken = () => {
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    decimals: 18,
    supply: "",
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState({ address: false, hash: false });

  // Check if wallet is connected on load
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
      }
    }
  };
  const switchToCBMNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x181cd", // 98765 in hex
            chainName: "CBM Mainnet",
            nativeCurrency: {
              name: "CBM Coin",
              symbol: "CBM",
              decimals: 18,
            },
            rpcUrls: ["http://127.0.0.1:8545"],
            blockExplorerUrls: ["https://cbmscan.com"],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Token name is required";
    if (!form.symbol.trim()) newErrors.symbol = "Token symbol is required";
    if (form.symbol.length > 10)
      newErrors.symbol = "Symbol should be less than 10 characters";
    if (!form.decimals || form.decimals < 0 || form.decimals > 18) {
      newErrors.decimals = "Decimals must be between 0 and 18";
    }
    if (!form.supply || parseFloat(form.supply) <= 0) {
      newErrors.supply = "Supply must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createToken = async () => {
    if (!validateForm()) return;

    if (!walletConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setLoading(true);

      // Simulate token deployment (replace with actual contract deployment)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock deployment result
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 42);
      const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66);

      setTokenAddress(mockAddress);
      setTxHash(mockTxHash);

      // Here you would add actual ethers.js deployment code:
      /*
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.ContractFactory(contractABI, contractBytecode, signer);
      const contract = await factory.deploy(form.name, form.symbol, form.decimals, form.supply);
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      setTokenAddress(address);
      setTxHash(contract.deploymentTransaction().hash);
      */
    } catch (error) {
      console.error("Deployment error:", error);
      alert("Error deploying token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => {
      setCopied({ ...copied, [type]: false });
    }, 2000);
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen w-full bg-white to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-800 rounded-3xl shadow-2xl mb-4 animate-pulse">
            <Coins className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600  to-blue-800 bg-clip-text text-transparent mb-3">
            Token Creator
          </h1>
          <p className="text-gray-600 text-lg">
            Create your own token in seconds
          </p>
        </div>

        {/* Wallet Connection Card */}
        {!walletConnected ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border-2 border-indigo-100">
            <div className="text-center">
              <Wallet className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-gray-600 mb-6">
                Connect your MetaMask wallet to start creating tokens
              </p>
              <button
                onClick={connectWallet}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 vai-blue-700 to-blue-800 text-white hover:from-cyan-700 hover:to-blue-900 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-4 mb-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    Wallet Connected
                  </p>
                  <p className="text-gray-800 font-mono font-semibold">
                    {truncateAddress(walletAddress)}
                  </p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
          <div className="space-y-6">
            {/* Token Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Token Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., My Awesome Token"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Token Symbol */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Token Symbol
              </label>
              <input
                type="text"
                name="symbol"
                placeholder="e.g., MAT"
                value={form.symbol}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${errors.symbol ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.symbol && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.symbol}
                </p>
              )}
            </div>

            {/* Decimals & Supply Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Decimals
                </label>
                <input
                  type="number"
                  name="decimals"
                  placeholder="18"
                  value={form.decimals}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${errors.decimals ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.decimals && (
                  <p className="text-red-500 text-xs mt-1">{errors.decimals}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Total Supply
                </label>
                <input
                  type="number"
                  name="supply"
                  placeholder="1000000"
                  value={form.supply}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${errors.supply ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.supply && (
                  <p className="text-red-500 text-xs mt-1">{errors.supply}</p>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <div className="text-blue-600 mt-1">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    💡 Quick Tip
                  </p>
                  <p className="text-sm text-gray-600">
                    Standard tokens use 18 decimals. Total supply will be
                    multiplied by 10^decimals.
                  </p>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={createToken}
              disabled={loading || !walletConnected}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 ${loading || !walletConnected
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 vai-blue-700 to-blue-800 text-white hover:from-cyan-700 hover:to-blue-900 hover:shadow-xl transform hover:-translate-y-1"
                }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                  Deploying Token...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  Create Token
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Card */}
        {tokenAddress && txHash && (
          <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl shadow-2xl p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Token Created Successfully! 🎉
              </h3>
              <p className="text-gray-600">
                Your token has been deployed to the blockchain
              </p>
            </div>

            <div className="space-y-4">
              {/* Token Address */}
              <div className="bg-white rounded-2xl p-4 border-2 border-green-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Token Address
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-gray-800 font-mono text-sm break-all">
                    {tokenAddress}
                  </p>
                  <button
                    onClick={() => copyToClipboard(tokenAddress, "address")}
                    className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-all flex-shrink-0"
                    title="Copy address"
                  >
                    {copied.address ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-green-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="bg-white rounded-2xl p-4 border-2 border-green-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Transaction Hash
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-gray-800 font-mono text-sm break-all">
                    {txHash}
                  </p>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(txHash, "hash")}
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-all"
                      title="Copy hash"
                    >
                      {copied.hash ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-green-600" />
                      )}
                    </button>
                    <a
                      href={`https://etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-all"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="w-5 h-5 text-green-600" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Token Info Summary */}
              <div className="bg-white rounded-2xl p-4 border-2 border-green-200">
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  Token Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-gray-800">{form.name}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Symbol</p>
                    <p className="font-semibold text-gray-800">{form.symbol}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Decimals</p>
                    <p className="font-semibold text-gray-800">
                      {form.decimals}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Supply</p>
                    <p className="font-semibold text-gray-800">{form.supply}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateToken;