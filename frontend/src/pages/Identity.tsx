import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserPassport } from "../services/api";

export default function Identity() {
  const { data: passport, isLoading } = useQuery({
    queryKey: ["passport"],
    queryFn: getUserPassport,
  });
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Digital Identity</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">NFT Passport</h2>
          
          {isLoading ? (
            <p>Loading passport information...</p>
          ) : passport ? (
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-blue-600">ID</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Passport Type</h3>
                <p className="text-lg font-medium">{passport.passport_type}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Token ID</h3>
                <p className="text-lg font-medium break-all">{passport.nft_token_id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">IPFS Hash</h3>
                <p className="text-lg font-medium break-all">{passport.ipfs_hash}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Issued Date</h3>
                <p className="text-lg font-medium">
                  {new Date(passport.issued_at).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                <p className="text-lg font-medium">
                  {passport.expires_at 
                    ? new Date(passport.expires_at).toLocaleDateString() 
                    : "Never"}
                </p>
              </div>
              
              <div className="pt-4">
                <a
                  href={`https://ipfs.io/ipfs/${passport.ipfs_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
                >
                  View on IPFS
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 mb-4">No NFT Passport found</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create NFT Passport
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Identity Features</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>NFT-based digital passport</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Biometric authentication</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Decentralized identity verification</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>IPFS storage for identity documents</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Cross-border identity recognition</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Selective disclosure of personal information</span>
            </li>
          </ul>
        </div>
      </div>
      
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create NFT Passport</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Passport Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="citizen">Citizen</option>
                <option value="government">Government</option>
                <option value="corporation">Corporation</option>
                <option value="international">International</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Nationality</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your nationality"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Document Upload</label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500">
                Upload your identification document (passport, ID card, etc.)
              </p>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Passport
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
