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
      toast.success("Loaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error fetching tasks");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">OGAZBOIZ TASK MANAGER DAPP</h1>
        
        {!signer ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <div className="mb-6">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Task Description"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
              />
              <button
                onClick={addTask}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Add Task
              </button>
            </div>
            
            <button
              onClick={fetchTasks}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg mb-6 hover:bg-gray-700 transition duration-300"
            >
              Load My Tasks
            </button>

            <div>
              {tasks.map((task, index) => (
                <div key={index} className="bg-gray-50 p-5 mb-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                  <h2 className="font-semibold text-xl text-gray-800">{task.taskTitle}</h2>
                  <p className="text-gray-600">{task.taskText}</p>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="mt-3 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <ToastContainer />
      </div>
    </div>
  );
}
