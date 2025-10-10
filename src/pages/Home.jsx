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
import { IoSearch } from "react-icons/io5";
// import bgImage from '/mnt/data/c5b41e66-2c3d-4620-9e0d-7ad427443720.png'; // your uploaded image

const Home = () => {
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const handleSearch = (e) => {
    if ((e.key === "Enter" || e.type === "click") && query.trim()) {
      setSearchActive(true); // Search mode on
    }
  };

  // Sample data
  const stats = {
    bnbPrice: { value: 593.65, change: -0.66 },
    transactions: { total: '8,889.26M', tps: '188.7 TPS' },
    medGasPrice: { value: '0.1 Gwei', usd: '< $0.01' },
    latestBlock: { number: 61145328, time: '0.75s' },
    votingPower: '25,885,289.56 CBM',
    marketCap: { value: '$39,972,145,681.00', supply: '150,404,848 CBM' }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="relative w-full">
        <div className="absolute inset-0 h-52 w-full z-0">
          <div className="absolute inset-0 bg-black/50"
            style={{
              backgroundImage: `url('https://i.pinimg.com/736x/3a/e9/b5/3ae9b50dc0f79706be047e2c64f385be.jpg')`
            }}
          >
          </div>
        </div>

        {/* Search input */}
        <div className="relative z-10 max-w-7xl px-6 pt-10 flex md:flex-row flex-col items-center w-full gap-32">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-3">CBM Block Explorer</h1>
            <div className="relative">
              <IoSearch className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
                className="w-full md:w-4xl pl-12 pr-24 py-3 rounded-lg bg-white border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Search
              </button>
            </div>
          </div>
          {/* addvertise image  */}
          <div className='text-blue w-full hidden md:block'>
            <img src="https://i.pinimg.com/736x/6b/de/d0/6bded074958cb36db86e49806cdcf0a0.jpg" className='h-32 w-52' alt="" />
          </div>
        </div>
      </div>

      {/* Search Results or Main Content */}
      <div className='mt-20'>
        {searchActive ? (
          <SearchResults query={query} />
        ) : (
          <>
            {/* Stats Row */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full mx-auto">
              {/* CBM Price */}
              <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-semibold">◆ CBM PRICE</span>
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
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Latest Block</span>
                  <span className="text-lg font-bold text-gray-800">
                    {stats.latestBlock.number} ({stats.latestBlock.time})
                  </span>
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
            {/* <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mx-auto">
              <MarketCapChart />
              <TransactionHistoryChart />
            </div> */}

            {/* Latest Blocks and Transactions Row */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mx-auto">
              <LatestBlocks />
              <LatestTransactions />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="p-6 bg-white shadow-lg border-t border-gray-300 text-center text-gray-900 font-medium">
        © 2025 CBM BlockExplorer
      </footer>
    </div>
  );
};

export default Home;
