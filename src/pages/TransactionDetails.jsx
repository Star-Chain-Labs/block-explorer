import React from "react";

const TransactionDetails = () => {
    // Transaction details data
    const transaction = {
        transactionAction: "Transfer 0.0009831489 CBM ($0.33) to BSC System Reward",
        burn: "0.0009830833 CBM ($0.34)",
        transactionHash: "0xb0c0a9f3c0e02531d26d73a8c51ae265e5ef143b8d9f",
        status: "Success",
        block: 61243509,
        timestamp: "1 min ago (Sep-15-2025 10:54:14 AM UTC)",
        sponsored: "BSC Validator Set",
        from: "0x50a2CEE25E6A0a0D46E1249f00f6a0d...",
        to: "0x0000000000000000000000000000000000001000 (BSC Validator Set)",
        internalTransactions: {
            transfers: [
                {
                    type: "Transfer",
                    amount: "0.0009831489 CBM ($0.33)",
                    from: "BSC Validator Set",
                    to: "BSC System Reward",
                },
                {
                    type: "Transfer",
                    amount: "0.0009830833 CBM ($0.34)",
                    from: "BSC Validator Set",
                    to: "Null 0x00...dEA0",
                },
            ],
        },
        value: "0.0009838334 CBM ($0.34)",
        transactionFee: "0 CBM ($0.00)",
        gasPrice: "0 CBM",
        gasLimitUsageByTime: "9,223,372,036,854,775,807 (53.34%)",
        burntFees: "0.0009838334 CBM ($0.34)",
        otherAttributes: {
            nonce: "52664",
            positionInBlock: "149",
        },
        inputData: "function deposit(address valaddr)",
        methodID: "0x8e0f4b8e0000000000000000000000005e2ec6a8bd2e6e1243ffedfe1e0",
    };

    return (
        <div className="min-h-screen w-full bg-white text-gray-800 shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">
                Transaction Details
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Transaction Action:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.transactionAction}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Burn:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.burn}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Transaction Hash:</strong>
                        <span className="w-2/3 text-gray-600 break-all">{transaction.transactionHash}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Status:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.status}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Block:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.block}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Timestamp:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.timestamp}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Sponsored:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.sponsored}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">From:</strong>
                        <span className="w-2/3 text-gray-600 break-all">{transaction.from}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">To:</strong>
                        <span className="w-2/3 text-gray-600 break-all">{transaction.to}</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <strong className="text-gray-700 font-semibold">Internal Transactions:</strong>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            {transaction.internalTransactions.transfers.map((transfer, index) => (
                                <li key={index} className="text-gray-600">
                                    {transfer.type}: {transfer.amount} from {transfer.from} to {transfer.to}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Value:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.value}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Transaction Fee:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.transactionFee}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Gas Price:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.gasPrice}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Gas Limit & Usage by Time:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.gasLimitUsageByTime}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Burnt Fees:</strong>
                        <span className="w-2/3 text-gray-600">{transaction.burntFees}</span>
                    </div>
                    <div>
                        <strong className="text-gray-700 font-semibold">Other Attributes:</strong>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li className="text-gray-600">Nonce: {transaction.otherAttributes.nonce}</li>
                            <li className="text-gray-600">Position in Block: {transaction.otherAttributes.positionInBlock}</li>
                        </ul>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Input Data:</strong>
                        <span className="w-2/3 text-gray-600 break-all">{transaction.inputData}</span>
                    </div>
                    <div className="flex items-center">
                        <strong className="w-1/3 text-gray-700 font-semibold">Method ID:</strong>
                        <span className="w-2/3 text-gray-600 break-all">{transaction.methodID}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;