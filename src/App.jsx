import React, { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [retrievedMessage, setRetrievedMessage] = useState("");
  const contractAddress = "0x2ef1F2604136C78380a5418b287E1d877595306b";

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
  async function setUserMessage() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.setMessage(userInput);
        const receipt = tx.wait();
        console.log("  Transaction successful", receipt);
      } catch (error) {
        console.log("fail  transaction", error);
      }
    }
  }
  async function getUserMessage() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);

      const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const tx = await contract.getMessage();
        setRetrievedMessage(tx);
        console.log("  Transaction successful", tx);
      } catch (error) {
        console.log("fail  transaction", error);
      }
    }
  }

  return (
    <div>
      <input
        typeof="text"
        placeholder="set your message"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button onClick={setUserMessage}>set message</button>
      <button onClick={getUserMessage}>Get message</button>
      <p>
        <strong>Retrieved Message:</strong> {retrievedMessage}
      </p>
    </div>
  );
};

export default App;
// 0xD4Fc541236927E2EAf8F27606bD7309C1Fc2cbee