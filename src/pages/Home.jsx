// import React from 'react';
// import TransactionHistoryChart from '../components/TransactionHistoryChart';
// import MarketCapChart from '../components/MarketCapChart';
// import LatestBlocks from '../components/LatestBlocks';
// import LatestTransactions from '../components/LatestTransactions';

// const Home = () => {
//   // Sample data based on the provided image and document
//   const stats = {
//     bnbPrice: { value: 593.65, change: -0.66 },
//     transactions: { total: '8,889.26M', tps: '188.7 TPS' },
//     medGasPrice: { value: '0.1 Gwei', usd: '< $0.01' },
//     latestBlock: { number: 61145328, time: '0.75s' },
//     votingPower: '25,885,289.56 BNB',
//     marketCap: { value: '$39,972,145,681.00', supply: '150,404,848 BNB' }
//   };

//   return (
//     <div className="min-h-screen bg-white text-gray-800 font-sans">
//       {/* Header */}
//       <header className="bg-white shadow-md p-6 flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">CBM BlockExplorer</h1>
//       </header>

//       {/* Search Bar Section */}
//       <div className="p-6">
//         <div className="relative w-full mx-auto">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
//             />
//           </svg>
//           <input
//             type="text"
//             placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
//             className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//           />
//           <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500">
//             Filters ▼
//           </button>
//         </div>
//       </div>



//       {/* Stats Row */}
//       <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full mx-auto">
//         {/* BNB Price */}
//         <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
//           <div className="flex items-center justify-between">
//             <span className="text-yellow-400 font-semibold">◆ BNB PRICE</span>
//             <span className="text-sm text-gray-700">$593.65 @ 0.008071 BTC ({stats.bnbPrice.change}%)</span>
//           </div>
//         </div>

//         {/* Transactions */}
//         <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
//           <div className="flex flex-col">
//             <span className="text-sm text-gray-600">Transactions</span>
//             <span className="text-lg font-bold text-gray-800">{stats.transactions.total} ({stats.transactions.tps})</span>
//           </div>
//         </div>

//         {/* Med Gas Price */}
//         <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
//           <div className="flex flex-col">
//             <span className="text-sm text-gray-600">Med Gas Price</span>
//             <span className="text-lg font-bold text-gray-800">{stats.medGasPrice.value} ({stats.medGasPrice.usd})</span>
//           </div>
//         </div>

//         {/* Latest Block */}
//         <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <span className="text-sm text-gray-600">Latest Block</span>
//               <span className="block text-lg font-bold text-gray-800">{stats.latestBlock.number} ({stats.latestBlock.time})</span>
//             </div>
//             <span className="text-sm text-gray-700">{stats.latestBlock.number}</span>
//           </div>
//         </div>

//         {/* Voting Power */}
//         <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
//           <div className="flex flex-col">
//             <span className="text-sm text-gray-600">Voting Power</span>
//             <span className="text-lg font-bold text-gray-800">{stats.votingPower}</span>
//           </div>
//         </div>
//       </div>

//       {/* Market Cap and Chart Section */}
//       <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mx-auto">
//         {/* Market Cap */}
//         <MarketCapChart />
//         {/* Transaction History Chart */}
//         <TransactionHistoryChart />
//       </div>

//       {/* Latest Blocks and Transactions Row */}
//       <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mx-auto">
//         <LatestBlocks />
//         <LatestTransactions />
//       </div>

//       {/* Footer */}
//       <footer className="p-6 bg-white shadow-lg border-t border-gray-300 text-center text-gray-900 font-medium">
//         © 2025 CBM BlockExplorer
//       </footer>
//     </div>
//   );
// };

// export default Home;


import React, { useState } from 'react';
import TransactionHistoryChart from '../components/TransactionHistoryChart';
import MarketCapChart from '../components/MarketCapChart';
import LatestBlocks from '../components/LatestBlocks';
import LatestTransactions from '../components/LatestTransactions';
import SearchResults from './SearchResults';


const Home = () => {
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const handleSearch = (e) => {
    if ((e.key === "Enter" || e.type === "click") && query.trim()) {
      setSearchActive(true); // ✅ Search mode on
    }
  };

  // Sample data
  const stats = {
    bnbPrice: { value: 593.65, change: -0.66 },
    transactions: { total: '8,889.26M', tps: '188.7 TPS' },
    medGasPrice: { value: '0.1 Gwei', usd: '< $0.01' },
    latestBlock: { number: 61145328, time: '0.75s' },
    votingPower: '25,885,289.56 BNB',
    marketCap: { value: '$39,972,145,681.00', supply: '150,404,848 BNB' }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">CBM BlockExplorer</h1>
      </header>

      {/* Search Bar Section */}
      <div className="p-6">
        <div className="relative w-full mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
          >
            Search
          </button>
        </div>
      </div>

      {/* ✅ Conditionally Show Search Results */}
      {searchActive ? (
        <SearchResults query={query} />
      ) : (
        <>
          {/* Stats Row */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full mx-auto">
            {/* BNB Price */}
            <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-semibold">◆ BNB PRICE</span>
                <span className="text-sm text-gray-700">
                  ${stats.bnbPrice.value} @ 0.008071 BTC ({stats.bnbPrice.change}%)
                </span>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Transactions</span>
                <span className="text-lg font-bold text-gray-800">
                  {stats.transactions.total} ({stats.transactions.tps})
                </span>
              </div>
            </div>

            {/* Med Gas Price */}
            <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Med Gas Price</span>
                <span className="text-lg font-bold text-gray-800">
                  {stats.medGasPrice.value} ({stats.medGasPrice.usd})
                </span>
              </div>
            </div>

            {/* Latest Block */}
            <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Latest Block</span>
                  <span className="block text-lg font-bold text-gray-800">
                    {stats.latestBlock.number} ({stats.latestBlock.time})
                  </span>
                </div>
                <span className="text-sm text-gray-700">{stats.latestBlock.number}</span>
              </div>
            </div>

            {/* Voting Power */}
            <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Voting Power</span>
                <span className="text-lg font-bold text-gray-800">{stats.votingPower}</span>
              </div>
            </div>
          </div>

          {/* Market Cap and Chart Section */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mx-auto">
            <MarketCapChart />
            <TransactionHistoryChart />
          </div>

          {/* Latest Blocks and Transactions Row */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mx-auto">
            <LatestBlocks />
            <LatestTransactions />
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="p-6 bg-white shadow-lg border-t border-gray-300 text-center text-gray-900 font-medium">
        © 2025 CBM BlockExplorer
      </footer>
    </div>
  );
};

export default Home;
