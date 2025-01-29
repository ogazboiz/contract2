import { useState, useEffect } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseEther } from "ethers";

function App() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [balance, setBalance] = useState("Loading...");
  const [WalletAddress, setWalletAddress] = useState("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const contractAddress = "0x2ef1F2604136C78380a5418b287E1d877595306b";

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function connectAddress() {
    if(typeof window.ethereum !== "undefined"){
      
      try{

        const account = await window.ethereum.request({ method: "eth_requestAccounts"})
        setWalletAddress(account[0])
        setIsWalletConnected(true)
      }
      catch (error) {
        toast.error("fail to connect")
      }

    }
  }

  async function getContractBalance() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance = await contract.getBalance();
        setBalance(ethers.formatEther(balance) + " ETH");
        toast.success("Balance: " + ethers.formatEther(balance));

      } catch (error) {
        toast.error("Failed to retrieve balance: ");
      }
    } else {
      toast.error("Ethereum wallet is not detected");
    }
  }

  async function depositFunds() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const parsedValue = depositAmount.toString();
        
        const tx = await contract.deposit(parsedValue);
        await tx.wait();
        toast.success("Deposit successful!");
        getContractBalance(); // Update balance after deposit
      } catch (error) {
        toast.error("Deposit failed try again later ");
      }
    } else {
      toast.error("Ethereum wallet is not detected");
    }
  }

  async function withdrawFunds() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const parsedValue = withdrawAmount.toString();
        const tx = await contract.withdraw(parsedValue);
        await tx.wait();
        toast.success("Withdrawal successful!");
        getContractBalance(); // Update balance after withdrawal
      } catch (error) {
        toast.error("Withdrawal failed: ");
      }
    } else {
      toast.error("Ethereum wallet is not detected");
    }
  }

  // Fetch contract balance on component load
  useEffect(() => {
    getContractBalance();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-indigo-700 flex flex-col justify-center items-center py-8 px-4">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Smart Contract Interaction</h1>

        <div className="mb-6">
  {!isWalletConnected ? (
    <button
      onClick={connectAddress}
      className="w-full mt-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
    >
      Connect Wallet
    </button>
  ) : (
    <p className="text-l font-semibold text-gray-700 mt-4">
      Connected as: {WalletAddress}
    </p>
  )}
</div>

        <div className="mb-6">
          <input
            type="number"
            placeholder="Enter deposit amount (NGN)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={depositFunds}
            className="w-full mt-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            Deposit
          </button>
        </div>

        {/* Withdraw Amount Section */}
      <div className="mb-6">
        <input
          type="number"
          placeholder="Enter withdrawal amount (NGN)"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={withdrawFunds}
          className="w-full mt-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
        >
          Withdraw
        </button>
      </div>

        <button
          onClick={getContractBalance}
          className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Refresh Balance
        </button>

        <p className="mt-4 text-xl font-semibold text-gray-700">Contract Balance: {balance}</p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;



