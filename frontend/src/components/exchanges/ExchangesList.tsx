import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExchanges } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const ExchangesList: React.FC = () => {
  const { t } = useLanguage();
  const { data: exchanges, isLoading, error } = useQuery({
    queryKey: ['exchanges'],
    queryFn: getExchanges,
  });

  if (isLoading) return <div className="p-4">{t('loading')}</div>;
  if (error) return <div className="p-4 text-red-500">Error loading exchanges</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{t('digitalFinanceExchange')}</h2>
      
      {exchanges && exchanges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exchanges.map((exchange: any) => (
            <div key={exchange.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold">{exchange.name}</h3>
              <div className="text-sm text-gray-500 mb-2">{exchange.code}</div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{t('exchangeType')}:</span> {t(exchange.type)}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{t('supportedCurrencies')}:</span> {exchange.supported_currencies.join(', ')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('noExchangesFound')}</p>
      )}
    </div>
  );
};

export default ExchangesList;
