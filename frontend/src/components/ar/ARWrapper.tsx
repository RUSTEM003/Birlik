import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

type ARWrapperProps = {
  children: React.ReactNode;
};

/**
 * A wrapper component that conditionally renders AR content based on device capability.
 * For web, it shows a mock AR view.
 */
const ARWrapper: React.FC<ARWrapperProps> = ({ children }) => {
  const { t } = useLanguage();
  const [isARSupported, setIsARSupported] = React.useState(false);
  
  React.useEffect(() => {
    const checkARSupport = () => {
      const isNative = typeof navigator !== 'undefined' && 
                       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsARSupported(isNative);
    };
    
    checkARSupport();
  }, []);
  
  if (isARSupported) {
    return <>{children}</>;
  }
  
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{t('arNotSupported')}</h3>
      <p>{t('arWebMockMessage')}</p>
      <div className="mt-4 border-t border-blue-200 pt-4">
        <div className="bg-white p-4 rounded-lg shadow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ARWrapper;
