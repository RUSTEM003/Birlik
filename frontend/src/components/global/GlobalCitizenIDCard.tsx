import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserPassport } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const GlobalCitizenIDCard: React.FC = () => {
  const { t } = useLanguage();
  const { data: passport, isLoading, error } = useQuery({
    queryKey: ['passport'],
    queryFn: getUserPassport,
  });

  if (isLoading) return <div className="p-4">{t('loading')}</div>;
  if (error) return <div className="p-4 text-red-500">Error loading global citizen ID</div>;
  if (!passport) return <div className="p-4">{t('noPassportFound')}</div>;

  const hasGlobalID = passport && passport.passport_metadata && passport.passport_metadata.global_citizen_id;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{t('globalCitizenID')}</h2>
      
      {hasGlobalID ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">{t('globalVerification')}</h3>
              <p className="text-sm text-gray-600">{passport.passport_metadata.global_status}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              passport.passport_metadata.global_status === 'verified' 
                ? 'bg-green-100 text-green-800' 
                : passport.passport_metadata.global_status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {t(passport.passport_metadata.global_status)}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">{t('regionalVerification')}</h3>
              <p className="text-sm text-gray-600">{passport.passport_metadata.regional_status}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              passport.passport_metadata.regional_status === 'verified' 
                ? 'bg-green-100 text-green-800' 
                : passport.passport_metadata.regional_status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {t(passport.passport_metadata.regional_status)}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">{t('nationalVerification')}</h3>
              <p className="text-sm text-gray-600">{passport.passport_metadata.national_status}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              passport.passport_metadata.national_status === 'verified' 
                ? 'bg-green-100 text-green-800' 
                : passport.passport_metadata.national_status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {t(passport.passport_metadata.national_status)}
            </div>
          </div>
          
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">{t('globalCitizenID')}</h3>
            <p className="font-mono text-sm break-all">{passport.passport_metadata.global_citizen_id}</p>
            <div className="mt-2 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                passport.blockchain_verified ? 'bg-green-500' : 'bg-gray-300'
              }`}></span>
              <span className="text-sm text-gray-600">
                {passport.blockchain_verified ? t('blockchainVerified') : t('notVerified')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border border-gray-200 rounded-lg">
          <p>{t('noGlobalCitizenID')}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('createGlobalCitizenID')}
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalCitizenIDCard;
