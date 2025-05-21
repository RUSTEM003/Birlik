
import { useQuery } from "@tanstack/react-query";
import { getUserTransfers } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

export default function Dashboard() {
  const { t } = useLanguage();
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transfers"],
    queryFn: getUserTransfers,
  });

  return (
    <div className="space-y-6 relative">
      {/* Background ornaments and emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-80 h-80 opacity-20 animate-ornament-pulse"></div>
      </div>
      <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
        <div className="bg-kazakh-ornament bg-contain bg-no-repeat bg-center w-full h-24 opacity-25 animate-ornament-pulse"></div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
        <div className="bg-kazakh-ornament bg-contain bg-no-repeat bg-center w-full h-24 opacity-25 animate-ornament-pulse"></div>
      </div>
      
      {/* Page header with emblem */}
      <div className="relative flex items-center space-x-4">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-12 h-12 animate-ornament-pulse"></div>
        <h1 className="text-3xl font-bold text-kazakh-darkBlue">{t('dashboard')}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h2 className="text-xl font-semibold mb-2 text-kazakh-darkBlue">{t('totalTransfers')}</h2>
          <p className="text-3xl font-bold text-kazakh-blue">
            {isLoading ? t('loading') : transactions?.length || 0}
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h2 className="text-xl font-semibold mb-2 text-kazakh-darkBlue">{t('cbdcBalance')}</h2>
          <p className="text-3xl font-bold text-kazakh-gold">1,250 CBDC_KZT</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h2 className="text-xl font-semibold mb-2 text-kazakh-darkBlue">{t('fiatBalance')}</h2>
          <p className="text-3xl font-bold text-kazakh-darkBlue">45,000 KZT</p>
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 relative">
        {/* Small ornament in the corner */}
        <div className="absolute top-2 right-2 bg-golden-horde bg-contain bg-no-repeat w-8 h-8 opacity-20"></div>
        
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
          <h2 className="text-xl font-semibold text-kazakh-darkBlue">{t('recentTransactions')}</h2>
        </div>
        
        {isLoading ? (
          <p className="text-kazakh-darkBlue">{t('loading')}</p>
        ) : transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-kazakh-gold/20">
              <thead className="bg-kazakh-blue/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    {t('date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    {t('recipient')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    {t('amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    {t('status')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-kazakh-gold/10">
                {transactions.slice(0, 5).map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-kazakh-blue/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-kazakh-darkBlue">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-kazakh-darkBlue">
                      {tx.recipient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-kazakh-blue">
                      {tx.amount} {tx.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          tx.status === "completed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : tx.status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-kazakh-darkBlue">{t('noTransactionsFound')}</p>
        )}
      </div>
    </div>
  );
}
