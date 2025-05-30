import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExchangeOption {
  id: string;
  name: string;
  description: string;
  xpCost: number;
  imageUrl?: string;
  category: 'digital' | 'physical' | 'service';
  availability: 'available' | 'limited' | 'soldout';
  remainingCount?: number;
}

interface XPExchangeProps {
  xp?: number;
  options?: ExchangeOption[];
}

const XPExchange: React.FC<XPExchangeProps> = ({ 
  xp = 0, 
  options = [] 
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ExchangeOption | null>(null);

  const displayOptions = options.length > 0 ? options : [
    {
      id: 'option-1',
      name: 'Birlik NFT Passport',
      description: t('xpExchangeNFTDesc'),
      xpCost: 500,
      imageUrl: '/assets/rewards/nft-passport.png',
      category: 'digital',
      availability: 'available'
    },
    {
      id: 'option-2',
      name: 'Premium Account (1 month)',
      description: t('xpExchangePremiumDesc'),
      xpCost: 1000,
      imageUrl: '/assets/rewards/premium.png',
      category: 'service',
      availability: 'available'
    },
    {
      id: 'option-3',
      name: 'Kazakh Traditional Souvenir',
      description: t('xpExchangeSouvenirDesc'),
      xpCost: 2000,
      imageUrl: '/assets/rewards/souvenir.png',
      category: 'physical',
      availability: 'limited',
      remainingCount: 5
    }
  ];

  const filteredOptions = selectedCategory === 'all' 
    ? displayOptions 
    : displayOptions.filter(option => option.category === selectedCategory);

  const handleExchange = (option: ExchangeOption) => {
    if (xp < option.xpCost || option.availability === 'soldout') {
      return;
    }
    
    setSelectedOption(option);
    setShowConfirmation(true);
  };

  const confirmExchange = () => {
    console.log(`Exchanged ${selectedOption?.xpCost} XP for ${selectedOption?.name}`);
    setShowConfirmation(false);
    setSelectedOption(null);
  };

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-kazakh-darkBlue">{t('xpExchange')}</h3>
        <span className="text-sm font-medium text-kazakh-gold">{xp} XP</span>
      </div>
      
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            selectedCategory === 'all' ? 'bg-kazakh-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('allCategories')}
        </button>
        <button 
          onClick={() => setSelectedCategory('digital')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            selectedCategory === 'digital' ? 'bg-kazakh-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('digitalRewards')}
        </button>
        <button 
          onClick={() => setSelectedCategory('physical')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            selectedCategory === 'physical' ? 'bg-kazakh-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('physicalRewards')}
        </button>
        <button 
          onClick={() => setSelectedCategory('service')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            selectedCategory === 'service' ? 'bg-kazakh-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('serviceRewards')}
        </button>
      </div>
      
      {filteredOptions.length === 0 ? (
        <p className="text-sm text-gray-500">{t('noRewardsAvailable')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredOptions.map((option) => (
            <div 
              key={option.id}
              className={`p-3 rounded-lg border ${
                option.availability === 'soldout' ? 'border-gray-300 bg-gray-100 opacity-60' : 
                option.availability === 'limited' ? 'border-yellow-300 bg-yellow-50' :
                'border-kazakh-gold/20 bg-white'
              }`}
            >
              <div className="flex space-x-3">
                {option.imageUrl ? (
                  <div className="w-16 h-16 flex-shrink-0 bg-contain bg-center bg-no-repeat rounded" style={{ backgroundImage: `url(${option.imageUrl})` }}></div>
                ) : (
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Image</span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-kazakh-darkBlue">{option.name}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{option.description}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-medium text-kazakh-gold">{option.xpCost} XP</span>
                    
                    {option.availability === 'limited' && option.remainingCount && (
                      <span className="text-xs text-yellow-600">
                        {t('remaining')}: {option.remainingCount}
                      </span>
                    )}
                    
                    {option.availability === 'soldout' ? (
                      <span className="text-xs text-gray-500">{t('soldOut')}</span>
                    ) : (
                      <button 
                        onClick={() => handleExchange(option)}
                        disabled={xp < option.xpCost}
                        className={`px-2 py-1 text-xs rounded ${
                          xp < option.xpCost 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-kazakh-blue text-white hover:bg-kazakh-blue/80'
                        }`}
                      >
                        {t('exchange')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showConfirmation && selectedOption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold text-kazakh-darkBlue mb-2">{t('confirmExchange')}</h4>
            <p className="text-sm text-gray-600 mb-4">
              {t('exchangeConfirmationText', { 
                xpCost: selectedOption.xpCost,
                rewardName: selectedOption.name
              })}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmation(false)}
                className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                {t('cancel')}
              </button>
              <button 
                onClick={confirmExchange}
                className="px-3 py-1.5 text-sm bg-kazakh-blue text-white rounded-md hover:bg-kazakh-blue/80"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default XPExchange;
