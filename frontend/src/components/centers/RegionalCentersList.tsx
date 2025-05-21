import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRegionalCenters } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const RegionalCentersList: React.FC = () => {
  const { t } = useLanguage();
  const { data: centers, isLoading, error } = useQuery({
    queryKey: ['regionalCenters'],
    queryFn: getRegionalCenters,
  });

  if (isLoading) return <div className="p-4">{t('loading')}</div>;
  if (error) return <div className="p-4 text-red-500">Error loading regional centers</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{t('regionalCenters')}</h2>
      
      {centers && centers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {centers.map((center: any) => (
            <div key={center.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold">{center.name}</h3>
              <div className="text-sm text-gray-500 mb-2">{center.code}</div>
              {center.description && <p className="text-gray-700">{center.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>{t('noRegionalCentersFound')}</p>
      )}
    </div>
  );
};

export default RegionalCentersList;
