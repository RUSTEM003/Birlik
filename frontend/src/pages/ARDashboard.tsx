import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ARFinancialDashboard from '../components/ar/ARFinancialDashboard';

export default function ARDashboardPage() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6 relative">
      {/* Background ornaments and emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-80 h-80 opacity-20 animate-ornament-pulse"></div>
      </div>
      
      {/* Page header with emblem */}
      <div className="relative flex items-center space-x-4">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-12 h-12 animate-ornament-pulse"></div>
        <h1 className="text-3xl font-bold text-kazakh-darkBlue">{t('arFinancialDashboard')}</h1>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 relative">
        <ARFinancialDashboard />
      </div>
    </div>
  );
}
