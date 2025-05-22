import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import ARWrapper from './ARWrapper';

const ARFinancialDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [showAdvice, setShowAdvice] = React.useState(false);
  const [advice, setAdvice] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleGetAdvice = async () => {
    setShowAdvice(true);
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        setAdvice({
          advice: {
            ru: 'Рекомендуется диверсифицировать ваш портфель инвестиций.',
            kk: 'Инвестиция портфеліңізді әртараптандыру ұсынылады.'
          },
          user_id: 1,
          generated_at: new Date().toISOString()
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error getting advice:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <ARWrapper>
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
          {t('arFinancialDashboard')}
        </h2>
        
        <button 
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          onClick={() => {}}
        >
          {t('viewBalance')}
        </button>
        
        <button 
          className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-amber-600 transition-colors"
          onClick={handleGetAdvice}
        >
          {t('getAIAdvice')}
        </button>
        
        {showAdvice && (
          <div className="mt-4 w-full bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">{t('aiFinancialAdvice')}</h3>
            {isLoading ? (
              <p>{t('loading')}</p>
            ) : advice ? (
              <div>
                <p className="mb-2">{advice.advice.ru}</p>
                <p className="text-sm text-gray-600">{advice.advice.kk}</p>
              </div>
            ) : (
              <p>{t('adviceError')}</p>
            )}
          </div>
        )}
      </div>
    </ARWrapper>
  );
};

export default ARFinancialDashboard;
