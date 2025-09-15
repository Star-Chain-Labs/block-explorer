import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Helper function to format large numbers (e.g., 1000000000 -> 1B)
const formatMarketCap = (value) => {
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    return value.toLocaleString();
};

const MarketCapChart = () => {
    // Define stats data inside the component
    const stats = {
        marketCap: {
            value: 92000000000, // Current market cap: $92B
            supply: '147,586,297 BNB', // Circulating supply
        },
        marketCapHistory: [
            { date: '2025-09-01', value: 10000000000 },
            { date: '2025-09-03', value: 82000000000 },
            { date: '2025-09-05', value: 50000000000 },
            { date: '2025-09-07', value: 10000000000 },
            { date: '2025-09-09', value: 87000000000 },
            { date: '2025-09-11', value: 90000000000 },
            { date: '2025-09-13', value: 91000000000 },
            { date: '2025-09-15', value: 92000000000 }, // Current value
        ],
    };

    return (
        <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <div className="flex items-center justify-between mb-4">
                <span className="text-blue-400 font-semibold">🌍 MARKET CAP</span>
                <span className="text-sm text-gray-500">Last 15 days</span>
            </div>

            {/* Current Value Display */}
            <div className="mb-4 text-center">
                <span className="text-2xl font-bold text-gray-800">
                    {formatMarketCap(stats.marketCap.value)} ({stats.marketCap.supply})
                </span>
            </div>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.marketCapHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            stroke="#888"
                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis
                            stroke="#888"
                            tickFormatter={formatMarketCap}
                            width={60}
                        />
                        <Tooltip
                            formatter={(value) => [formatMarketCap(value), 'Market Cap']}
                            labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MarketCapChart;