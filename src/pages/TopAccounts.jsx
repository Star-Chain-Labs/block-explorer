import React, { useEffect, useState } from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Table from "../components/Table";

const HIDE_ADDRESS = "0x1735ffa5105e997ce4503fb60b530692805f8f86";

const TopAccounts = () => {
  const [holderData, setHolderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 🧮 Card stats
  const [statsData, setStatsData] = useState([
    { title: "Total Holders", value: "Loading..." },
    { title: "Total CBM Supply", value: "Loading..." },
    { title: "Top Holders Shown", value: "Loading..." },
  ]);

  // 🧾 Table columns
  const tableColumns = [
    { field: "address", header: "Address", minWidth: "250px" },
    { field: "balance", header: "Balance (CBM)", minWidth: "250px" },
    { field: "percentage", header: "Percentage", minWidth: "150px" },
  ];

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const res = await fetch(
          "https://api.cbmscan.com/api/transactions/get-cbm-holders"
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.holders)) {
          // Filter out hidden address
          const visibleHolders = data.holders.filter(
            (h) => h.address.toLowerCase() !== HIDE_ADDRESS.toLowerCase()
          );

          // ✅ Define fixed total supply (2 crore 10 lakh)
          const totalSupply = 21000000;

          // ✅ Format holder data
          const formatted = visibleHolders.map((h) => {
            // Some APIs may give balance in smallest unit — ensure number format
            const balance = parseFloat(h.balance || 0);

            const percentage =
              totalSupply > 0
                ? ((balance / totalSupply) * 100).toFixed(6)
                : "0.000000";

            return {
              address: h.address,
              balance: balance.toFixed(18),
              percentage: `${percentage}%`,
            };
          });

          setHolderData(formatted);
          setFilteredData(formatted);

          // ✅ Update stats cards
          setStatsData([
            {
              title: "Total Holders",
              value: visibleHolders.length.toLocaleString(),
            },
            {
              title: "Total CBM Supply",
              value: `2,10,00,000 CBM`,
            },
            {
              title: "Top Holders Shown",
              value: formatted.length,
            },
          ]);
        }
      } catch (error) {
        console.error("❌ Error fetching CBM holders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
  }, []);

  // 🔍 Search functionality
  useEffect(() => {
    const filtered = holderData.filter((h) =>
      h.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, holderData]);

  return (
    <div className="min-h-screen w-full bg-white text-black shadow md:p-5">
      {/* 🔍 Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by wallet address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-gray-50 text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 🧾 Section Header */}
      <div className="p-4 text-2xl font-bold text-gray-800">
        CBM Token Holders
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {statsData.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <p className="text-gray-500 font-medium">{item.title}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* 🧠 Table Section */}
      <div className="p-4">
        {loading ? (
          <div className="text-center text-lg font-semibold mt-10">
            ⏳ Loading CBM Holders...
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={filteredData}
            rows={100}
            paginator={true}
            rowsPerPageOptions={[10, 25, 50, 100, 200]}
          />
        )}
      </div>
    </div>
  );
};

export default TopAccounts;
