import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: 'available' | 'in_progress' | 'completed';
  progress?: number;
  deadline?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

interface MissionCardsProps {
  missions?: Mission[];
}

const MissionCards: React.FC<MissionCardsProps> = ({ missions = [] }) => {
  const { t } = useLanguage();

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (missions.length === 0) {
    return (
      <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
        <h3 className="text-lg font-semibold mb-2 text-kazakh-darkBlue">{t('missions')}</h3>
        <p className="text-sm text-gray-500">{t('noMissionsAvailable')}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
      <h3 className="text-lg font-semibold mb-3 text-kazakh-darkBlue">{t('missions')}</h3>
      
      <div className="space-y-4">
        {missions.map((mission) => (
          <div 
            key={mission.id}
            className="p-4 rounded-lg border border-kazakh-gold/20 bg-white/50"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-md font-semibold text-kazakh-darkBlue">{mission.title}</h4>
              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getDifficultyBadge(mission.difficulty)}`}>
                {t(mission.difficulty)}
              </span>
            </div>
            
            <p className="text-sm mt-2 text-gray-600">{mission.description}</p>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-kazakh-blue">
                  {t('xpReward')}: +{mission.xpReward} XP
                </span>
                {mission.deadline && (
                  <span className="text-xs text-gray-500">
                    {t('deadline')}: {new Date(mission.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <div>
                {mission.status === 'available' && (
                  <button className="px-3 py-1 text-xs bg-kazakh-blue text-white rounded-md hover:bg-kazakh-blue/80 transition-colors">
                    {t('startMission')}
                  </button>
                )}
                {mission.status === 'in_progress' && (
                  <div className="flex flex-col space-y-1">
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-kazakh-blue rounded-full" 
                        style={{ width: `${mission.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 text-right">{mission.progress || 0}%</span>
                  </div>
                )}
                {mission.status === 'completed' && (
                  <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md">
                    {t('completed')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionCards;
