import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MusicLicensingContract from "../../MusicLicensingContract.json";
import AppForm from "./AppForm";


const contractAddress = "0x0F8f0C4B2e66f3C2b682CA1BCdF35d9d0f324729";
const contractABI = MusicLicensingContract.abi;

function Solidity() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactionResult, setTransactionResult] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          await window.ethereum.enable();
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing web3", error);
        }
      } else {
        console.error("Please install MetaMask to use this application");
      }
    };

    initWeb3();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      if (!web3 || !account) {
        console.error("MetaMask not connected");
        return;
      }

      const licenseFeeInEther = formData.licenseFee;
      const licenseFeeInWei = web3.utils.toWei(
        licenseFeeInEther.toString(),
        "ether"
      );

      await contract.methods.payLicenseFee().send({
        from: account,
        value: licenseFeeInWei,
        gas: 300000,
      });

      setTransactionResult("Transaction successful");
    } catch (error) {
      console.error("Error submitting form:", error);
      setTransactionResult("Transaction successful");
    }
  };
  return (
    <div className="mx-5 min-h-screen flex flex-wrap text-center flex-col justify-center items-center">
      <h1 className="text-3xl md:text-[100px] font-bold flex justify-center items-center"> <span><img src="./images/MUSICHAIN.png" alt="" width={100}/></span> Dark Side</h1>
      <p className="text-md mb-4">Connected Account: {account}</p>
      {transactionResult && (
        <div className="text-xl md:text-2xl">
          <span className="font-bold">{transactionResult}</span>
        </div>
      )}
      <AppForm onSubmit={handleFormSubmit} />
    </div>
  );
}

export default Solidity;