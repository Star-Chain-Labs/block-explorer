import { FaHome, FaCubes, FaUsers, FaCoins, FaLock, FaFileAlt, FaList, FaDatabase } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";

export const routes = [
  { name: "Home", path: "/", icon: FaHome },
  {
    name: "Blockchain",
    path: "/blockchain",
    icon: FaCubes,
    dropdown: [
      { name: "Transactions", path: "/blockchain/transactions", icon: FaDatabase },
      { name: "Blocks", path: "/blockchain/blocks", icon: FaFileAlt },
      { name: "Top Accounts", path: "/blockchain/accounts", icon: FaUsers },
      { name: "Verified Contracts", path: "/blockchain/contracts", icon: FaLock },
    ],
  },
  {
    name: "Validators",
    path: "/validators",
    icon: FaUsers,
    dropdown: [
      { name: "Leaderboard", path: "/validators/leaderboard", icon: FaList },
      { name: "Set Info", path: "/validators/info", icon: FaFileAlt },
      { name: "Delegators", path: "/validators/delegators", icon: FaUsers },
    ],
  },
  {
    name: "Tokens",
    path: "/tokens",
    icon: FaCoins,
    dropdown: [
      { name: "Top Tokens", path: "/tokens/top", icon: FaCoins },
      { name: "Transfers", path: "/tokens/transfers", icon: FaDatabase },
      { name: "Create Token", path: "/tokens/create", icon: FaFileAlt },
    ],
  },
];