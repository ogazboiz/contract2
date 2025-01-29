import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "./abi.json";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CONTRACT_ADDRESS = "0x0f764437ffBE1fcd0d0d276a164610422710B482";

export default function TaskDApp() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      return toast.error("Please install MetaMask");
    }
    const web3Signer = await provider.getSigner();
    setSigner(web3Signer);
    setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, web3Signer));
    toast.success("Wallet connected successfully");
  };

  const addTask = async () => {
    if (!contract) return toast.error("Connect your wallet first");
    try {
      const tx = await contract.addTask(taskText, taskTitle, false);
      await tx.wait();
      fetchTasks();
      toast.success("Task added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error adding task");
    }
  };

  const deleteTask = async (taskId) => {
    if (!contract) return toast.error("Connect your wallet first");
    try {
      const tx = await contract.deleteTask(taskId);
      await tx.wait();
      fetchTasks();
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting task");
    }
  };

  const fetchTasks = async () => {
    if (!contract) return;
    try {
      const myTasks = await contract.getMyTask();
      setTasks(myTasks);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching tasks");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Task Manager DApp</h1>
      {!signer ? (
        <button onClick={connectWallet} className="w-full bg-blue-500 text-white py-2 px-4 rounded">Connect Wallet</button>
      ) : (
        <div>
          <div className="mb-4">
            <input className="w-full p-2 border rounded mb-2" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
            <input className="w-full p-2 border rounded mb-2" placeholder="Task Description" value={taskText} onChange={(e) => setTaskText(e.target.value)} />
            <button onClick={addTask} className="w-full bg-green-500 text-white py-2 px-4 rounded">Add Task</button>
          </div>
          <button onClick={fetchTasks} className="w-full bg-gray-500 text-white py-2 px-4 rounded mb-4">Load My Tasks</button>
          <div>
            {tasks.map((task, index) => (
              <div key={index} className="p-4 border rounded mb-2">
                <h2 className="font-semibold">{task.taskTitle}</h2>
                <p>{task.taskText}</p>
                <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white py-1 px-3 rounded mt-2">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
