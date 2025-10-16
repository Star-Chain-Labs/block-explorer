import React, { memo } from 'react'

const StatsCard = memo(({ icon: Icon, title, value, subtitle, emoji }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <div className="text-sm text-gray-500 mb-1">{title}</div>
                <div className="text-2xl font-bold text-gray-800">{value}</div>
                {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
            </div>
            {Icon ? (
                <Icon className="text-blue-500 w-8 h-8" />
            ) : (
                <div className="text-3xl">{emoji}</div>
            )}
        </div>
    </div>
));

export default StatsCard
