import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Blocks from "../pages/Blocks";
import TopAccounts from "../pages/TopAccounts";
import Contracts from "../pages/Contracts";
import ValidatorsLeaderboard from "../pages/ValidatorsLeaderboard";
import ValidatorsInfo from "../pages/ValidatorsInfo";
import Delegators from "../pages/Delegators";
import TopTokens from "../pages/TopTokens";
import CreateToken from "../pages/CreateToken";
import SignIn from "../components/SignIn";
import { MainLayout } from "../layout/Mainlayout";
import Transaction from "../pages/Transaction";
import SignUp from "../components/SignUp";
import ForgetPassword from "../components/ForgetPassword";
import TokenTransfer from "../pages/TokenTransfer";
import TransactionDetails from "../pages/TransactionDetails";
import AllTokens from "../pages/AllTokens";
import VerifyToken from "../pages/VerifyToken";

export default function RouterPage() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blockchain/transactions" element={<Transaction />} />
        <Route path="/blockchain/blocks" element={<Blocks />} />
        <Route path="/tokens/token-list" element={<AllTokens />} />
        <Route path="/blockchain/accounts" element={<TopAccounts />} />
        <Route path="/blockchain/contracts" element={<Contracts />} />
        <Route path="/tokens/verify" element={<VerifyToken />} />
        <Route
          path="/validators/leaderboard"
          element={<ValidatorsLeaderboard />}
        />
        <Route path="/validators/info" element={<ValidatorsInfo />} />
        <Route path="/validators/delegators" element={<Delegators />} />
        <Route path="/tokens/top" element={<TopTokens />} />
        <Route path="/tokens/transfers" element={<TokenTransfer />} />
        <Route path="/tokens/create" element={<CreateToken />} />
        <Route
          path="/blockchain/transaction-details"
          element={<TransactionDetails />}
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="*" element={<h1>404</h1>} />
      </Route>
    </Routes>
  );
}
