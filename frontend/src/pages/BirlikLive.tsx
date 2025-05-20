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
  
  const { data: status, isLoading: isStatusLoading, refetch: refetchStatus } = useQuery({
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('birlikLiveIntegration')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('connectToBirlikLive')}</h2>
          
          {status?.connected ? (
            <div className="p-4 bg-green-100 text-green-700 rounded-md mb-4">
              {t('connectedToBirlikLive')}
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">{t('username')}</label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">{t('password')}</label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={connectMutation.isPending}
              >
                {connectMutation.isPending ? t('connecting') : t('connectToBirlikLive')}
              </button>
            </form>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('birlikLiveFeatures')}</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>{t('crossBorderTransfers')}</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>{t('nftPassport')}</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>{t('multiCurrency')}</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>{t('blockchainVerification')}</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>{t('instantSettlement')}</span>
            </li>
          </ul>
        </div>
      </div>
      
      {status?.connected && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('birlikLiveServices')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-md hover:border-blue-500 cursor-pointer">
              <h3 className="font-medium">{t('maps')}</h3>
              <p className="text-sm text-gray-500">{t('mapsDescription')}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md hover:border-blue-500 cursor-pointer">
              <h3 className="font-medium">{t('marketplace')}</h3>
              <p className="text-sm text-gray-500">{t('marketplaceDescription')}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md hover:border-blue-500 cursor-pointer">
              <h3 className="font-medium">{t('socialNetwork')}</h3>
              <p className="text-sm text-gray-500">{t('socialNetworkDescription')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
