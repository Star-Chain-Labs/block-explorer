import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Blocks from "../pages/Blocks";
import TopAccounts from "../pages/TopAccounts";
import Contracts from "../pages/Contracts";
import ValidatorsLeaderboard from "../pages/ValidatorsLeaderboard";
import ValidatorsInfo from "../pages/ValidatorsInfo";
import Delegators from "../pages/Delegators";
import TopTokens from "../pages/TopTokens";
import Transfers from "../pages/Transfers";
import CreateToken from "../pages/CreateToken";
import SignIn from "../components/SignIn";
import { MainLayout } from "../layout/Mainlayout";
import Transaction from "../pages/Transaction";

export default function RouterPage() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blockchain/transactions" element={<Transaction />} />
        <Route path="/blockchain/blocks" element={<Blocks />} />
        <Route path="/blockchain/accounts" element={<TopAccounts />} />
        <Route path="/blockchain/contracts" element={<Contracts />} />
        <Route path="/validators/leaderboard" element={<ValidatorsLeaderboard />} />
        <Route path="/validators/info" element={<ValidatorsInfo />} />
        <Route path="/validators/delegators" element={<Delegators />} />
        <Route path="/tokens/top" element={<TopTokens />} />
        <Route path="/tokens/transfers" element={<Transfers />} />
        <Route path="/tokens/create" element={<CreateToken />} />
        <Route path="/signin" element={<SignIn />} />
      </Route>
    </Routes>
  );
}