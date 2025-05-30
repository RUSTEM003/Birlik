import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface XPAction {
  id: string;
  type: string;
  description: string;
  xpAmount: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

interface ZKernelFeedProps {
  xp?: number;
  actions?: XPAction[];
}

const ZKernelFeed: React.FC<ZKernelFeedProps> = ({ 
  xp = 0, 
  actions = [] 
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredActions, setFilteredActions] = useState<XPAction[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    if (filter === 'all') {
      setFilteredActions(actions);
    } else {
      setFilteredActions(actions.filter(action => action.status === filter));
    }
  }, [actions, filter]);

  const displayActions = filteredActions.length > 0 ? filteredActions : [
    {
      id: 'action-1',
      type: 'transfer',
      description: t('zkernelTransferDesc'),
      xpAmount: 25,
      timestamp: new Date().toISOString(),
      status: 'completed'
    },
    {
      id: 'action-2',
      type: 'identity',
      description: t('zkernelIdentityDesc'),
      xpAmount: 50,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    },
    {
      id: 'action-3',
      type: 'governance',
      description: t('zkernelGovernanceDesc'),
      xpAmount: 100,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'pending'
    }
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return '💸';
      case 'identity':
        return '🪪';
      case 'governance':
        return '🏛️';
      case 'trade':
        return '📊';
      case 'mission':
        return '🎯';
      default:
        return '🔄';
    }
  };

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-kazakh-darkBlue">{t('zkernelFeed')}</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-kazakh-blue hover:text-kazakh-darkBlue"
        >
          {isExpanded ? t('collapse') : t('expand')}
        </button>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-kazakh-darkBlue">{t('zkernelStatus')}: {t('active')}</span>
        </div>
        <span className="text-sm font-medium text-kazakh-gold">{xp} XP</span>
      </div>
      
      <div className="flex space-x-2 mb-3">
        <button 
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs rounded-md ${
            filter === 'all' ? 'bg-kazakh-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('all')}
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 text-xs rounded-md ${
            filter === 'completed' ? 'bg-kazakh-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('completed')}
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 text-xs rounded-md ${
            filter === 'pending' ? 'bg-kazakh-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('pending')}
        </button>
      </div>
      
      <div className={`space-y-2 ${isExpanded ? '' : 'max-h-40 overflow-hidden'}`}>
        {displayActions.map((action) => (
          <div 
            key={action.id}
            className="p-2 rounded-md bg-white/50 border border-gray-100 flex items-start space-x-3"
          >
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full">
              <span role="img" aria-label={action.type}>
                {getActionIcon(action.type)}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-kazakh-darkBlue">{action.description}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  action.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  action.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {t(action.status)}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  {new Date(action.timestamp).toLocaleString()}
                </span>
                <span className="text-xs font-medium text-kazakh-gold">+{action.xpAmount} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!isExpanded && displayActions.length > 2 && (
        <div className="h-6 bg-gradient-to-t from-white to-transparent mt-[-24px] relative"></div>
      )}
    </div>
  );
};

export default ZKernelFeed;
