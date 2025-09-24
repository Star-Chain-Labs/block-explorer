import React from "react";
import Table from "../components/Table";

const ValidatorsInfo = () => {
  // Validator set info data
  const validatorData = [
    {
      age: "56 secs ago",
      block: 61239691,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "181.64438091788901598 CBM",
    },
    {
      age: "1 min ago",
      block: 61239611,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "181.350125462933639007 CBM",
    },
    {
      age: "2 mins ago",
      block: 61239531,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "180.9059685473300304 CBM",
    },
    {
      age: "3 mins ago",
      block: 61239451,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "180.59970336350822124 CBM",
    },
    {
      age: "4 mins ago",
      block: 61239371,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "180.28630612811667807 CBM",
    },
    {
      age: "5 mins ago",
      block: 61239291,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "180.00659739067986821 CBM",
    },
    {
      age: "6 mins ago",
      block: 61239211,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "179.834618926109311257 CBM",
    },
    {
      age: "7 mins ago",
      block: 61239131,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "179.20041956879045386 CBM",
    },
    {
      age: "8 mins ago",
      block: 61239051,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "178.9604275062455832 CBM",
    },
    {
      age: "9 mins ago",
      block: 61238971,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "178.44043979431710803 CBM",
    },
    {
      age: "10 mins ago",
      block: 61238891,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "178.1252175904384277 CBM",
    },
    {
      age: "11 mins ago",
      block: 61238811,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "178.019792112250464526 CBM",
    },
    {
      age: "12 mins ago",
      block: 61238731,
      validators: "45",
      totalVotingPower: "25,885,862.5745553 CBM",
      totalJailed: "0",
      totalIncoming: "177.4289474654505767 CBM",
    },
  ];

  // Table columns for validators set info
  const tableColumns = [
    { field: "age", header: "Age", minWidth: "120px" },
    { field: "block", header: "Block", minWidth: "120px" },
    { field: "validators", header: "Validators", minWidth: "100px" },
    { field: "totalVotingPower", header: "Total Voting Power", minWidth: "200px" },
    { field: "totalJailed", header: "Total Jailed", minWidth: "120px" },
    { field: "totalIncoming", header: "Total Incoming", minWidth: "200px" },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-black shadow p-4">
      <h1 className="text-2xl font-bold mb-4">Validators Set Info</h1>
      <Table columns={tableColumns} data={validatorData} />
    </div>
  );
};

export default ValidatorsInfo;