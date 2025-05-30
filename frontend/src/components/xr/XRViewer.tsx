import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const XRViewer: React.FC = () => {
  const { t } = useLanguage();
  const [isXRSupported, setIsXRSupported] = useState<boolean | null>(null);
  const [isXRSession, setIsXRSession] = useState(false);

  useEffect(() => {
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-ar')
        .then((supported: boolean) => {
          setIsXRSupported(supported);
        })
        .catch((error: Error) => {
          console.error('Error checking XR support:', error);
          setIsXRSupported(false);
        });
    } else {
      setIsXRSupported(false);
    }
  }, []);

  const startXRSession = async () => {
    if (!isXRSupported) return;
    
    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test']
      });
      
      setIsXRSession(true);
      
      session.addEventListener('end', () => {
        setIsXRSession(false);
      });
    } catch (error) {
      console.error('Error starting XR session:', error);
    }
  };

  if (isXRSupported === null) {
    return (
      <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-kazakh-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (isXRSession) {
    return (
      <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
        <div className="text-center">
          <p className="text-kazakh-darkBlue">{t('xrSessionActive')}</p>
          <button
            onClick={() => setIsXRSession(false)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {t('endXRSession')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
      <h3 className="text-lg font-semibold mb-2 text-kazakh-darkBlue">{t('xrViewer')}</h3>
      
      {isXRSupported ? (
        <div className="text-center">
          <p className="text-sm text-kazakh-darkBlue mb-3">{t('xrSupportedDesc')}</p>
          <button
            onClick={startXRSession}
            className="px-4 py-2 bg-kazakh-blue text-white rounded-md hover:bg-kazakh-blue/80 transition-colors"
          >
            {t('startXRSession')}
          </button>
        </div>
      ) : (
        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
          <p className="text-sm text-yellow-800">{t('xrNotSupported')}</p>
          <p className="text-xs text-yellow-600 mt-1">{t('xrBrowserSuggestion')}</p>
        </div>
      )}
    </div>
  );
};

export default XRViewer;
