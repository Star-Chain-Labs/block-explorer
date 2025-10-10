import React from "react";
import Table from "../components/Table";

const ValidatorsLeaderboard = () => {
  // Validator leaderboard data
  const validatorData = [
    {
      rank: 1,
      address: "Validator: Legend",
      votingPower: "1.04,937 CBM",
      firstBlock: 3798133,
      lastBlock: 61235087,
      day1: 5120,
      day7: 34657,
      day30: 144137,
      active: "Yes",
    },
    {
      rank: 2,
      address: "Validator: TWSStaking",
      votingPower: "1.03,708 CBM",
      firstBlock: 3798135,
      lastBlock: 61235887,
      day1: 4920,
      day7: 34272,
      day30: 147644,
      active: "Yes",
    },
    {
      rank: 3,
      address: "Validator: fuji",
      votingPower: "1.35,700 CBM",
      firstBlock: 3798135,
      lastBlock: 61235919,
      day1: 5064,
      day7: 34488,
      day30: 145246,
      active: "Yes",
    },
    {
      rank: 4,
      address: "Validator: Figment",
      votingPower: "1.20,122 CBM",
      firstBlock: 3870010,
      lastBlock: 61235791,
      day1: 5232,
      day7: 34341,
      day30: 145505,
      active: "Yes",
    },
    {
      rank: 5,
      address: "Validator: NodeReal",
      votingPower: "1.34,645 CBM",
      firstBlock: 38297595,
      lastBlock: 61235743,
      day1: 4592,
      day7: 33464,
      day30: 144549,
      active: "Yes",
    },
  ];

  // Table columns for validators leaderboard
  const tableColumns = [
    { field: "rank", header: "Rank", minWidth: "80px" },
    { field: "address", header: "Address", minWidth: "200px" },
    { field: "votingPower", header: "Voting Power", minWidth: "150px" },
    { field: "firstBlock", header: "First Block", minWidth: "120px" },
    { field: "lastBlock", header: "Last Block", minWidth: "120px" },
    { field: "day1", header: "1 Day", minWidth: "100px" },
    { field: "day7", header: "7 Days", minWidth: "100px" },
    { field: "day30", header: "30 Days", minWidth: "100px" },
    { field: "active", header: "Active", minWidth: "100px" },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black shadow md:p-5">
      <h1 className="text-2xl font-bold mb-4">Validators Leaderboard</h1>
      <Table columns={tableColumns} data={validatorData} />
    </div>
  );
};

export default ValidatorsLeaderboard;