import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AIAgentProps {
  locale?: string;
  insight?: string;
}

const AIAgent: React.FC<AIAgentProps> = ({ locale = 'ru', insight = '' }) => {
  const { t } = useLanguage();
  const [isTyping, setIsTyping] = useState(false);
  const [displayedInsight, setDisplayedInsight] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!insight) return;
    
    setIsTyping(true);
    setDisplayedInsight('');
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < insight.length) {
        setDisplayedInsight(prev => prev + insight[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30);
    
    return () => clearInterval(typingInterval);
  }, [insight]);

  return (
    <div className={`p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20 transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-48 overflow-hidden'}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <h3 className="text-lg font-semibold text-kazakh-darkBlue">{t('aiAgent')}</h3>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-kazakh-blue hover:text-kazakh-darkBlue"
        >
          {isExpanded ? t('collapse') : t('expand')}
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 mb-3 min-h-[80px]">
        <p className="text-sm text-gray-700">
          {displayedInsight}
          {isTyping && <span className="inline-block w-2 h-4 bg-kazakh-darkBlue animate-blink"></span>}
        </p>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 px-3 py-1.5 text-xs bg-kazakh-blue text-white rounded-md hover:bg-kazakh-blue/80 transition-colors">
          {t('askQuestion')}
        </button>
        <button className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
          {t('refresh')}
        </button>
        <button className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
          {locale === 'ru' ? 'EN' : locale === 'en' ? 'KK' : 'RU'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-kazakh-darkBlue mb-2">{t('recentInsights')}</h4>
          <ul className="space-y-2">
            <li className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
              {t('aiInsightExample1')}
            </li>
            <li className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
              {t('aiInsightExample2')}
            </li>
            <li className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
              {t('aiInsightExample3')}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIAgent;
