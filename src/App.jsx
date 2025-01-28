import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

function App() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [balance, setBalance] = useState("");
  const contractAddress = "0x2ef1F2604136C78380a5418b287E1d877595306b";

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function depositFunds() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const tx = await contract.deposit(depositAmount);
        await tx.wait();
        toast.success("Deposit successful!"); // Show success toast
      } catch (error) {
        toast.error("Deposit failed: " + error.message); // Show error toast
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
        const tx = await contract.withdraw(withdrawAmount);
        await tx.wait();
        toast.success("Withdrawal successful!"); // Show success toast
      } catch (error) {
        toast.error("Withdrawal failed: " + error.message); // Show error toast
      }
    } else {
      toast.error("Ethereum wallet is not detected");
    }
  }

  async function getContractBalance() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const balance = await contract.getBalance();
        setBalance(ethers.formatEther(balance));
        toast.success("Balance retrieved: " + ethers.formatEther(balance) + " ETH");
      } catch (error) {
        toast.error("Failed to retrieve balance: " + error.message);
      }
    } else {
      toast.error("Ethereum wallet is not detected");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Smart Contract Interaction
          </h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter deposit amount (ETH)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={depositFunds}
              className="w-full mt-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Deposit
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter withdrawal amount (ETH)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={withdrawFunds}
              className="w-full mt-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Withdraw
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={getContractBalance}
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
            >
              Get Balance
            </button>
            <p className="mt-4 text-lg font-medium text-gray-700">
              Contract Balance: {balance} ETH
            </p>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Container for the toasts */}
    </>
  );
}

export default App;
