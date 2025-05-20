import { useEffect, useState } from "react";

import { getBalance, getWalletAddress } from "../services/web3";

export default function Wallet() {
  const [isWeb3Available, setIsWeb3Available] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const checkWeb3 = async () => {
      if (window.ethereum) {
        setIsWeb3Available(true);
        try {
          const address = await getWalletAddress();
          setWalletAddress(address);
          const bal = await getBalance();
          setBalance(bal);
        } catch (error) {
          console.error("Error connecting to wallet:", error);
        }
      }
    };

    checkWeb3();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Multi-Currency Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
          
          {isWeb3Available ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Wallet Address</h3>
                <p className="text-lg font-medium break-all">{walletAddress || "Not connected"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">ETH Balance</h3>
                <p className="text-2xl font-bold text-blue-600">{balance} ETH</p>
              </div>
              
              <button
                onClick={async () => {
                  try {
                    const address = await getWalletAddress();
                    setWalletAddress(address);
                    const bal = await getBalance();
                    setBalance(bal);
                  } catch (error) {
                    console.error("Error refreshing wallet:", error);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Refresh Balance
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 mb-4">No Web3 wallet detected</p>
              <p className="text-sm text-gray-500">
                Please install MetaMask or another Web3 wallet to use this feature
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Fiat &amp; CBDC Balances</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
              <div>
                <h3 className="font-medium">KZT (Tenge)</h3>
                <p className="text-sm text-gray-500">Fiat Currency</p>
              </div>
              <p className="text-xl font-bold">45,000</p>
            </div>
            
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
              <div>
                <h3 className="font-medium">CBDC_KZT</h3>
                <p className="text-sm text-gray-500">Digital Tenge</p>
              </div>
              <p className="text-xl font-bold">1,250</p>
            </div>
            
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
              <div>
                <h3 className="font-medium">RUB (Ruble)</h3>
                <p className="text-sm text-gray-500">Fiat Currency</p>
              </div>
              <p className="text-xl font-bold">12,500</p>
            </div>
            
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
              <div>
                <h3 className="font-medium">USD (Dollar)</h3>
                <p className="text-sm text-gray-500">Fiat Currency</p>
              </div>
              <p className="text-xl font-bold">250</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Wallet Features</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span>Multi-currency support (Fiat, CBDC, Crypto)</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span>Blockchain integration</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span>Instant currency conversion</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span>Secure storage with biometric authentication</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">✓</span>
            <span>Integration with NFT-passport for identity verification</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
