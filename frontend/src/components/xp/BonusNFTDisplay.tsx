import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  xpBoost: number;
  isActive: boolean;
}

interface BonusNFTDisplayProps {
  xp?: number;
  nfts?: NFT[];
}

const BonusNFTDisplay: React.FC<BonusNFTDisplayProps> = ({ 
  xp = 0,
  nfts = []
}) => {
  const { t } = useLanguage();
  
  const displayNFTs = nfts.length > 0 ? nfts : [
    {
      id: 'nft-1',
      name: 'Kazakh Eagle',
      imageUrl: '/assets/nfts/eagle.png',
      rarity: 'uncommon' as const,
      xpBoost: 5,
      isActive: true
    },
    {
      id: 'nft-2',
      name: 'Golden Warrior',
      imageUrl: '/assets/nfts/warrior.png',
      rarity: 'rare' as const,
      xpBoost: 10,
      isActive: false
    }
  ];
  
  const availableNFTs = displayNFTs.filter(nft => {
    const requiredXP = nft.rarity === 'common' ? 100 :
                      nft.rarity === 'uncommon' ? 500 :
                      nft.rarity === 'rare' ? 1000 : 2000;
    return xp >= requiredXP;
  });
  
  if (availableNFTs.length === 0) {
    return (
      <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
        <h3 className="text-lg font-semibold mb-2 text-kazakh-darkBlue">{t('bonusNFTs')}</h3>
        <p className="text-sm text-gray-500">{t('noNFTsAvailable')}</p>
        <p className="text-xs text-kazakh-blue mt-1">{t('earnMoreXP')}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
      <h3 className="text-lg font-semibold mb-3 text-kazakh-darkBlue">{t('bonusNFTs')}</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {availableNFTs.map((nft) => (
          <div 
            key={nft.id}
            className={`relative p-2 rounded-lg border ${
              nft.rarity === 'legendary' ? 'border-kazakh-gold bg-kazakh-gold/10' :
              nft.rarity === 'rare' ? 'border-blue-300 bg-blue-50' :
              nft.rarity === 'uncommon' ? 'border-green-300 bg-green-50' :
              'border-gray-300 bg-gray-50'
            } ${nft.isActive ? 'ring-2 ring-kazakh-blue' : ''}`}
          >
            <div className="aspect-square rounded bg-white/50 mb-2 overflow-hidden">
              {nft.imageUrl ? (
                <div 
                  className="w-full h-full bg-contain bg-center bg-no-repeat" 
                  style={{ backgroundImage: `url(${nft.imageUrl})` }}
                ></div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-xs">NFT</span>
                </div>
              )}
            </div>
            
            <div className="text-xs font-medium text-kazakh-darkBlue truncate">{nft.name}</div>
            
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-kazakh-blue">+{nft.xpBoost}% XP</span>
              <button 
                className={`text-xs px-2 py-0.5 rounded ${
                  nft.isActive ? 'bg-kazakh-blue/20 text-kazakh-blue' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {nft.isActive ? t('active') : t('activate')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusNFTDisplay;
