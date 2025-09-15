import React from "react";
import Table from "../components/Table";

const TokenTransfer = () => {
    // Token transfer data
    const transferData = [
        {
            transactionHash: "0x27b6075017...",
            method: "0x25556bc7",
            block: 61241528,
            age: "4 secs ago",
            from: "Binance Alpha 2.0 Router...",
            to: "0x73d8bD54...0644946b",
            amount: "3.467.14472907",
            token: "World of Dyp... (WoD)",
        },
        {
            transactionHash: "0x27b6075017...",
            method: "0x25556bc7",
            block: 61241528,
            age: "4 secs ago",
            from: "Binance: DEX Router",
            to: "Binance Alpha 2.0 Router...",
            amount: "3.467.14472907",
            token: "World of Dyp... (WoD)",
        },
        {
            transactionHash: "0x27b6075017...",
            method: "0x25556bc7",
            block: 61241528,
            age: "4 secs ago",
            from: "0xCA852767...5E20C78bD",
            to: "0xCF39e58e...C22BE9f4",
            amount: "232.93143187",
            token: "Binance-Peg ... (BSC-U...)",
        },
        {
            transactionHash: "0x27b6075017...",
            method: "0x25556bc7",
            block: 61241528,
            age: "4 secs ago",
            from: "0xCF39e58e...C22BE9f4",
            to: "Binance: DEX Router",
            amount: "3.467.14472907",
            token: "World of Dyp... (WoD)",
        },
        {
            transactionHash: "0x27b6075017...",
            method: "0x25556bc7",
            block: 61241528,
            age: "4 secs ago",
            from: "Binance: DEX Router",
            to: "0xCA852767...5E20C78bD",
            amount: "232.93143187",
            token: "Binance-Peg ... (BSC-U...)",
        },
        {
            transactionHash: "0x27b6075017...",
            method: "0x25556bc7",
            block: 61241528,
            age: "4 secs ago",
            from: "Binance Alpha 2.0 Router...",
            to: "Binance: DEX Router",
            amount: "232.93143187",
            token: "Binance-Peg ... (BSC-U...)",
        },
        {
            transactionHash: "0xe9815702b9...",
            method: "Multicall",
            block: 61241528,
            age: "4 secs ago",
            from: "0x70e20f11...FC6D991eB",
            to: "0x0743cBF...cc30DC83b",
            amount: "0.10086159",
            token: "BEP-20: GET (GET)",
        },
        {
            transactionHash: "0xe9815702b9...",
            method: "Multicall",
            block: 61241528,
            age: "4 secs ago",
            from: "0xd496767...3d21E888",
            to: "0x0743cBF...cc30DC83b",
            amount: "0.10086159",
            token: "Binance-Peg ... (BSC-U...)",
        },
        {
            transactionHash: "0xe9815702b9...",
            method: "Multicall",
            block: 61241528,
            age: "4 secs ago",
            from: "0x70e20f11...FC6D991eB",
            to: "0x1bc36b02...f8e91bA5",
            amount: "0.10086159",
            token: "BEP-20: GET (GET)",
        },
    ];

    // Table columns for token transfers
    const tableColumns = [
        { field: "transactionHash", header: "Transaction Hash", minWidth: "200px" },
        { field: "method", header: "Method", minWidth: "150px" },
        { field: "block", header: "Block", minWidth: "100px" },
        { field: "age", header: "Age", minWidth: "120px" },
        { field: "from", header: "From", minWidth: "200px" },
        { field: "to", header: "To", minWidth: "200px" },
        { field: "amount", header: "Amount", minWidth: "150px" },
        { field: "token", header: "Token", minWidth: "200px" },
    ];

    return (
        <div className="min-h-screen w-full bg-white text-black shadow p-4">
            <h1 className="text-2xl font-bold mb-4">Token Transfers (BEP-20)</h1>
            <Table columns={tableColumns} data={transferData} />
        </div>
    );
};

export default TokenTransfer;