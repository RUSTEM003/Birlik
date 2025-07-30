import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { connectToBirlikLive, getBirlikLiveStatus } from "../services/integrations/birlikLive";

export default function BirlikLive() {
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ["birlikLiveStatus"],
    queryFn: getBirlikLiveStatus,
  });
  
  const connectMutation = useMutation({
    mutationFn: connectToBirlikLive,
    onSuccess: () => {
      refetchStatus();
    },
  });
  
  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    connectMutation.mutate(credentials);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="space-y-6 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-kazakh-pattern opacity-5 pointer-events-none"></div>
      
      {/* Page header with emblem */}
      <div className="relative flex items-center space-x-4 mb-6">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-12 h-12 animate-ornament-pulse"></div>
        <h1 className="text-3xl font-bold text-kazakh-darkBlue">{t('birlikLiveIntegration')}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/30 relative overflow-hidden">
          {/* Ornament background */}
          <div className="absolute top-0 right-0 bg-kazakh-ornament bg-contain bg-no-repeat w-24 h-24 opacity-10 rotate-45"></div>
          
          <h2 className="text-xl font-semibold mb-4 text-kazakh-darkBlue">{t('connectToBirlikLive')}</h2>
          
          {status?.connected ? (
            <div className="p-4 bg-gradient-to-r from-kazakh-blue/20 to-kazakh-gold/20 text-kazakh-darkBlue rounded-md mb-4 border border-kazakh-gold/30">
              <div className="flex items-center">
                <div className="bg-golden-horde bg-contain bg-no-repeat bg-center w-6 h-6 mr-2"></div>
                <span>{t('connectedToBirlikLive')}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-kazakh-darkBlue">{t('username')}</label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-kazakh-blue/30 rounded-md focus:ring-2 focus:ring-kazakh-gold/50 focus:border-kazakh-gold transition-colors"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-kazakh-darkBlue">{t('password')}</label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-kazakh-blue/30 rounded-md focus:ring-2 focus:ring-kazakh-gold/50 focus:border-kazakh-gold transition-colors"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-kazakh-blue to-kazakh-darkBlue text-white font-medium rounded-md hover:from-kazakh-darkBlue hover:to-kazakh-blue disabled:opacity-50 transition-all duration-300 border border-kazakh-gold/30"
                disabled={connectMutation.isPending}
              >
                {connectMutation.isPending ? t('connecting') : t('connectToBirlikLive')}
              </button>
            </form>
          )}
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/30 relative overflow-hidden">
          {/* Golden Horde background */}
          <div className="absolute top-0 left-0 bg-golden-horde bg-contain bg-no-repeat w-24 h-24 opacity-10"></div>
          
          <h2 className="text-xl font-semibold mb-4 text-kazakh-darkBlue">{t('birlikLiveFeatures')}</h2>
          <ul className="space-y-3 relative z-10">
            <li className="flex items-center">
              <span className="mr-2 text-kazakh-gold">•</span>
              <span className="text-kazakh-darkBlue">{t('crossBorderTransfers')}</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-kazakh-gold">•</span>
              <span className="text-kazakh-darkBlue">{t('nftPassport')}</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-kazakh-gold">•</span>
              <span className="text-kazakh-darkBlue">{t('multiCurrency')}</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-kazakh-gold">•</span>
              <span className="text-kazakh-darkBlue">{t('blockchainVerification')}</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-kazakh-gold">•</span>
              <span className="text-kazakh-darkBlue">{t('instantSettlement')}</span>
            </li>
          </ul>
        </div>
      </div>
      
      {status?.connected && (
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/30 relative overflow-hidden">
          {/* Ornament background */}
          <div className="absolute inset-0 bg-kazakh-pattern opacity-5"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-8 h-8 mr-2"></div>
              <h2 className="text-xl font-semibold text-kazakh-darkBlue">{t('birlikLiveServices')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-kazakh-blue/30 rounded-md hover:border-kazakh-gold transition-colors cursor-pointer bg-gradient-to-br from-white to-kazakh-light">
                <h3 className="font-medium text-kazakh-darkBlue">{t('maps')}</h3>
                <p className="text-sm text-kazakh-darkBlue/70">{t('mapsDescription')}</p>
              </div>
              <div className="p-4 border border-kazakh-blue/30 rounded-md hover:border-kazakh-gold transition-colors cursor-pointer bg-gradient-to-br from-white to-kazakh-light">
                <h3 className="font-medium text-kazakh-darkBlue">{t('marketplace')}</h3>
                <p className="text-sm text-kazakh-darkBlue/70">{t('marketplaceDescription')}</p>
              </div>
              <div className="p-4 border border-kazakh-blue/30 rounded-md hover:border-kazakh-gold transition-colors cursor-pointer bg-gradient-to-br from-white to-kazakh-light">
                <h3 className="font-medium text-kazakh-darkBlue">{t('socialNetwork')}</h3>
                <p className="text-sm text-kazakh-darkBlue/70">{t('socialNetworkDescription')}</p>
              </div>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="absolute bottom-0 right-0 bg-golden-horde bg-contain bg-no-repeat w-16 h-16 opacity-20 animate-ornament-pulse"></div>
        </div>
      )}
    </div>
  );
}
