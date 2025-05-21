import { useLanguage } from '../contexts/LanguageContext';
import RegionalCentersList from '../components/centers/RegionalCentersList';
import NationalCentersList from '../components/centers/NationalCentersList';
import ExchangesList from '../components/exchanges/ExchangesList';
import ExchangeRatesList from '../components/exchanges/ExchangeRatesList';
import GlobalCitizenIDCard from '../components/global/GlobalCitizenIDCard';

export default function GlobalEconomy() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-kazakh-pattern opacity-5 pointer-events-none"></div>
      
      {/* Page header with emblem */}
      <div className="relative flex items-center space-x-4 mb-6">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-12 h-12 animate-ornament-pulse"></div>
        <h1 className="text-3xl font-bold text-kazakh-darkBlue">{t('globalDigitalEconomy')}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="space-y-6">
          <GlobalCitizenIDCard />
          <RegionalCentersList />
        </div>
        <div className="space-y-6">
          <NationalCentersList />
          <ExchangesList />
        </div>
      </div>
      
      <div className="relative z-10">
        <ExchangeRatesList />
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 bg-golden-horde bg-contain bg-no-repeat w-16 h-16 opacity-20 animate-ornament-pulse"></div>
    </div>
  );
}
