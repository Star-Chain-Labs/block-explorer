import React, { useState, useEffect } from "react";
import {
  Coins,
  Zap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Wallet,
  Shield,
  TrendingUp,
  Lock,
  Activity,
  Award,
} from "lucide-react";
import { ethers } from "ethers";

const CreateToken = () => {
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    decimals: 18,
    supply: "",
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState({ address: false, hash: false });

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Token name is required";
    if (!form.symbol.trim()) newErrors.symbol = "Token symbol is required";
    if (form.symbol.length > 10)
      newErrors.symbol = "Symbol should be <10 characters";
    if (!form.decimals || form.decimals < 0 || form.decimals > 18)
      newErrors.decimals = "Decimals must be between 0 and 18";
    if (!form.supply || parseFloat(form.supply) <= 0)
      newErrors.supply = "Supply must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createToken = async () => {
    if (!validateForm()) return;
    if (!walletConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // PASTE YOUR ABI HERE
      const contractABI = [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "initialSupply",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "allowance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "needed",
              type: "uint256",
            },
          ],
          name: "ERC20InsufficientAllowance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "needed",
              type: "uint256",
            },
          ],
          name: "ERC20InsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "approver",
              type: "address",
            },
          ],
          name: "ERC20InvalidApprover",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
          ],
          name: "ERC20InvalidReceiver",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "ERC20InvalidSender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "ERC20InvalidSpender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "burn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const contractBytecode =
        "0x60806040523480156200001157600080fd5b5060405162001ebb38038062001ebb833981810160405281019062000037919062000560565b336040518060400160405280600881526020017f43424d20436f696e0000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f43424d00000000000000000000000000000000000000000000000000000000008152508160039081620000b5919062000802565b508060049081620000c7919062000802565b505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036200013f5760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016200013691906200092e565b60405180910390fd5b62000150816200019460201b60201c565b506200018d33620001666200025a60201b60201c565b600a62000174919062000adb565b8362000181919062000b2c565b6200026360201b60201c565b5062000c1d565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60006012905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620002d85760006040517fec442f05000000000000000000000000000000000000000000000000000000008152600401620002cf91906200092e565b60405180910390fd5b620002ec60008383620002f060201b60201c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036200034657806002600082825462000339919062000b77565b925050819055506200041c565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015620003d5578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401620003cc9392919062000bc3565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620004675780600260008282540392505081905550620004b4565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405162000513919062000c00565b60405180910390a3505050565b600080fd5b6000819050919050565b6200053a8162000525565b81146200054657600080fd5b50565b6000815190506200055a816200052f565b92915050565b60006020828403121562000579576200057862000520565b5b6000620005898482850162000549565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200061457607f821691505b6020821081036200062a5762000629620005cc565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620006947fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000655565b620006a0868362000655565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620006e3620006dd620006d78462000525565b620006b8565b62000525565b9050919050565b6000819050919050565b620006ff83620006c2565b620007176200070e82620006ea565b84845462000662565b825550505050565b600090565b6200072e6200071f565b6200073b818484620006f4565b505050565b5b8181101562000763576200075760008262000724565b60018101905062000741565b5050565b601f821115620007b2576200077c8162000630565b620007878462000645565b8101602085101562000797578190505b620007af620007a68562000645565b83018262000740565b50505b505050565b600082821c905092915050565b6000620007d760001984600802620007b7565b1980831691505092915050565b6000620007f28383620007c4565b9150826002028217905092915050565b6200080d8262000592565b67ffffffffffffffff8111156200082957620008286200059d565b5b620008358254620005fb565b6200084282828562000767565b600060209050601f8311600181146200087a576000841562000865578287015190505b620008718582620007e4565b865550620008e1565b601f1984166200088a8662000630565b60005b82811015620008b4578489015182556001820191506020850194506020810190506200088d565b86831015620008d45784890151620008d0601f891682620007c4565b8355505b6001600288020188555050505b505050505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200091682620008e9565b9050919050565b620009288162000909565b82525050565b60006020820190506200094560008301846200091d565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b6001851115620009d957808604811115620009b157620009b06200094b565b5b6001851615620009c15780820291505b8081029050620009d1856200097a565b945062000991565b94509492505050565b600082620009f4576001905062000ac7565b8162000a04576000905062000ac7565b816001811462000a1d576002811462000a285762000a5e565b600191505062000ac7565b60ff84111562000a3d5762000a3c6200094b565b5b8360020a91508482111562000a575762000a566200094b565b5b5062000ac7565b5060208310610133831016604e8410600b841016171562000a985782820a90508381111562000a925762000a916200094b565b5b62000ac7565b62000aa7848484600162000987565b9250905081840481111562000ac15762000ac06200094b565b5b81810290505b9392505050565b600060ff82169050919050565b600062000ae88262000525565b915062000af58362000ace565b925062000b247fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484620009e2565b905092915050565b600062000b398262000525565b915062000b468362000525565b925082820262000b568162000525565b9150828204841483151762000b705762000b6f6200094b565b5b5092915050565b600062000b848262000525565b915062000b918362000525565b925082820190508082111562000bac5762000bab6200094b565b5b92915050565b62000bbd8162000525565b82525050565b600060608201905062000bda60008301866200091d565b62000be9602083018562000bb2565b62000bf8604083018462000bb2565b949350505050565b600060208201905062000c17600083018462000bb2565b92915050565b61128e8062000c2d6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c57806395d89b411161006657806395d89b4114610239578063a9059cbb14610257578063dd62ed3e14610287578063f2fde38b146102b7576100ea565b806370a08231146101e1578063715018a6146102115780638da5cb5b1461021b576100ea565b806323b872dd116100c857806323b872dd1461015b578063313ce5671461018b57806340c10f19146101a957806342966c68146101c5576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f76102d3565b6040516101049190610eb5565b60405180910390f35b61012760048036038101906101229190610f70565b610365565b6040516101349190610fcb565b60405180910390f35b610145610388565b6040516101529190610ff5565b60405180910390f35b61017560048036038101906101709190611010565b610392565b6040516101829190610fcb565b60405180910390f35b6101936103c1565b6040516101a0919061107f565b60405180910390f35b6101c360048036038101906101be9190610f70565b6103ca565b005b6101df60048036038101906101da919061109a565b6103e0565b005b6101fb60048036038101906101f691906110c7565b6103ed565b6040516102089190610ff5565b60405180910390f35b610219610435565b005b610223610449565b6040516102309190611103565b60405180910390f35b610241610473565b60405161024e9190610eb5565b60405180910390f35b610271600480360381019061026c9190610f70565b610505565b60405161027e9190610fcb565b60405180910390f35b6102a1600480360381019061029c919061111e565b610528565b6040516102ae9190610ff5565b60405180910390f35b6102d160048036038101906102cc91906110c7565b6105af565b005b6060600380546102e29061118d565b80601f016020809104026020016040519081016040528092919081815260200182805461030e9061118d565b801561035b5780601f106103305761010080835404028352916020019161035b565b820191906000526020600020905b81548152906001019060200180831161033e57829003601f168201915b5050505050905090565b600080610370610635565b905061037d81858561063d565b600191505092915050565b6000600254905090565b60008061039d610635565b90506103aa85828561064f565b6103b58585856106e4565b60019150509392505050565b60006012905090565b6103d26107d8565b6103dc828261085f565b5050565b6103ea33826108e1565b50565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b61043d6107d8565b6104476000610963565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546104829061118d565b80601f01602080910402602001604051908101604052809291908181526020018280546104ae9061118d565b80156104fb5780601f106104d0576101008083540402835291602001916104fb565b820191906000526020600020905b8154815290600101906020018083116104de57829003601f168201915b5050505050905090565b600080610510610635565b905061051d8185856106e4565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6105b76107d8565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036106295760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016106209190611103565b60405180910390fd5b61063281610963565b50565b600033905090565b61064a8383836001610a29565b505050565b600061065b8484610528565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156106de57818110156106ce578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016106c5939291906111be565b60405180910390fd5b6106dd84848484036000610a29565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107565760006040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161074d9190611103565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107c85760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016107bf9190611103565b60405180910390fd5b6107d3838383610c00565b505050565b6107e0610635565b73ffffffffffffffffffffffffffffffffffffffff166107fe610449565b73ffffffffffffffffffffffffffffffffffffffff161461085d57610821610635565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016108549190611103565b60405180910390fd5b565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108d15760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108c89190611103565b60405180910390fd5b6108dd60008383610c00565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036109535760006040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161094a9190611103565b60405180910390fd5b61095f82600083610c00565b5050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610a9b5760006040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610a929190611103565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b0d5760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610b049190611103565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015610bfa578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610bf19190610ff5565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610c52578060026000828254610c469190611224565b92505081905550610d25565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610cde578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610cd5939291906111be565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d6e5780600260008282540392505081905550610dbb565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e189190610ff5565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610e5f578082015181840152602081019050610e44565b60008484015250505050565b6000601f19601f8301169050919050565b6000610e8782610e25565b610e918185610e30565b9350610ea1818560208601610e41565b610eaa81610e6b565b840191505092915050565b60006020820190508181036000830152610ecf8184610e7c565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610f0782610edc565b9050919050565b610f1781610efc565b8114610f2257600080fd5b50565b600081359050610f3481610f0e565b92915050565b6000819050919050565b610f4d81610f3a565b8114610f5857600080fd5b50565b600081359050610f6a81610f44565b92915050565b60008060408385031215610f8757610f86610ed7565b5b6000610f9585828601610f25565b9250506020610fa685828601610f5b565b9150509250929050565b60008115159050919050565b610fc581610fb0565b82525050565b6000602082019050610fe06000830184610fbc565b92915050565b610fef81610f3a565b82525050565b600060208201905061100a6000830184610fe6565b92915050565b60008060006060848603121561102957611028610ed7565b5b600061103786828701610f25565b935050602061104886828701610f25565b925050604061105986828701610f5b565b9150509250925092565b600060ff82169050919050565b61107981611063565b82525050565b60006020820190506110946000830184611070565b92915050565b6000602082840312156110b0576110af610ed7565b5b60006110be84828501610f5b565b91505092915050565b6000602082840312156110dd576110dc610ed7565b5b60006110eb84828501610f25565b91505092915050565b6110fd81610efc565b82525050565b600060208201905061111860008301846110f4565b92915050565b6000806040838503121561113557611134610ed7565b5b600061114385828601610f25565b925050602061115485828601610f25565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806111a557607f821691505b6020821081036111b8576111b761115e565b5b50919050565b60006060820190506111d360008301866110f4565b6111e06020830185610fe6565b6111ed6040830184610fe6565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061122f82610f3a565b915061123a83610f3a565b9250828201905080821115611252576112516111f5565b5b9291505056fea26469706673582212207313cccc3c0463c7b0681703cf918d6bedde565a4e56ceb3b1c2cacdc151d24a64736f6c63430008140033"; // full, no “...”, 0x se start hone wala complete code paste karna bhai

      const factory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        signer
      );

      const initialSupply = ethers.parseUnits(form.supply.toString(), 0);
      const contract = await factory.deploy(initialSupply, {
        gasLimit: 6000000,
      });

      await contract.waitForDeployment();
      const address = await contract.getAddress();
      const tx = contract.deploymentTransaction();

      console.log("✅ Token deployed at:", address);

      // Save token details in backend
      await fetch("http://localhost:8080/api/token/token-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          symbol: form.symbol,
          supply: form.supply,
          tokenAddress: address,
          txHash: tx.hash,
          owner: walletAddress,
        }),
      });

      setTokenAddress(address);
      setTxHash(tx.hash);
    } catch (error) {
      console.error("🚨 Deployment error:", error);
      alert("Error deploying token. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const truncateAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Side - Features */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Why Choose Us?
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">
                      Secure & Audited
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Battle-tested smart contracts
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">
                      Lightning Fast
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Deploy in under 30 seconds
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">
                      Full Ownership
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      You control everything
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <Award className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-bold text-lg mb-2">ERC-20 Standard</h3>
              <p className="text-sm text-blue-100">
                Industry-standard token compatible with all major wallets and
                exchanges
              </p>
            </div> */}
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            {!walletConnected ? (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-8 sm:py-12 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                    <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
                    Connect Your Wallet
                  </h2>
                  <p className="text-blue-100 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
                    Connect your MetaMask wallet to start creating your custom
                    token on CBM Chain
                  </p>
                  <button
                    onClick={connectWallet}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Connect Wallet</span>
                  </button>
                </div>
                <div className="px-6 sm:px-8 py-6 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    <Activity className="w-4 h-4" />
                    <span>Powered by MetaMask</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Mobile Wallet Status */}
                <div className="sm:hidden bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600">
                        Connected
                      </p>
                      <p className="text-sm font-bold text-slate-900 font-mono">
                        {truncateAddress(walletAddress)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 sm:px-8 py-6 border-b border-slate-200">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                      Create Your Token
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600">
                      Fill in the details below to deploy your custom token
                    </p>
                  </div>

                  <div className="p-6 sm:p-8 space-y-5 sm:space-y-6">
                    {/* Token Name */}
                    <div>
                      <label className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900">
                          Token Name
                        </span>
                        <span className="text-xs text-slate-500">Required</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., My Awesome Token"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Token Symbol */}
                    <div>
                      <label className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900">
                          Token Symbol
                        </span>
                        <span className="text-xs text-slate-500">
                          Max 10 chars
                        </span>
                      </label>
                      <input
                        type="text"
                        name="symbol"
                        placeholder="e.g., MAT"
                        value={form.symbol}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase text-sm sm:text-base ${
                          errors.symbol
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      />
                      {errors.symbol && (
                        <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{errors.symbol}</span>
                        </p>
                      )}
                    </div>

                    {/* Grid for Decimals and Supply */}
                    <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                      {/* Decimals */}
                      <div>
                        <label className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-900">
                            Decimals
                          </span>
                          <span className="text-xs text-slate-500">0-18</span>
                        </label>
                        <input
                          type="number"
                          name="decimals"
                          placeholder="18"
                          value={form.decimals}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                            errors.decimals
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        />
                        {errors.decimals && (
                          <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errors.decimals}</span>
                          </p>
                        )}
                      </div>

                      {/* Total Supply */}
                      <div>
                        <label className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-900">
                            Total Supply
                          </span>
                          <span className="text-xs text-slate-500">
                            Initial amount
                          </span>
                        </label>
                        <input
                          type="number"
                          name="supply"
                          placeholder="1000000"
                          value={form.supply}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                            errors.supply
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        />
                        {errors.supply && (
                          <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errors.supply}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Deploy Button */}
                    <button
                      onClick={createToken}
                      disabled={loading}
                      className={`w-full py-4 sm:py-4.5 rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg flex items-center justify-center gap-3 ${
                        loading
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Deploying Token...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>Deploy Token Now</span>
                        </>
                      )}
                    </button>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs sm:text-sm text-slate-700">
                          <p className="font-semibold text-slate-900 mb-1">
                            Deployment Fee
                          </p>
                          <p>
                            Gas fees will be calculated based on current network
                            conditions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Card */}
                {tokenAddress && (
                  <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-300 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-500">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 sm:px-8 py-6 text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        Token Deployed Successfully!
                      </h3>
                      <p className="text-emerald-100 text-sm sm:text-base">
                        Your token has been deployed to the CBM blockchain
                      </p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-4">
                      {/* Token Address */}
                      <div className="bg-white rounded-xl p-4 sm:p-5 border border-emerald-200">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            Token Contract Address
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(tokenAddress, "address")
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            {copied.address ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 font-mono break-all bg-slate-50 p-3 rounded-lg border border-slate-200">
                          {tokenAddress}
                        </p>
                      </div>

                      {/* Transaction Hash */}
                      <div className="bg-white rounded-xl p-4 sm:p-5 border border-emerald-200">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            Transaction Hash
                          </p>
                          <button
                            onClick={() => copyToClipboard(txHash, "hash")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            {copied.hash ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 font-mono break-all bg-slate-50 p-3 rounded-lg border border-slate-200">
                          {txHash}
                        </p>
                      </div>

                      {/* View on Explorer Button */}
                      <a
                        href={`https://cbmscan.com/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                      >
                        <span>View on CBM Explorer</span>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateToken;
