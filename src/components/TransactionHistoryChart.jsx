import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
    { date: "Aug 30", transactions: 20000, avgGas: 0.05 },
    { date: "Sep 1", transactions: 50000, avgGas: 0.06 },
    { date: "Sep 3", transactions: 80000, avgGas: 0.07 },
    { date: "Sep 5", transactions: 220000, avgGas: 0.08 },
    { date: "Sep 6", transactions: 50000, avgGas: 0.09 },
    { date: "Sep 8", transactions: 280000, avgGas: 0.1 },
    { date: "Sep 10", transactions: 50000, avgGas: 0.11 },
    { date: "Sep 12", transactions: 320000, avgGas: 0.12 },
    { date: "Sep 13", transactions: 350000, avgGas: 0.13 },
    { date: "Sep 14", transactions: 370000, avgGas: 0.14 },
];

const formatNumber = (value) => {
    const numValue = Number(value) || 0;
    if (numValue >= 1000000) {
        return `${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
        return `${(numValue / 1000).toFixed(1)}K`;
    }
    return numValue.toFixed(0);
};

const formatGas = (value) => {
    return `${(Number(value) || 0).toFixed(2)} Gwei`;
};

const maxYValue = Math.max(
    ...dummyData.map((item) => Math.max(Number(item.transactions) || 0, (Number(item.avgGas) || 0) * 1000000))
);
const yAxisDomain = [0, Math.ceil(maxYValue * 1.1)];

const TransactionHistoryChart = () => {
    return (
        <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction History in 14 days</h3>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={dummyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis
                        domain={yAxisDomain}
                        tickFormatter={(value) => formatNumber(value)}
                        yAxisId="left"
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip
                        formatter={(value, name) => {
                            if (name === 'transactions') {
                                return [formatNumber(value), 'Transactions'];
                            } else {
                                return [formatGas(value), 'Avg Gas Price (Gwei)'];
                            }
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="transactions"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#transactionGradient)"
                        yAxisId="left"
                    />
                    <Area
                        type="monotone"
                        dataKey="avgGas"
                        stroke="#10b981"
                        strokeDasharray="5 5"
                        fill="none"
                        yAxisId="left"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-sm text-gray-600 mt-4">
                <span>Aug 30</span>
                <span>350K</span>
                <span>Sep 6</span>
                <span>Sep 13</span>
                <span>Now</span>
            </div>
            <div className="flex justify-center mt-2 text-xs text-gray-500">
                <span className="mr-4">Transactions</span>
                <span>Dashed: Avg Gas Price</span>
            </div>
        </div>
    );
};

export default TransactionHistoryChart;