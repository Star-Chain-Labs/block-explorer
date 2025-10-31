// import React, { useState, useEffect, useCallback } from "react";
// import Table from "../components/Table";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ethers } from "ethers";

// const RPC_URL = "https://rpc.cbmscan.com/";

// const Blocks = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const data = location.state;
//   console.log("Location data:", data);

//   const [blocks, setBlocks] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Optimized fetch - same data format, no heavy calls
//   const fetchBlocksData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const provider = new ethers.JsonRpcProvider(RPC_URL);
//       const latestBlockNumber = await provider.getBlockNumber();

//       const blocksData = [];
//       let totalTxCount = 0;
//       let totalGas = BigInt(0);

//       const numBlocks = 15;
//       const startBlock = Math.max(0, latestBlockNumber - numBlocks + 1);

//       for (let i = latestBlockNumber; i >= startBlock; i--) {
//         try {
//           const blockPromise = Promise.race([
//             provider.getBlock(i, false), // false = no transactions array
//             new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000))
//           ]);

//           const block = await blockPromise;
//           if (block) {
//             const timeAgo = Math.floor((Date.now() / 1000 - block.timestamp) / 60);

//             blocksData.push({
//               number: block.number,
//               timeAgo: timeAgo < 1 ? "Just now" : `${timeAgo} min ago`,
//               validator: block.miner
//                 ? `${block.miner.slice(0, 10)}...${block.miner.slice(-8)}`
//                 : "N/A",
//               txns: block.transactions?.length || 0,
//               gasUsed: ethers.formatUnits(block.gasUsed || 0, "gwei"),
//               timestamp: block.timestamp,
//               fullData: block
//             });

//             totalTxCount += block.transactions?.length || 0;
//             totalGas += block.gasUsed || BigInt(0);

//             if (i % 5 === 0) await new Promise(r => setTimeout(r, 50));
//           }
//         } catch (e) {
//           console.warn(`Block ${i} skipped:`, e.message);
//         }
//       }

//       const gasPrice = await provider.getFeeData();
//       const medGasGwei = ethers.formatUnits(gasPrice.gasPrice || 0, "gwei");

//       const prevBlock = await provider.getBlock(latestBlockNumber - 1);
//       const blockTime = prevBlock ? (latestBlockNumber.timestamp - prevBlock.timestamp) : 3;
//       const tps = blockTime > 0 ? ((totalTxCount / numBlocks) / blockTime).toFixed(2) : "0";

//       return {
//         blocks: blocksData.reverse(),
//         stats: {
//           totalBlocks: latestBlockNumber,
//           totalTransactions: totalTxCount,
//           totalGasFee: ethers.formatEther(totalGas),
//           medGasPrice: parseFloat(medGasGwei).toFixed(2),
//           bnbPrice: 100.0,
//           tps: tps
//         }
//       };
//     } catch (err) {
//       console.error("RPC Error:", err);
//       setError("Network error. Please try again.");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const processBlocksData = useCallback((apiData) => {
//     if (apiData?.blocks && Array.isArray(apiData.blocks)) {
//       const formattedBlocks = apiData.blocks.map(block => ({
//         number: block.number?.toString() || "—",
//         timeAgo: block.timeAgo || "—",
//         validator: block.validator || "Unknown",
//         txns: block.txns || 0,
//         gasUsed: parseFloat(block.gasUsed || 0).toFixed(6),
//         gasUsedRaw: block.gasUsed || "0",
//         fullData: block,
//         txnsFormatted: block.txns || 0,
//         gasUsedFormatted: `${parseFloat(block.gasUsed || 0).toLocaleString()} Gwei`
//       }));

//       setBlocks(formattedBlocks);
//       setStats(apiData.stats);
//     } else {
//       setBlocks([]);
//       setStats({});
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     const loadData = async () => {
//       if (data && data.blocks && Array.isArray(data.blocks)) {
//         console.log("Using location.state");
//         processBlocksData(data);
//       } else {
//         console.log("Fetching from RPC");
//         const apiData = await fetchBlocksData();
//         if (apiData) processBlocksData(apiData);
//       }
//     };
//     loadData();
//   }, [data, fetchBlocksData, processBlocksData]);

//   const handleRefresh = async () => {
//     const apiData = await fetchBlocksData();
//     if (apiData) processBlocksData(apiData);
//   };

//   const tableColumns = [
//     {
//       field: "number",
//       header: "Block",
//       minWidth: "120px",
//       sortable: true,
//       body: (rowData) => (
//         <div className="flex items-center space-x-2">
//           <span
//             className="text-blue-600 hover:text-blue-800 font-semibold font-mono text-sm cursor-pointer"
//             title={`Block #${rowData.number}`}
//             onClick={(e) => {
//               e.stopPropagation();
//               window.open(`https://cbmscan.com/block/${rowData.number}`, '_blank');
//             }}
//           >
//             #{rowData.number}
//           </span>
//         </div>
//       )
//     },
//     {
//       field: "timeAgo",
//       header: "Age",
//       minWidth: "140px",
//       body: (rowData) => (
//         <span className="text-gray-600 font-mono text-sm" title={rowData.timeAgo}>
//           {rowData.timeAgo}
//         </span>
//       ),
//       sortable: true
//     },
//     {
//       field: "txnsFormatted",
//       header: "Txns",
//       minWidth: "80px",
//       sortable: true,
//       body: (rowData) => (
//         <span className="font-semibold text-gray-800">
//           {rowData.txns}
//         </span>
//       )
//     },
//     {
//       field: "validator",
//       header: "Validator",
//       minWidth: "200px",
//       body: (rowData) => (
//         <span 
//           className="text-gray-700 font-mono text-sm truncate cursor-pointer hover:text-blue-600"
//           title={rowData.validator}
//           onClick={(e) => {
//             e.stopPropagation();
//             navigator.clipboard.writeText(rowData.validator);
//           }}
//         >
//           {rowData.validator}
//         </span>
//       )
//     },
//     {
//       field: "gasUsedFormatted",
//       header: "Gas Used",
//       minWidth: "140px",
//       sortable: true,
//       body: (rowData) => (
//         <span className="text-gray-700 font-mono text-sm">
//           {rowData.gasUsedFormatted}
//         </span>
//       )
//     }
//   ];

//   const formatGasFee = (fee) => parseFloat(fee || 0).toFixed(8);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading blocks...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={handleRefresh}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - SAME AS ORIGINAL */}
//       <div className="bg-white border-b border-gray-200 p-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Blockchain Blocks</h1>
//             <p className="text-gray-600 mt-2">Latest blocks on CBM Mainnet</p>
//           </div>
//           <div className="flex items-center space-x-3">
//             <button
//               onClick={handleRefresh}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Refresh
//             </button>
//             <button
//               onClick={() => navigate('/')}
//               className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//             >
//               ← Back to Dashboard
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards - EXACT SAME AS ORIGINAL */}
//       {stats && Object.keys(stats).length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white">
//           <div className="bg-white border border-blue-200 p-4 rounded-lg">
//             <p className="text-gray-500 font-medium">Latest Block</p>
//             <p className="text-2xl font-bold text-blue-600">
//               #{blocks[0]?.number || "—"}
//             </p>
//           </div>
//           <div className="bg-white border border-green-200 p-4 rounded-lg">
//             <p className="text-gray-500 font-medium">Total Blocks</p>
//             <p className="text-2xl font-bold text-green-600">
//               {stats.totalBlocks || 0}
//             </p>
//           </div>
//           <div className="bg-white border border-purple-200 p-4 rounded-lg">
//             <p className="text-gray-500 font-medium">Total Txns</p>
//             <p className="text-2xl font-bold text-purple-600">
//               {stats.totalTransactions || 0}
//             </p>
//           </div>

//           <div className="bg-white border border-indigo-200 p-4 rounded-lg">
//             <p className="text-gray-500 font-medium">Total Gas Fee</p>
//             <p className="text-2xl font-bold text-indigo-600">
//               {formatGasFee(stats.totalGasFee)} CBM
//             </p>
//           </div>

//         </div>
//       )}

//       {/* Blocks Table - SAME */}
//       <div className="p-6 bg-white">
//         {blocks.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-xl">No blocks data available</p>
//             <p className="text-gray-400 mt-2">Please check back later</p>
//           </div>
//         ) : (
//           <div className="mb-4">
//             <Table
//               columns={tableColumns}
//               data={blocks}
//               // navigatePath="/block-details"
//               navigateState={(rowData) => ({ 
//                 block: rowData.fullData,
//                 stats: stats 
//               })}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Blocks;



import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/Table";
import { useLocation, useNavigate } from "react-router-dom";
// import { ethers } from "ethers";

const API_URL = "https://api.cbmscan.com/api/transactions/blocks";
// const API_URL = "http://192.168.1.3:8080/api/transactions/blocks";

const Blocks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  console.log("Location data:", data);

  const [blocks, setBlocks] = useState([]);
  // const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Truncate helper
  const truncate = (text, start = 14, end = 14) => {
    if (!text || typeof text !== "string") return "N/A";
    return `${text.slice(0, start)}......${text.slice(-end)}`;
  };

  // Fetch blocks data from the API
  const fetchBlocksData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching blocks from API:", "http://192.168.1.3:8080/api/transactions/blocks");
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

      if (!apiResponse.success || !Array.isArray(apiResponse.blocks)) {
        throw new Error("Invalid API response format");
      }

      // Transform API data to match expected format
      const blocksData = apiResponse.blocks.map((block) => ({
        number: block.number,
        timeAgo: calculateTimeAgo(block.timestamp),
        hash: block.hash,
        // validator: block.miner
        //   ? `${block.miner.slice(0, 10)}...${block.miner.slice(-8)}`
        //   : "N/A",
        // txns: block.transactions?.length || 0,
        // gasUsed: ethers.formatUnits(block.gasUsed || "0x0", "gwei"),
        timestamp: block.timestamp,
        fullData: block,
      }));

      // // Compute stats
      // const totalTxCount = blocksData.reduce((sum, block) => sum + (block.txns || 0), 0);
      // const totalGas = blocksData.reduce(
      //   (sum, block) => sum + BigInt(block.fullData.gasUsed || "0x0"),
      //   BigInt(0)
      // );
      // const latestBlockNumber = Math.max(...blocksData.map((b) => b.number), 0);
      // const medGasPrice = apiResponse.blocks.length > 0
      //   ? ethers.formatUnits(
      //       apiResponse.blocks[Math.floor(apiResponse.blocks.length / 2)].gasPrice || "0x0",
      //       "gwei"
      //     )
      //   : "0";

      // const apiData = {
      //   blocks: blocksData.reverse(),
      //   stats: {
      //     totalBlocks: latestBlockNumber,
      //     totalTransactions: totalTxCount,
      //     totalGasFee: ethers.formatEther(totalGas),
      //     medGasPrice: parseFloat(medGasPrice).toFixed(2),
      //     bnbPrice: 100.0,
      //     tps: "0",
      //   },
      // };

      console.log("Fetched blocks:", blocksData.length);
      return { blocks: blocksData.reverse() }; // Only return blocks
    } catch (err) {
      console.error("Error fetching blocks from API:", err);
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

  // Process blocks data for table
  const processBlocksData = useCallback((apiData) => {
    if (apiData?.blocks && Array.isArray(apiData.blocks)) {
      const formattedBlocks = apiData.blocks.map((block) => ({
        number: block.number?.toString() || "—",
        timeAgo: block.timeAgo || "—",
        hash: block.hash || "—",
        // validator: block.validator || "Unknown",
        // txns: block.txns || 0,
        // gasUsed: parseFloat(block.gasUsed || 0).toFixed(6),
        // gasUsedRaw: block.gasUsed || "0",
        fullData: block,
        // txnsFormatted: block.txns || 0,
        // gasUsedFormatted: `${parseFloat(block.gasUsed || 0).toLocaleString()} Gwei`,
      }));

      setBlocks(formattedBlocks);
      // setStats(apiData.stats);
    } else {
      setBlocks([]);
      // setStats({});
    }
    setLoading(false);
  }, []);

  // Load data effect
  useEffect(() => {
    const loadData = async () => {
      if (data && data.blocks && Array.isArray(data.blocks)) {
        console.log("Using location.state");
        processBlocksData(data);
      } else {
        console.log("Fetching from API");
        const apiData = await fetchBlocksData();
        if (apiData) processBlocksData(apiData);
      }
    };
    loadData();
  }, [data, fetchBlocksData, processBlocksData]);

  // Refresh handler
  const handleRefresh = async () => {
    const apiData = await fetchBlocksData();
    if (apiData) processBlocksData(apiData);
  };

  // Table columns
  const tableColumns = [
    {
      field: "number",
      header: "Block",
      minWidth: "120px",
      sortable: true,
      body: (rowData) => (
        <div className="flex items-center space-x-2">
          <span
            className="text-blue-600 hover:text-blue-800 font-semibold font-mono text-sm cursor-pointer"
            title={`Block #${rowData.number}`}
          // onClick={(e) => {
          //   e.stopPropagation();
          //   window.open(`https://cbmscan.com/block/${rowData.number}`, "_blank");
          // }}
          >
            #{rowData.number}
          </span>
        </div>
      ),
    },
    {
      field: "timeAgo",
      header: "Age",
      minWidth: "140px",
      body: (rowData) => (
        <span className="text-gray-600 font-mono text-sm" title={rowData.timeAgo}>
          {rowData.timeAgo}
        </span>
      ),
      sortable: true,
    },
    {
      field: "hash",
      header: "Hash",
      minWidth: "250px",
      sortable: true,
      body: (rowData) => (
        <span
          className="text-gray-700 font-mono text-sm truncate cursor-pointer hover:text-blue-600"
          title={rowData.hash}
        // onClick={(e) => {
        //   e.stopPropagation();
        //   navigate(`/search?query=${encodeURIComponent(rowData.hash)}`);
        // }}
        >
          {truncate(rowData.hash)}
        </span>
      ),
    },
    // {
    //   field: "txnsFormatted",
    //   header: "Txns",
    //   minWidth: "80px",
    //   sortable: true,
    //   body: (rowData) => (
    //     <span className="font-semibold text-gray-800">{rowData.txns}</span>
    //   ),
    // },
    // {
    //   field: "validator",
    //   header: "Validator",
    //   minWidth: "200px",
    //   body: (rowData) => (
    //     <span
    //       className="text-gray-700 font-mono text-sm truncate cursor-pointer hover:text-blue-600"
    //       title={rowData.validator}
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         navigator.clipboard.writeText(rowData.validator);
    //       }}
    //     >
    //       {rowData.validator}
    //     </span>
    //   ),
    // },
    // {
    //   field: "gasUsedFormatted",
    //   header: "Gas Used",
    //   minWidth: "140px",
    //   sortable: true,
    //   body: (rowData) => (
    //     <span className="text-gray-700 font-mono text-sm">{rowData.gasUsedFormatted}</span>
    //   ),
    // },
  ];

  // const formatGasFee = (fee) => parseFloat(fee || 0).toFixed(8);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blocks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex justify-between md:flex-row flex-col-reverse gap-5 md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Blockchain Blocks</h1>
            <p className="text-gray-600 mt-2">
              Latest blocks on CBM Mainnet {data ? "(from navigation)" : "(live from API)"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white">
          <div className="bg-white border border-blue-200 p-4 rounded-lg">
            <p className="text-gray-500 font-medium">Latest Block</p>
            <p className="text-2xl font-bold text-blue-600">
              #{blocks[0]?.number || "—"}
            </p>
          </div>
          <div className="bg-white border border-green-200 p-4 rounded-lg">
            <p className="text-gray-500 font-medium">Total Blocks</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalBlocks || 0}
            </p>
          </div>
          <div className="bg-white border border-purple-200 p-4 rounded-lg">
            <p className="text-gray-500 font-medium">Total Txns</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalTransactions || 0}
            </p>
          </div>
          <div className="bg-white border border-indigo-200 p-4 rounded-lg">
            <p className="text-gray-500 font-medium">Total Gas Fee</p>
            <p className="text-2xl font-bold text-indigo-600">
              {formatGasFee(stats.totalGasFee)} CBM
            </p>
          </div>
        </div>
      )} */}

      {/* Blocks Table */}
      <div className="p-6 bg-white">
        {blocks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No blocks data available</p>
            <p className="text-gray-400 mt-2">API might be down or no data available</p>
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
              data={blocks}
              navigateState={(rowData) => ({
                block: rowData.fullData,
                // stats: stats,
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Blocks;