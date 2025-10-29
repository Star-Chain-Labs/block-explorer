// import React, { useEffect, useState } from "react";
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
// import Table from "../components/Table";

// const TopAccounts = () => {
//   const [accountData, setAccountData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Card stats
//   const [statsData, setStatsData] = useState([
//     { title: "Total Accounts", value: "Loading..." },
//     { title: "Total CBM Balance", value: "Loading..." },
//     { title: "Top Accounts Shown", value: "Loading..." },
//   ]);

//   // Table columns
//   const tableColumns = [
//     { field: "address", header: "Address", minWidth: "200px" },
//     { field: "nameTag", header: "Name/Tag", minWidth: "150px" },
//     { field: "balance", header: "Balance", minWidth: "200px" },
//     { field: "percentage", header: "Percentage", minWidth: "150px" },
//     { field: "txnCount", header: "Txn Count", minWidth: "120px" },
//   ];

//   // 🔥 Fetch accounts data from backend
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const res = await fetch(
//           "https://api.cbmscan.com/api/transactions/get-top-accounts"
//         );
//         const data = await res.json();

//         if (Array.isArray(data.accounts)) {
//           // Format data for the table
//           const formatted = data.accounts.map((acc, i) => ({
//             address: acc.address,
//             nameTag: acc.nameTag || "-",
//             balance: `${parseFloat(acc.balance).toFixed(4)} CBM`,
//             percentage: acc.percentage || "-",
//             txnCount: acc.txnCount?.toLocaleString() || "0",
//           }));

//           setAccountData(formatted);
//           setFilteredData(formatted);

//           // Update cards
//           setStatsData([
//             {
//               title: "Total Accounts",
//               value: data.totalAccounts?.toLocaleString() || formatted.length,
//             },
//             {
//               title: "Total CBM Balance",
//               value: `${data.totalBalance || "0"} CBM`,
//             },
//             { title: "Top Accounts Shown", value: formatted.length },
//           ]);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching top accounts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // 🔍 Search functionality
//   useEffect(() => {
//     const filtered = accountData.filter(
//       (acc) =>
//         acc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         acc.nameTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         acc.balance.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredData(filtered);
//   }, [searchTerm, accountData]);

//   return (
//     <div className="min-h-screen w-full bg-white text-black shadow md:p-5">
//       {/* 🔍 Search Bar */}
//       <div className="p-4 border-b border-gray-200">
//         <input
//           type="text"
//           placeholder="Search by address / name / balance..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full p-2 bg-gray-50 text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* 🧾 Section Header */}
//       <div className="p-4 text-2xl font-bold text-gray-800">
//         Top Accounts by CBM Balance
//       </div>

//       {/* 📊 Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//         {statsData.map((item, index) => (
//           <div
//             key={index}
//             className="bg-white border border-gray-300 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
//           >
//             <p className="text-gray-500 font-medium">{item.title}</p>
//             <p className="text-lg font-bold">{item.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* 🧠 Table Section */}
//       <div className="p-4">
//         {loading ? (
//           <div className="text-center text-lg font-semibold mt-10">
//             ⏳ Loading Top Accounts...
//           </div>
//         ) : (
//           <Table columns={tableColumns} data={filteredData} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TopAccounts;

// import React, { useEffect, useState } from "react";
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
// import Table from "../components/Table";

// const TopAccounts = () => {
//   const [holderData, setHolderData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🧮 Card stats
//   const [statsData, setStatsData] = useState([
//     { title: "Total Holders", value: "Loading..." },
//     { title: "Total RBM Supply", value: "Loading..." },
//     { title: "Top Holders Shown", value: "Loading..." },
//   ]);

//   // 🧾 Table columns
//   const tableColumns = [
//     { field: "address", header: "Address", minWidth: "250px" },
//     { field: "balance", header: "Balance (RBM)", minWidth: "150px" },
//     { field: "percentage", header: "Percentage", minWidth: "150px" },
//   ];

//   // 🔥 Fetch RBM holders data from backend
//   useEffect(() => {
//     const fetchHolders = async () => {
//       try {
//         // ⚠️ Change this URL to your backend route
//         const res = await fetch(
//           "http://localhost:8080/api/transactions/get-rbm-holders"
//         );
//         const data = await res.json();

//         if (Array.isArray(data.holders)) {
//           // Calculate total supply
//           const totalSupply = data.holders.reduce(
//             (acc, h) => acc + (h.balance || 0),
//             0
//           );

//           // Format data
//           const formatted = data.holders.map((h) => {
//             const percentage =
//               totalSupply > 0
//                 ? ((h.balance / totalSupply) * 100).toFixed(2)
//                 : 0;
//             return {
//               address: h.address,
//               balance: parseFloat(h.balance).toFixed(4),
//               percentage: `${percentage}%`,
//             };
//           });

//           setHolderData(formatted);
//           setFilteredData(formatted);

//           // Update cards
//           setStatsData([
//             {
//               title: "Total Holders",
//               value: data.holders.length.toLocaleString(),
//             },
//             {
//               title: "Total RBM Supply",
//               value: `${totalSupply.toLocaleString()} RBM`,
//             },
//             { title: "Top Holders Shown", value: formatted.length },
//           ]);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching RBM holders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHolders();
//   }, []);

//   // 🔍 Search functionality
//   useEffect(() => {
//     const filtered = holderData.filter((h) =>
//       h.address.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredData(filtered);
//   }, [searchTerm, holderData]);

//   return (
//     <div className="min-h-screen w-full bg-white text-black shadow md:p-5">
//       {/* 🔍 Search Bar */}
//       <div className="p-4 border-b border-gray-200">
//         <input
//           type="text"
//           placeholder="Search by wallet address..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full p-2 bg-gray-50 text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* 🧾 Section Header */}
//       <div className="p-4 text-2xl font-bold text-gray-800">
//         RBM Token Holders
//       </div>

//       {/* 📊 Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//         {statsData.map((item, index) => (
//           <div
//             key={index}
//             className="bg-white border border-gray-300 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
//           >
//             <p className="text-gray-500 font-medium">{item.title}</p>
//             <p className="text-lg font-bold">{item.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* 🧠 Table Section */}
//       <div className="p-4">
//         {loading ? (
//           <div className="text-center text-lg font-semibold mt-10">
//             ⏳ Loading RBM Holders...
//           </div>
//         ) : (
//           <Table
//             columns={tableColumns}
//             data={filteredData}
//             rows={100}
//             paginator={true}
//             rowsPerPageOptions={[10, 25, 50, 100, 200]}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TopAccounts;

import React, { useEffect, useState } from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Table from "../components/Table";

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
    { field: "balance", header: "Balance (CBM)", minWidth: "150px" },
    { field: "percentage", header: "Percentage", minWidth: "150px" },
  ];

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/transactions/get-cbm-holders"
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.holders)) {
          const totalSupply =
            data.totalSupply ||
            data.holders.reduce((acc, h) => acc + (h.balance || 0), 0);

          // ✅ Format holder data
          const formatted = data.holders.map((h) => {
            const percentage =
              totalSupply > 0
                ? ((h.balance / totalSupply) * 100).toFixed(2)
                : "0.00";
            return {
              address: h.address,
              balance: parseFloat(h.balance).toFixed(4),
              percentage: `${percentage}%`,
            };
          });

          setHolderData(formatted);
          setFilteredData(formatted);

          // ✅ Update cards
          setStatsData([
            {
              title: "Total Holders",
              value: data.holders.length.toLocaleString(),
            },
            {
              title: "Total CBM Supply",
              value: `${totalSupply.toLocaleString()} CBM`,
            },
            { title: "Top Holders Shown", value: formatted.length },
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
