import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SmartProgressProps {
  xp?: number;
  nextLevelXP?: number;
  currentLevel?: number;
}

const SmartProgress: React.FC<SmartProgressProps> = ({ 
  xp = 0, 
  nextLevelXP = 100, 
  currentLevel = Math.floor(xp / 100) 
}) => {
  const { t } = useLanguage();
  
  const progressToNextLevel = (xp % 100) / 100 * 100;
  
  const getUserRank = (level: number) => {
    if (level < 5) return t('novice');
    if (level < 10) return t('apprentice');
    if (level < 20) return t('adept');
    if (level < 30) return t('expert');
    if (level < 50) return t('master');
    return t('grandMaster');
  };

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-kazakh-darkBlue">{t('smartProgress')}</h3>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-kazakh-blue">{t('level')}</span>
          <span className="text-lg font-bold text-kazakh-gold">{currentLevel}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{xp} XP</span>
          <span>{currentLevel * 100 + 100} XP</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-kazakh-blue to-kazakh-gold rounded-full"
            style={{ width: `${progressToNextLevel}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-kazakh-gold"></div>
          <span className="text-sm font-medium text-kazakh-darkBlue">{getUserRank(currentLevel)}</span>
        </div>
        <span className="text-xs text-gray-500">
          {Math.round(progressToNextLevel)}% {t('toNextLevel')}
        </span>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-xs">
          <div className="flex flex-col items-center">
            <span className="font-medium text-kazakh-darkBlue">{t('dailyXP')}</span>
            <span className="text-kazakh-gold">+25</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium text-kazakh-darkBlue">{t('weeklyXP')}</span>
            <span className="text-kazakh-gold">+120</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium text-kazakh-darkBlue">{t('monthlyXP')}</span>
            <span className="text-kazakh-gold">+450</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartProgress;
