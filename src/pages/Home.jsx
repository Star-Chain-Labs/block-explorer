import React from 'react';

const Home = () => {
  // Sample data based on the provided image and document
  const stats = {
    bnbPrice: { value: 593.65, change: -0.66 },
    transactions: { total: '8,889.26M', tps: '188.7 TPS' },
    medGasPrice: { value: '0.1 Gwei', usd: '< $0.01' },
    latestBlock: { number: 61145328, time: '0.75s' },
    votingPower: '25,885,289.56 BNB',
    marketCap: { value: '$39,972,145,681.00', supply: '150,404,848 BNB' }
  };

  const latestBlocks = [
    { number: 61145328, timeAgo: '5 secs ago', validator: 'defibit', txns: '146 txns in 0 secs', fee: '0.00206 BNB' },
    { number: 61145327, timeAgo: '5 secs ago', validator: 'defibit', txns: '151 txns in 1 sec', fee: '0.0049 BNB' },
    { number: 61145326, timeAgo: '5 secs ago', validator: 'defibit', txns: '146 txns in 0 secs', fee: '0.00259 BNB' },
    { number: 61145325, timeAgo: '5 secs ago', validator: 'defibit', txns: '102 txns in 0 secs', fee: '0.00217 BNB' },
    { number: 61145324, timeAgo: '5 secs ago', validator: 'defibit', txns: '109 txns in 1 sec', fee: '0.00199 BNB' },
    { number: 61145323, timeAgo: '5 secs ago', validator: 'defibit', txns: '106 txns in 1 sec', fee: '0.00444 BNB' }
  ];

  const latestTransactions = [
    { hash: '0xc00a0a9e0b...', from: '0x45ac96...e3d23f', to: '0x0000...001000', value: '0.039 BNB', timeAgo: '5 secs ago' },
    { hash: '0xd460060f2...', from: '0x28092a...0c9c27', to: '0x4fe1bb...e97b48', value: '0 BNB', timeAgo: '5 secs ago' },
    { hash: '0x65e5d4d1...', from: '0xe58577...1ed2e7', to: '0x2460...something', value: '0.039 BNB', timeAgo: '5 secs ago' }
  ];

  return (
    <div className="w-full bg-white text-gray-700 font-sans p-3">
      {/* Header */}
      <header className="bg-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">BNB Smart Chain Explorer</h1>
      </header>

      {/* Search Bar Section */}
      <div className="p-4 bg-white border-b border-gray-700">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 text-gray-500"
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

          {/* Input with Filters inside */}
          <input
            type="text"
            placeholder="All Filters ▼  |  Search by Address / Txn Hash / Block / Token / Domain Name"
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sponsored Ad Placeholder */}
      <div className="p-4 bg-white ">
        <div className="bg-white p-4 rounded-md text-center">
          Sponsored: 1inch Solana EVM swaps. No bridges. The best rates. Swap now!
        </div>
      </div>

      {/* Stats Row */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-100 border rounded-2xl">
        {/* BNB Price */}
        <div className="bg-white p-4 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-yellow-400">◆ BNB PRICE</span>
            <span className="text-sm text-gray-800">$593.65 @ 0.008071 BTC ({stats.bnbPrice.change}%)</span>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white p-4 rounded-md">
          <div className="flex flex-col">
            <span className="text-sm text-gray-800">Transactions</span>
            <span className="text-lg font-bold">{stats.transactions.total} ({stats.transactions.tps})</span>
          </div>
        </div>

        {/* Med Gas Price */}
        <div className="bg-white p-4 rounded-md">
          <div className="flex flex-col">
            <span className="text-sm text-gray-800">Med Gas Price</span>
            <span className="text-lg font-bold">{stats.medGasPrice.value} ({stats.medGasPrice.usd})</span>
          </div>
        </div>

        {/* Latest Block */}
        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-800">Latest Block</span>
              <span className="block text-lg font-bold">{stats.latestBlock.number} ({stats.latestBlock.time})</span>
            </div>
            <span className="text-sm text-gray-800">61145328</span>
          </div>
        </div>

        {/* Voting Power */}
        <div className="bg-white p-4 rounded-md">
          <div className="flex flex-col">
            <span className="text-sm text-gray-800">Voting Power</span>
            <span className="text-lg font-bold">{stats.votingPower}</span>
          </div>
        </div>
      </div>

      {/* Market Cap and Chart Section */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 border-b border-gray-700">
        {/* Market Cap */}
        <div className="bg-white p-4 rounded-md">
          <div className="flex items-center">
            <span className="text-blue-400">🌍 BNB MARKET CAP ON BSC</span>
          </div>
          <span className="text-lg font-bold">{stats.marketCap.value} ({stats.marketCap.supply})</span>
        </div>

        {/* Transaction History Chart */}
        <div className="bg-white p-4 rounded-md">
          <h3 className="text-lg font-bold mb-2">BNB SMART CHAIN Transaction History in 14 days</h3>
          <div className="h-32 bg-gray-600 rounded-md flex items-center justify-center text-gray-800">
            {/* Placeholder for chart - In real app, use Recharts or similar */}
            Loading Chart...
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Sep 6</span>
            <span>1M</span>
            <span>Sep 13</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      {/* Latest Blocks and Transactions Row */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 " >
        {/* Latest Blocks */}
        <div className="bg-white border rounded-2xl border-gray-200 ">
          <div className="flex justify-between items-center p-4  border-gray-600 ">
            <h3 className="text-lg font-bold">Latest Blocks</h3>
            <button className="text-blue-400 hover:underline">◆ Customize</button>
          </div>
          <div className="divide-y divide-gray-600">
            {latestBlocks.map((block, index) => (
              <div key={index} className="p-4 grid grid-cols-4 gap-4 items-center border border-gray-300">
                <div className="font-mono text-blue-400">Block {block.number}</div>
                <div className="text-gray-800">{block.timeAgo}</div>
                <div className="text-gray-800">Validated By Validator : {block.validator}</div>
                <div className="text-right">{block.txns} {block.fee}</div>
              </div>
            ))}
          </div>
          <div className="p-4 text-center text-blue-400 hover:underline">
            View all blocks
          </div>
        </div>

        {/* Latest Transactions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex justify-between items-center p-4 border-b border-gray-600">
            <h3 className="text-lg font-bold">Latest Transactions</h3>
            <button className="text-blue-400 hover:underline">◆ Customize</button>
          </div>
          <div className="divide-y divide-gray-600">
            {latestTransactions.map((tx, index) => (
              <div key={index} className="p-4 grid grid-cols-4 gap-4 items-center border border-gray-300">
                <div className="font-mono text-blue-400 truncate">{tx.hash}</div>
                <div className="text-gray-800">{tx.timeAgo}</div>
                <div className="text-gray-800">
                  From {tx.from} <br />
                  To {tx.to}
                </div>
                <div className="text-right">{tx.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Placeholder */}
      <footer className="p-4 bg-gray-800 text-center text-gray-800 border-t border-gray-700">
        © 2025 BNB Smart Chain Explorer
      </footer>
    </div>
  );
};

export default Home;