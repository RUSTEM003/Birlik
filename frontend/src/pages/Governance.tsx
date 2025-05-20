import { useState } from "react";

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: "active" | "passed" | "rejected";
  votesFor: number;
  votesAgainst: number;
  createdAt: string;
  endDate: string;
}

export default function Governance() {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      title: "Implement Cross-Border CBDC Integration",
      description: "Proposal to integrate with Central Bank Digital Currencies from Russia, China, and Uzbekistan for seamless cross-border transfers.",
      status: "active",
      votesFor: 1250,
      votesAgainst: 320,
      createdAt: "2025-05-10T10:00:00Z",
      endDate: "2025-05-25T10:00:00Z",
    },
    {
      id: 2,
      title: "Add Support for NFT-Based Identity Verification",
      description: "Enhance the identity verification system with NFT-based digital passports that can be used across the CIS region.",
      status: "passed",
      votesFor: 1820,
      votesAgainst: 150,
      createdAt: "2025-04-15T10:00:00Z",
      endDate: "2025-04-30T10:00:00Z",
    },
    {
      id: 3,
      title: "Reduce Transaction Fees for International Transfers",
      description: "Proposal to reduce the fees for international transfers from 0.3% to 0.1% to increase competitiveness.",
      status: "rejected",
      votesFor: 750,
      votesAgainst: 1200,
      createdAt: "2025-03-20T10:00:00Z",
      endDate: "2025-04-05T10:00:00Z",
    },
  ]);
  
  const [showNewProposalForm, setShowNewProposalForm] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  
  const handleVote = (proposalId: number, voteType: "for" | "against") => {
    setProposals(
      proposals.map((proposal) => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            votesFor: voteType === "for" ? proposal.votesFor + 1 : proposal.votesFor,
            votesAgainst: voteType === "against" ? proposal.votesAgainst + 1 : proposal.votesAgainst,
          };
        }
        return proposal;
      })
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">DAO Governance</h1>
        <button
          onClick={() => setShowNewProposalForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Proposal
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-semibold mb-4">Active Proposals</h2>
          
          <div className="space-y-4">
            {proposals
              .filter((p) => p.status === "active")
              .map((proposal) => (
                <div
                  key={proposal.id}
                  className="border border-gray-200 rounded-md p-4 hover:border-blue-300 cursor-pointer"
                  onClick={() => setSelectedProposal(proposal)}
                >
                  <h3 className="font-medium text-lg">{proposal.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {proposal.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      Votes: {proposal.votesFor} for / {proposal.votesAgainst} against
                    </span>
                    <span>
                      Ends: {new Date(proposal.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              
            <h2 className="text-xl font-semibold mb-4 mt-8">Past Proposals</h2>
            
            {proposals
              .filter((p) => p.status !== "active")
              .map((proposal) => (
                <div
                  key={proposal.id}
                  className="border border-gray-200 rounded-md p-4 hover:border-blue-300 cursor-pointer"
                  onClick={() => setSelectedProposal(proposal)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-lg">{proposal.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        proposal.status === "passed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {proposal.status === "passed" ? "Passed" : "Rejected"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {proposal.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      Final votes: {proposal.votesFor} for / {proposal.votesAgainst} against
                    </span>
                    <span>
                      Ended: {new Date(proposal.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Governance Features</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Decentralized decision making</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Transparent voting system</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Blockchain-based voting records</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Community-driven development</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Proposal creation by stakeholders</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Automatic execution of passed proposals</span>
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium mb-2">Your Voting Power</h3>
            <div className="flex justify-between items-center">
              <span>Voting tokens:</span>
              <span className="font-bold">250 BRLK</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Delegation:</span>
              <span className="font-bold">None</span>
            </div>
          </div>
        </div>
      </div>
      
      {selectedProposal && selectedProposal.status === "active" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{selectedProposal.title}</h2>
          <p className="mb-4">{selectedProposal.description}</p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>For: {selectedProposal.votesFor}</span>
              <span>Against: {selectedProposal.votesAgainst}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    (selectedProposal.votesFor /
                      (selectedProposal.votesFor + selectedProposal.votesAgainst)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => handleVote(selectedProposal.id, "for")}
              className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Vote For
            </button>
            <button
              onClick={() => handleVote(selectedProposal.id, "against")}
              className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Vote Against
            </button>
          </div>
        </div>
      )}
      
      {showNewProposalForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create New Proposal</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter proposal title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Describe your proposal in detail"
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Voting Period (days)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue={14}
                min={1}
                max={30}
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowNewProposalForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Proposal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
