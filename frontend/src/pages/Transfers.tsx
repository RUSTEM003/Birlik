
import { useQuery } from "@tanstack/react-query";
import { getUserTransfers } from "../services/api";
import TransferForm from "../components/transfers/TransferForm";

export default function Transfers() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transfers"],
    queryFn: getUserTransfers,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cross-Border Transfers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransferForm />
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Transfer Features</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="mr-2 text-green-500">•</span>
              <span>SWIFT-independent transfers</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">•</span>
              <span>Multi-currency support (Fiat, CBDC, Crypto)</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">•</span>
              <span>Instant settlement (3-5 seconds)</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">•</span>
              <span>Low fees (0.1-0.3%)</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">•</span>
              <span>Blockchain verification</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">•</span>
              <span>Cross-border support for CIS and Asia</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        {isLoading ? (
          <p>Loading transactions...</p>
        ) : transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blockchain TX
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx: any) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.recipient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.amount} {tx.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : tx.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.blockchain_tx_hash ? (
                        <a
                          href={`https://etherscan.io/tx/${tx.blockchain_tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
}
