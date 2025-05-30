import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface XPItem {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  quantity: number;
  icon?: string;
}

interface XPInventoryProps {
  inventory?: XPItem[];
}

const XPInventory: React.FC<XPInventoryProps> = ({ inventory = [] }) => {
  const { t } = useLanguage();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'uncommon':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'legendary':
        return 'bg-kazakh-gold/20 text-kazakh-gold border-kazakh-gold/30';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (inventory.length === 0) {
    return (
      <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
        <h3 className="text-lg font-semibold mb-2 text-kazakh-darkBlue">{t('xpInventory')}</h3>
        <p className="text-sm text-gray-500">{t('emptyInventory')}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
      <h3 className="text-lg font-semibold mb-2 text-kazakh-darkBlue">{t('xpInventory')}</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {inventory.map((item) => (
          <div 
            key={item.id}
            className={`p-3 rounded-md border ${getRarityColor(item.rarity)} flex items-start space-x-3`}
          >
            {item.icon ? (
              <div className="w-10 h-10 flex-shrink-0 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${item.icon})` }}></div>
            ) : (
              <div className="w-10 h-10 flex-shrink-0 bg-kazakh-emblem bg-contain bg-center bg-no-repeat opacity-20"></div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium truncate">{item.name}</h4>
                <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-white/50">×{item.quantity}</span>
              </div>
              <p className="text-xs mt-1 text-gray-600 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default XPInventory;
