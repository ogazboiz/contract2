import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const App = () => {
  const contractAddress = "0x2ef1F2604136C78380a5418b287E1d877595306b"; 
  const contractABI = abi; 

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // Get the balance from the contract
  const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const balance = await contract.getBalance();
        setBalance(balance.toString());
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Deposit funds into the contract
  const deposit = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.deposit(amount, { value: ethers.parseEther(amount) }); // Send the amount in ETH
        await tx.wait();
        setMessage(`Deposited ${amount} ETH successfully!`);
        getBalance(); // Update the balance
      } catch (error) {
        console.error("Error depositing funds:", error);
        setMessage("Transaction failed!");
      }
    }
  };

  // Withdraw funds from the contract
  const withdraw = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.withdraw(ethers.parseEther(amount)); // Withdraw the specified amount
        await tx.wait();
        setMessage(`Withdrew ${amount} ETH successfully!`);
        getBalance(); // Update the balance
      } catch (error) {
        console.error("Error withdrawing funds:", error);
        if (error.data && error.data.message.includes("InsufficientBalance")) {
          setMessage("Insufficient balance to withdraw!");
        } else {
          setMessage("Transaction failed!");
        }
      }
    }
  };

  // Fetch balance on page load
  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Assessment Contract</h1>
      <p><strong>Current Balance:</strong> {ethers.formatEther(balance)} ETH</p>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in ETH"
        style={{
          padding: "10px",
          margin: "10px 0",
          width: "200px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <div>
        <button
          onClick={deposit}
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Deposit
        </button>

        <button
          onClick={withdraw}
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: "#F44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Withdraw
        </button>
      </div>

      <p style={{ color: "blue" }}>{message}</p>
    </div>
  );
};

export default App;
