import React from 'react'
import { IoMdCube } from 'react-icons/io';
import { Link } from 'react-router-dom';

const LatestBlocks = () => {
    const latestBlocks = [
        { number: 61145328, timeAgo: '5 secs ago', validator: 'defibit', txns: '146 txns', txnsTime: '1 sec', fee: '0.00206 CBM' },
        { number: 61145327, timeAgo: '5 secs ago', validator: 'defibit', txns: '151 txns', txnsTime: '1 sec', fee: '0.0049 CBM' },
        { number: 61145326, timeAgo: '5 secs ago', validator: 'defibit', txns: '146 txns', txnsTime: '1 sec', fee: '0.00259 CBM' },
        { number: 61145325, timeAgo: '5 secs ago', validator: 'defibit', txns: '102 txns', txnsTime: '1 sec', fee: '0.00217 CBM' },
        { number: 61145324, timeAgo: '5 secs ago', validator: 'defibit', txns: '109 txns', txnsTime: '1 sec', fee: '0.00199 CBM' },
        { number: 61145323, timeAgo: '5 secs ago', validator: 'defibit', txns: '106 txns', txnsTime: '1 sec', fee: '0.00444 CBM' },
        { number: 61145325, timeAgo: '5 secs ago', validator: 'defibit', txns: '102 txns', txnsTime: '1 sec', fee: '0.00217 CBM' },
        { number: 61145324, timeAgo: '5 secs ago', validator: 'defibit', txns: '109 txns', txnsTime: '1 sec', fee: '0.00199 CBM' },
        { number: 61145323, timeAgo: '5 secs ago', validator: 'defibit', txns: '106 txns', txnsTime: '1 sec', fee: '0.00444 CBM' },
        { number: 61145325, timeAgo: '5 secs ago', validator: 'defibit', txns: '102 txns', txnsTime: '1 sec', fee: '0.00217 CBM' },
    ];


    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Latest Blocks</h3>
                <button className="text-blue-400 hover:text-blue-500 transition duration-200">◆ Customize</button>
            </div>
            <div className="divide-y divide-gray-200 h-[60vh] overflow-auto">
                {latestBlocks.map((block, index) => (
                    <div key={index}
                        className="p-4 whitespace-nowrap flex flex-row items-center justify-between gap-4 sm:gap-8 hover:bg-gray-50 transition duration-200"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <IoMdCube className="text-2xl text-gray-500 flex-shrink-0" />
                            <div className="min-w-0">
                                <div className="font-mono text-blue-400 truncate max-w-[150px] sm:max-w-[200px]">{block.number}</div>
                                <div className="text-gray-500 text-sm">{block.timeAgo}</div>
                            </div>
                        </div>
                        <div className="text-gray-600">Validated By <span className='text-blue-500'>Validator: {block.validator} <br /> {block.txns} <span className='text-gray-500'> in ({block.txnsTime})</span> </span>
                        </div>
                        <div className="text-right text-gray-600">{block.fee}</div>
                    </div>
                ))}
            </div>
            <div className="p-4 text-center">
                <Link to="/blockchain/blocks" className="text-blue-400 hover:text-blue-500 transition duration-200">View all blocks</Link>
            </div>
        </div>
    )
}

export default LatestBlocks
