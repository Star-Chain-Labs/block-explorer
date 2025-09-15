import React from 'react';
import { CgNotes } from 'react-icons/cg';
import { Link } from 'react-router-dom';

const LatestTransactions = () => {
    const latestTransactions = [
        { hash: '0xc00a0a9e00xc00a0a9b', from: '0x45ac960x45ac960x45ac96e3d23f', to: '0x0000...001000', value: '0.039 BNB', timeAgo: '5 secs ago' },
        { hash: '0xd460060f0xc00a0a9e0', from: '0x28092a...0c9c27', to: '0x4fe1bb...e97b48', value: '0 BNB', timeAgo: '5 secs ago' },
        { hash: '0x65e5d4d0xc00a0a9e0f', from: '0xe58577...1ed2e7', to: '0x2460...something', value: '0.039 BNB', timeAgo: '5 secs ago' },
    ];

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Latest Transactions</h3>
                <button className="text-blue-400 hover:text-blue-500 transition duration-200">◆ Customize</button>
            </div>
            <div className="divide-y divide-gray-200 h-[60vh] overflow-auto">
                {latestTransactions.map((tx, index) => (
                    <div
                        key={index}
                        className="p-4 whitespace-nowrap flex flex-row items-center gap-4 sm:gap-8 hover:bg-gray-50 transition duration-200"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <CgNotes className="text-2xl text-gray-500 flex-shrink-0" />
                            <div className="min-w-0">
                                <div className="font-mono text-blue-400 truncate max-w-[100px] sm:max-w-[200px]">{tx.hash}</div>
                                <div className="text-gray-500 text-sm">{tx.timeAgo}</div>
                            </div>
                        </div>
                        <div className="text-gray-600 min-w-0">
                            <div className="truncate">
                                <strong>From:</strong> {tx.from}
                            </div>
                            <div className="truncate">
                                <strong>To:</strong> {tx.to}
                            </div>
                        </div>
                        <div className="text-gray-600 text-right sm:flex-1">{tx.value}</div>
                    </div>
                ))}
            </div>
            <div className="p-4 text-center">
                <Link to="/blockchain/transactions" className="text-blue-400 hover:text-blue-500 transition duration-200">
                    View all transactions
                </Link>
            </div>
        </div>
    );
};

export default LatestTransactions;