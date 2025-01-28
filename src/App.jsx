import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "0x2ef1F2604136C78380a5418b287E1d877595306b";


function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
      } else {
        alert("Please install MetaMask to use this application.");
      }
    };
    initializeEthers();
  }, []);

  const getBalance = async () => {
    if (contract) {
      const _balance = await contract.getBalance();
      setBalance(ethers.formatEther(_balance));
    }
  };

  const deposit = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.deposit(ethers.parseEther(amount), {
          value: ethers.parseEther(amount),
        });
        await tx.wait();
        alert("Deposit successful!");
        getBalance();
      } catch (error) {
        console.error(error);
        alert("Deposit failed!");
      }
    }
  };

  const withdraw = async () => {
    if (contract && amount) {
      try {
        const tx = await contract.withdraw(ethers.parseEther(amount));
        await tx.wait();
        alert("Withdrawal successful!");
        getBalance();
      } catch (error) {
        console.error(error);
        if (error.code === "CALL_EXCEPTION") {
          alert("Insufficient balance for withdrawal.");
        } else {
          alert("Withdrawal failed!");
        }
      }
    }
  };

  return (
    <div className="App">
      <h1>Assessment DApp</h1>
      <div>
        <button onClick={getBalance}>Get Balance</button>
        <p>Contract Balance: {balance} ETH</p>
      </div>
      <div>
        <input
          type="number"
          placeholder="Enter amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={deposit}>Deposit</button>
        <button onClick={withdraw}>Withdraw</button>
      </div>
    </div>
  );
}

export default App;