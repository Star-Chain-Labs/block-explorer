import React, { useEffect, useState } from "react";
import Table from "../components/Table";

const ValidatorsInfo = () => {
  const [validatorData, setValidatorData] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableColumns = [
    { field: "address", header: "Validator Address", minWidth: "400px" },
    { field: "signedBlocks", header: "Signed Blocks", minWidth: "150px" },
    { field: "chainId", header: "Chain ID", minWidth: "100px" },
    { field: "totalValidators", header: "Total Validators", minWidth: "150px" },
  ];

  // Fetch validator data from backend
  useEffect(() => {
    const fetchValidators = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/transactions/get-validators"
        );
        const data = await res.json();

        if (data.validators && Array.isArray(data.validators)) {
          const formattedData = data.validators.map((v) => ({
            address: v.address,
            signedBlocks: v.signedBlocks,
            chainId: data.chainId,
            totalValidators: data.totalValidators,
          }));
          setValidatorData(formattedData);
        } else {
          console.error("Invalid API response:", data);
        }
      } catch (error) {
        console.error("Error fetching validators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchValidators();
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-black shadow md:p-5">
      <h1 className="text-2xl font-bold mb-4">Validators Set Info</h1>

      {loading ? (
        <div className="text-center text-lg font-semibold mt-10">
          ⏳ Loading Validators...
        </div>
      ) : (
        <Table columns={tableColumns} data={validatorData} />
      )}
    </div>
  );
};

export default ValidatorsInfo;
