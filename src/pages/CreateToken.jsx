import { useState, useEffect } from "react";
import {
  Coins,
  Wallet,
  CheckCircle,
  Copy,
  Shield,
  Zap,
  X,
  ExternalLink,
  Sparkles,
  TrendingUp,
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask to continue!");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error("Wallet connect error:", err);
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
      newErrors.symbol = "Symbol should be less than 10 characters";
    if (form.decimals < 0 || form.decimals > 18)
      newErrors.decimals = "Decimals must be between 0 and 18";
    if (!form.supply || parseFloat(form.supply) <= 0)
      newErrors.supply = "Supply must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createToken = async () => {
    if (!validateForm()) return;
    if (!walletConnected) return alert("Connect your wallet first!");

    try {
      setLoading(true);
      await connectCBMNetwork();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const gasLimit = 6000000;
      const totalFee = ethers.parseEther("1.0");
      const gasPrice = totalFee / BigInt(gasLimit);

      const contractABI = [
        {
          inputs: [
            {
              internalType: "string",
              name: "_name",
              type: "string",
            },
            {
              internalType: "string",
              name: "_symbol",
              type: "string",
            },
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
        "0x60806040523480156200001157600080fd5b506040516200201a3803806200201a833981810160405281019062000037919062000686565b33838381600390816200004b919062000961565b5080600490816200005d919062000961565b505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000d55760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000cc919062000a8d565b60405180910390fd5b620000e6816200012c60201b60201c565b506200012333620000fc620001f260201b60201c565b600a6200010a919062000c3a565b8362000117919062000c8b565b620001fb60201b60201c565b50505062000d7c565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60006012905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620002705760006040517fec442f0500000000000000000000000000000000000000000000000000000000815260040162000267919062000a8d565b60405180910390fd5b62000284600083836200028860201b60201c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603620002de578060026000828254620002d1919062000cd6565b92505081905550620003b4565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050818110156200036d578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401620003649392919062000d22565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620003ff57806002600082825403925050819055506200044c565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620004ab919062000d5f565b60405180910390a3505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200052182620004d6565b810181811067ffffffffffffffff82111715620005435762000542620004e7565b5b80604052505050565b600062000558620004b8565b905062000566828262000516565b919050565b600067ffffffffffffffff821115620005895762000588620004e7565b5b6200059482620004d6565b9050602081019050919050565b60005b83811015620005c1578082015181840152602081019050620005a4565b60008484015250505050565b6000620005e4620005de846200056b565b6200054c565b905082815260208101848484011115620006035762000602620004d1565b5b62000610848285620005a1565b509392505050565b600082601f83011262000630576200062f620004cc565b5b815162000642848260208601620005cd565b91505092915050565b6000819050919050565b62000660816200064b565b81146200066c57600080fd5b50565b600081519050620006808162000655565b92915050565b600080600060608486031215620006a257620006a1620004c2565b5b600084015167ffffffffffffffff811115620006c357620006c2620004c7565b5b620006d18682870162000618565b935050602084015167ffffffffffffffff811115620006f557620006f4620004c7565b5b620007038682870162000618565b925050604062000716868287016200066f565b9150509250925092565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200077357607f821691505b6020821081036200078957620007886200072b565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620007f37fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620007b4565b620007ff8683620007b4565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620008426200083c62000836846200064b565b62000817565b6200064b565b9050919050565b6000819050919050565b6200085e8362000821565b620008766200086d8262000849565b848454620007c1565b825550505050565b600090565b6200088d6200087e565b6200089a81848462000853565b505050565b5b81811015620008c257620008b660008262000883565b600181019050620008a0565b5050565b601f8211156200091157620008db816200078f565b620008e684620007a4565b81016020851015620008f6578190505b6200090e6200090585620007a4565b8301826200089f565b50505b505050565b600082821c905092915050565b6000620009366000198460080262000916565b1980831691505092915050565b600062000951838362000923565b9150826002028217905092915050565b6200096c8262000720565b67ffffffffffffffff811115620009885762000987620004e7565b5b6200099482546200075a565b620009a1828285620008c6565b600060209050601f831160018114620009d95760008415620009c4578287015190505b620009d0858262000943565b86555062000a40565b601f198416620009e9866200078f565b60005b8281101562000a1357848901518255600182019150602085019450602081019050620009ec565b8683101562000a33578489015162000a2f601f89168262000923565b8355505b6001600288020188555050505b505050505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000a758262000a48565b9050919050565b62000a878162000a68565b82525050565b600060208201905062000aa4600083018462000a7c565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b600185111562000b385780860481111562000b105762000b0f62000aaa565b5b600185161562000b205780820291505b808102905062000b308562000ad9565b945062000af0565b94509492505050565b60008262000b53576001905062000c26565b8162000b63576000905062000c26565b816001811462000b7c576002811462000b875762000bbd565b600191505062000c26565b60ff84111562000b9c5762000b9b62000aaa565b5b8360020a91508482111562000bb65762000bb562000aaa565b5b5062000c26565b5060208310610133831016604e8410600b841016171562000bf75782820a90508381111562000bf15762000bf062000aaa565b5b62000c26565b62000c06848484600162000ae6565b9250905081840481111562000c205762000c1f62000aaa565b5b81810290505b9392505050565b600060ff82169050919050565b600062000c47826200064b565b915062000c548362000c2d565b925062000c837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff848462000b41565b905092915050565b600062000c98826200064b565b915062000ca5836200064b565b925082820262000cb5816200064b565b9150828204841483151762000ccf5762000cce62000aaa565b5b5092915050565b600062000ce3826200064b565b915062000cf0836200064b565b925082820190508082111562000d0b5762000d0a62000aaa565b5b92915050565b62000d1c816200064b565b82525050565b600060608201905062000d39600083018662000a7c565b62000d48602083018562000d11565b62000d57604083018462000d11565b949350505050565b600060208201905062000d76600083018462000d11565b92915050565b61128e8062000d8c6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c57806395d89b411161006657806395d89b4114610239578063a9059cbb14610257578063dd62ed3e14610287578063f2fde38b146102b7576100ea565b806370a08231146101e1578063715018a6146102115780638da5cb5b1461021b576100ea565b806323b872dd116100c857806323b872dd1461015b578063313ce5671461018b57806340c10f19146101a957806342966c68146101c5576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f76102d3565b6040516101049190610eb5565b60405180910390f35b61012760048036038101906101229190610f70565b610365565b6040516101349190610fcb565b60405180910390f35b610145610388565b6040516101529190610ff5565b60405180910390f35b61017560048036038101906101709190611010565b610392565b6040516101829190610fcb565b60405180910390f35b6101936103c1565b6040516101a0919061107f565b60405180910390f35b6101c360048036038101906101be9190610f70565b6103ca565b005b6101df60048036038101906101da919061109a565b6103e0565b005b6101fb60048036038101906101f691906110c7565b6103ed565b6040516102089190610ff5565b60405180910390f35b610219610435565b005b610223610449565b6040516102309190611103565b60405180910390f35b610241610473565b60405161024e9190610eb5565b60405180910390f35b610271600480360381019061026c9190610f70565b610505565b60405161027e9190610fcb565b60405180910390f35b6102a1600480360381019061029c919061111e565b610528565b6040516102ae9190610ff5565b60405180910390f35b6102d160048036038101906102cc91906110c7565b6105af565b005b6060600380546102e29061118d565b80601f016020809104026020016040519081016040528092919081815260200182805461030e9061118d565b801561035b5780601f106103305761010080835404028352916020019161035b565b820191906000526020600020905b81548152906001019060200180831161033e57829003601f168201915b5050505050905090565b600080610370610635565b905061037d81858561063d565b600191505092915050565b6000600254905090565b60008061039d610635565b90506103aa85828561064f565b6103b58585856106e4565b60019150509392505050565b60006012905090565b6103d26107d8565b6103dc828261085f565b5050565b6103ea33826108e1565b50565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b61043d6107d8565b6104476000610963565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546104829061118d565b80601f01602080910402602001604051908101604052809291908181526020018280546104ae9061118d565b80156104fb5780601f106104d0576101008083540402835291602001916104fb565b820191906000526020600020905b8154815290600101906020018083116104de57829003601f168201915b5050505050905090565b600080610510610635565b905061051d8185856106e4565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6105b76107d8565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036106295760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016106209190611103565b60405180910390fd5b61063281610963565b50565b600033905090565b61064a8383836001610a29565b505050565b600061065b8484610528565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156106de57818110156106ce578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016106c5939291906111be565b60405180910390fd5b6106dd84848484036000610a29565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107565760006040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161074d9190611103565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107c85760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016107bf9190611103565b60405180910390fd5b6107d3838383610c00565b505050565b6107e0610635565b73ffffffffffffffffffffffffffffffffffffffff166107fe610449565b73ffffffffffffffffffffffffffffffffffffffff161461085d57610821610635565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016108549190611103565b60405180910390fd5b565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108d15760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108c89190611103565b60405180910390fd5b6108dd60008383610c00565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036109535760006040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161094a9190611103565b60405180910390fd5b61095f82600083610c00565b5050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610a9b5760006040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610a929190611103565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b0d5760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610b049190611103565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015610bfa578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610bf19190610ff5565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610c52578060026000828254610c469190611224565b92505081905550610d25565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610cde578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610cd5939291906111be565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d6e5780600260008282540392505081905550610dbb565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e189190610ff5565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610e5f578082015181840152602081019050610e44565b60008484015250505050565b6000601f19601f8301169050919050565b6000610e8782610e25565b610e918185610e30565b9350610ea1818560208601610e41565b610eaa81610e6b565b840191505092915050565b60006020820190508181036000830152610ecf8184610e7c565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610f0782610edc565b9050919050565b610f1781610efc565b8114610f2257600080fd5b50565b600081359050610f3481610f0e565b92915050565b6000819050919050565b610f4d81610f3a565b8114610f5857600080fd5b50565b600081359050610f6a81610f44565b92915050565b60008060408385031215610f8757610f86610ed7565b5b6000610f9585828601610f25565b9250506020610fa685828601610f5b565b9150509250929050565b60008115159050919050565b610fc581610fb0565b82525050565b6000602082019050610fe06000830184610fbc565b92915050565b610fef81610f3a565b82525050565b600060208201905061100a6000830184610fe6565b92915050565b60008060006060848603121561102957611028610ed7565b5b600061103786828701610f25565b935050602061104886828701610f25565b925050604061105986828701610f5b565b9150509250925092565b600060ff82169050919050565b61107981611063565b82525050565b60006020820190506110946000830184611070565b92915050565b6000602082840312156110b0576110af610ed7565b5b60006110be84828501610f5b565b91505092915050565b6000602082840312156110dd576110dc610ed7565b5b60006110eb84828501610f25565b91505092915050565b6110fd81610efc565b82525050565b600060208201905061111860008301846110f4565b92915050565b6000806040838503121561113557611134610ed7565b5b600061114385828601610f25565b925050602061115485828601610f25565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806111a557607f821691505b6020821081036111b8576111b761115e565b5b50919050565b60006060820190506111d360008301866110f4565b6111e06020830185610fe6565b6111ed6040830184610fe6565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061122f82610f3a565b915061123a83610f3a565b9250828201905080821115611252576112516111f5565b5b9291505056fea26469706673582212207c93d78a0f7f98441bf789f043afcfe2f26dd219aa295e08d4db3cf9666e6f8664736f6c63430008140033";

      if (contractABI.length === 0 || contractBytecode === "0x") {
        alert("ABI & Bytecode missing — add them to deploy!");
        setLoading(false);
        return;
      }
      const factory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        signer,
      );
      const initialSupply = ethers.parseUnits(form.supply.toString(), 0);
      const contract = await factory.deploy(
        form.name,
        form.symbol,
        initialSupply,
        {
          gasLimit,
          gasPrice, // use old-style gasPrice instead of EIP-1559 fields
        },
      );

      await contract.waitForDeployment();

      const address = await contract.getAddress();
      const tx = contract.deploymentTransaction();

      console.log("✅ Token deployed:", address);
      console.log("Tx Hash:", tx.hash);

      await fetch("https:///api.cbmscan.com/api/token/token-create", {
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
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Deployment error:", error);
      alert(error?.reason || error?.message || "Error deploying token");
    } finally {
      setLoading(false);
    }
  };
  const connectCBMNetwork = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    try {
      // 🔹 First check if MetaMask is already on CBM chain
      const currentChainId = await ethereum.request({ method: "eth_chainId" });
      if (currentChainId !== "0x2C2") {
        // 🔹 Switch or Add CBM chain
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2C2", // 706 in hex
              chainName: "CBM Chain",
              nativeCurrency: {
                name: "CBM Coin",
                symbol: "CBM",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.cbmscan.com/"],
              blockExplorerUrls: ["https://cbmscan.com/"],
            },
          ],
        });
      }

      // 🔹 Request wallet connection
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Wallet connected:", accounts[0]);
      return accounts[0];
    } catch (err) {
      console.error("Network switch failed:", err);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 1500);
  };

  const truncate = (str) =>
    str ? `${str.slice(0, 6)}...${str.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="bg-blue-600 p-2 sm:p-3 rounded-xl">
              <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            CBM Token Creator
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Deploy your custom ERC-20 token on the blockchain in minutes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Features Section */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    Secure & Audited
                  </h3>
                  <p className="text-sm text-gray-600">
                    Battle-tested smart contracts with enterprise-grade security
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-gray-600">
                    Deploy your token in just a few clicks, no coding required
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    Full Ownership
                  </h3>
                  <p className="text-sm text-gray-600">
                    You maintain 100% control over your token and its supply
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <Award className="w-10 h-10 mb-3 opacity-90" />
              <h3 className="font-bold text-xl mb-2">Trusted Platform</h3>
              <p className="text-sm text-blue-50 leading-relaxed">
                Join thousands of successful token creators who trust our
                platform
              </p>
            </div>
          </div>

          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg overflow-hidden">
              {!walletConnected ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className="bg-blue-50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Connect Your Wallet
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
                    Connect your MetaMask wallet to start deploying your custom
                    token
                  </p>
                  <button
                    onClick={connectWallet}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Wallet className="w-5 h-5" />
                    Connect MetaMask
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                          Token Configuration
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                          Fill in your token details below
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white font-medium">
                        {truncate(walletAddress)}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Token Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g., My Awesome Token"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Token Symbol *
                      </label>
                      <input
                        type="text"
                        name="symbol"
                        value={form.symbol}
                        onChange={handleChange}
                        placeholder="e.g., MAT"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase text-sm sm:text-base"
                      />
                      {errors.symbol && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.symbol}
                        </p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Decimals *
                        </label>
                        <input
                          type="number"
                          name="decimals"
                          value={form.decimals}
                          onChange={handleChange}
                          placeholder="18"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                        />
                        {errors.decimals && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.decimals}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total Supply *
                        </label>
                        <input
                          type="number"
                          name="supply"
                          value={form.supply}
                          onChange={handleChange}
                          placeholder="1000000"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                        />
                        {errors.supply && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.supply}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">
                          Deployment Fee: 1 CBM
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          One-time fee to deploy your token to the blockchain
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={createToken}
                      disabled={loading}
                      className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transform hover:scale-[1.02]"
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Deploying Your Token...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Deploy Token Now
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Premium Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center relative">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                🎉 Token Deployed!
              </h3>
              <p className="text-green-50">
                Your token is now live on the blockchain
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Token Address
                  </span>
                  <button
                    onClick={() => copyToClipboard(tokenAddress, "address")}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    {copied.address ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 break-all font-mono bg-white p-2 rounded border border-gray-200">
                  {tokenAddress}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Transaction Hash
                  </span>
                  <button
                    onClick={() => copyToClipboard(txHash, "hash")}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    {copied.hash ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 break-all font-mono bg-white p-2 rounded border border-gray-200">
                  {txHash}
                </p>
              </div>

              {/* <a
                href={`https://cbmscan.com/search/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-6"
              >
                View on CbmScan
                <ExternalLink className="w-4 h-4" />
              </a> */}

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateToken;
