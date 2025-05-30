import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Avatar3DProps {
  emotion?: 'neutral' | 'happy' | 'engaged' | 'thinking';
  lang?: string;
  insight?: string;
  xp?: number;
}

const Avatar3D: React.FC<Avatar3DProps> = ({ 
  emotion = 'neutral', 
  lang = 'ru', 
  insight = '', 
  xp = 0 
}) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loadingTimeout = setTimeout(() => {
        setIsLoaded(true);
      }, 1000);

      return () => clearTimeout(loadingTimeout);
    } catch (err) {
      setError(t('avatar3DLoadError'));
      console.error('Error loading 3D avatar:', err);
    }
  }, [emotion, lang, t]);

  useEffect(() => {
    if (isLoaded && canvasRef.current) {
      console.log(`Updating avatar with XP: ${xp}, Insight: ${insight}`);
    }
  }, [xp, insight, isLoaded]);

  return (
    <div className="relative w-full h-64 md:h-80 bg-gradient-to-b from-kazakh-blue/10 to-kazakh-gold/10 rounded-lg overflow-hidden">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : !isLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-kazakh-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <canvas 
            ref={canvasRef} 
            className="w-full h-full" 
            aria-label={t('avatar3D')}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                emotion === 'happy' ? 'bg-green-500' : 
                emotion === 'engaged' ? 'bg-kazakh-gold' : 
                emotion === 'thinking' ? 'bg-blue-500' : 
                'bg-gray-500'
              }`}></div>
              <p className="text-sm text-white font-medium">
                {t('xpLevel')}: {Math.floor(xp / 100)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Avatar3D;
