import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExchanges, getExchangeRates } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const ExchangeRatesList: React.FC = () => {
  const { t } = useLanguage();
  const [selectedExchangeId, setSelectedExchangeId] = useState<number | null>(null);
  
  const { data: exchanges, isLoading: exchangesLoading } = useQuery({
    queryKey: ['exchanges'],
    queryFn: getExchanges,
  });
  
  const { data: rates, isLoading: ratesLoading, error } = useQuery({
    queryKey: ['exchangeRates', selectedExchangeId],
    queryFn: () => selectedExchangeId ? getExchangeRates(selectedExchangeId) : null,
    enabled: !!selectedExchangeId,
  });

  if (exchangesLoading) return <div className="p-4">{t('loading')}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{t('exchangeRates')}</h2>
      
      <div className="mb-6">
        <label htmlFor="exchange-select" className="block text-sm font-medium text-gray-700 mb-2">
          {t('selectExchange')}
        </label>
        <select
          id="exchange-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          onChange={(e) => setSelectedExchangeId(Number(e.target.value))}
          value={selectedExchangeId || ''}
        >
          <option value="">{t('selectExchange')}</option>
          {exchanges && exchanges.map((exchange: any) => (
            <option key={exchange.id} value={exchange.id}>
              {exchange.name} ({exchange.code})
            </option>
          ))}
        </select>
      </div>
      
      {selectedExchangeId && (
        <div>
          {ratesLoading ? (
            <div className="p-4">{t('loading')}</div>
          ) : error ? (
            <div className="p-4 text-red-500">Error loading exchange rates</div>
          ) : rates && rates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('fromCurrency')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('toCurrency')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('rate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('timestamp')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rates.map((rate: any) => (
                    <tr key={rate.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rate.from_currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rate.to_currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rate.rate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(rate.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>{t('noExchangeRatesFound')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExchangeRatesList;
