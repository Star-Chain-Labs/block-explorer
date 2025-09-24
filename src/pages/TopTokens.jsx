import React from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Table from "../components/Table";

const TopTokens = () => {
  // Token tracker data with unique image URLs or icon references
  const tokenData = [
    {
      rank: 1,
      token: "Binance-Peg Ethereum Token (ETH)",
      image: "https://via.placeholder.com/20/3c3c3d?text=E", // Ethereum placeholder
      price: "$4,513.6149 CBM",
      change: "-3.20%",
      volume24h: "$35,836,246.536.00",
      circulatingMarketCap: "$544,814,270.948.00",
      onchainMarketCap: "$2,730,737,014.00",
      holders: "2,349,830 (0.004%)",
    },
    {
      rank: 2,
      token: "Binance-Peg XRP Token (XRP)",
      image: "https://via.placeholder.com/20/000000?text=X", // XRP placeholder
      price: "$2.9732 CBM",
      change: "-3.62%",
      volume24h: "$5,596,151.063.00",
      circulatingMarketCap: "$177,234,058.42.00",
      onchainMarketCap: "$968,674,003.00",
      holders: "468,919 (0.009%)",
    },
    {
      rank: 3,
      token: "Binance-Peg BSC-USD (BSC-USD)",
      image: "https://via.placeholder.com/20/1a72e8?text=B", // BSC-USD placeholder
      price: "$1.0098 CBM",
      change: "-0.03%",
      volume24h: "$94,270,536.68.00",
      circulatingMarketCap: "$170,316,202.876.00",
      onchainMarketCap: "$6,784,993,599.00",
      holders: "37,449,657 (0.013%)",
    },
    {
      rank: 4,
      token: "Thunder Wrapped CBM (CBM)",
      image: "https://via.placeholder.com/20/ffd700?text=W", // Wrapped CBM placeholder
      price: "$916.223 CBM",
      change: "-2.39%",
      volume24h: "$2,454,075.49.00",
      circulatingMarketCap: "$127,526,245.825.00",
      onchainMarketCap: "$81,544.00",
      holders: "5,514 (-0.036%)",
    },
    {
      rank: 5,
      token: "Wrapped CBM (WCBM)",
      image: "https://via.placeholder.com/20/ffd700?text=W", // Wrapped CBM placeholder
      price: "$916.223 CBM",
      change: "-2.39%",
      volume24h: "$2,454,075.49.00",
      circulatingMarketCap: "$127,526,245.825.00",
      onchainMarketCap: "$1,227,166,133.00",
      holders: "2,729,921 (0.123%)",
    },
    {
      rank: 6,
      token: "Binance-Peg USD Coin (USDC)",
      image: "https://via.placeholder.com/20/2775c9?text=U", // USDC placeholder
      price: "$0.9999 CBM",
      change: "+0.01%",
      volume24h: "$15,338,379.100.00",
      circulatingMarketCap: "$73,138,672.57.00",
      onchainMarketCap: "$1,048,932,570.00",
      holders: "2,724,415 (0.017%)",
    },
    {
      rank: 7,
      token: "USDC (anyUSDC)",
      image: "https://via.placeholder.com/20/2775c9?text=U", // anyUSDC placeholder
      price: "$0.9999 CBM",
      change: "+0.01%",
      volume24h: "$15,338,379.100.00",
      circulatingMarketCap: "$73,138,672.57.00",
      onchainMarketCap: "$4,727,776.00",
      holders: "2,119 (0.000%)",
    },
    {
      rank: 8,
      token: "Binance-Peg Dogecoin Token (DOGE)",
      image: "https://via.placeholder.com/20/c2a633?text=D", // Dogecoin placeholder
      price: "$0.262 CBM",
      change: "-9.94%",
      volume24h: "$6,350,697.946.00",
      circulatingMarketCap: "$39,541,621.203.00",
      onchainMarketCap: "$671,648,474.00",
      holders: "990,300 (-0.012%)",
    },
    {
      rank: 9,
      token: "TRON (TRX)",
      image: "https://via.placeholder.com/20/17191d?text=T", // TRON placeholder
      price: "$0.3462 CBM",
      change: "-1.06%",
      volume24h: "$738,962,456.00",
      circulatingMarketCap: "$32,779,967.86.00",
      onchainMarketCap: "$102,323,259.00",
      holders: "101,007 (0.015%)",
    },
    {
      rank: 10,
      token: "Binance-Peg BUSD Token (BUSD)",
      image: "https://via.placeholder.com/20/1a72e8?text=B", // BUSD placeholder
      price: "$0.867 CBM",
      change: "-7.26%",
      volume24h: "$1,418,337.92.00",
      circulatingMarketCap: "$2,765,555.43.00",
      onchainMarketCap: "$2,223,831.01.00",
      holders: "614,875 (0.013%)",
    },
  ];

  // Table columns for token tracker with image support
  const tableColumns = [
    { field: "rank", header: "#", minWidth: "50px" },
    {
      field: "token",
      header: "Token",
      minWidth: "200px",
      body: (rowData) => (
        <div className="flex items-center space-x-2">
          <img
            src={rowData.image}
            alt={`${rowData.token} icon`}
            className="w-6 h-6 object-cover rounded-full" // Adjusted size and added object-contain
            // onError={(e) => { e.target.src = "https://via.placeholder.com/20?text=?"; }} // Fallback image
          />
          <span>{rowData.token}</span>
        </div>
      ),
    },
    { field: "price", header: "Price", minWidth: "150px" },
    {
      field: "change",
      header: "Change (%)",
      minWidth: "120px",
      body: (rowData) => {
        const color = rowData.change.includes("+") ? "green" : rowData.change.includes("-") ? "red" : "gray";
        return (
          <span
            className="px-1 py-0.5 rounded text-white text-sm"
            style={{ backgroundColor: color }}
          >
            {rowData.change}
          </span>
        );
      },
    },
    { field: "volume24h", header: "Volume (24h)", minWidth: "150px" },
    { field: "circulatingMarketCap", header: "Circulating Market Cap", minWidth: "200px" },
    { field: "onchainMarketCap", header: "Onchain Market Cap", minWidth: "200px" },
    { field: "holders", header: "Holders", minWidth: "150px" },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black shadow p-4">
      <h1 className="text-2xl font-bold mb-4">Token Tracker (BEP-20)</h1>
      <Table columns={tableColumns} data={tokenData} />
    </div>
  );
};

export default TopTokens;