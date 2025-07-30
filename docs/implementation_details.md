# Технические детали реализации GlobalDigitalEconomy в Цифровой Банк

## Обзор реализации | Іске асыру шолуы

Данный документ описывает технические детали реализации архитектуры GlobalDigitalEconomy в Цифровой Банк, включая структуру кода, используемые технологии и интеграционные решения.

Бұл құжат Цифровой Банк-тегі GlobalDigitalEconomy архитектурасын іске асырудың техникалық мәліметтерін, соның ішінде код құрылымын, қолданылатын технологияларды және интеграциялық шешімдерді сипаттайды.

## Структура бэкенда (FastAPI) | Бэкенд құрылымы (FastAPI)

### Модули центров | Орталықтар модульдері

```python
# app/modules/centers/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class RegionalCenter(Base):
    __tablename__ = "regional_centers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    national_centers = relationship("NationalCenter", back_populates="regional_center")

class NationalCenter(Base):
    __tablename__ = "national_centers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    currency_code = Column(String, nullable=False)
    language_codes = Column(JSON, nullable=False)  # Array of language codes
    regional_center_id = Column(Integer, ForeignKey("regional_centers.id"))
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    regional_center = relationship("RegionalCenter", back_populates="national_centers")
    users = relationship("User", back_populates="national_center")
```

### Модули идентификации | Сәйкестендіру модульдері

```python
# app/modules/identity/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    global_citizen_id = Column(String, unique=True, nullable=True)
    national_center_id = Column(Integer, ForeignKey("national_centers.id"), nullable=True)
    preferred_language = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    national_center = relationship("NationalCenter", back_populates="users")
    nft_passports = relationship("NFTPassport", back_populates="owner")

class NFTPassport(Base):
    __tablename__ = "nft_passports"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    passport_type = Column(String)  # citizen, government, corporation, international
    nft_token_id = Column(String)
    passport_metadata = Column(JSON)
    ipfs_hash = Column(String, nullable=True)
    blockchain_verified = Column(Boolean, default=False)
    global_status = Column(String, default="pending")  # pending, verified, rejected
    regional_status = Column(String, default="pending")  # pending, verified, rejected
    national_status = Column(String, default="pending")  # pending, verified, rejected
    is_active = Column(Boolean, default=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    
    owner = relationship("User", back_populates="nft_passports")
```

### Модули обменов | Айырбастау модульдері

```python
# app/modules/exchanges/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, JSON, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Exchange(Base):
    __tablename__ = "exchanges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    type = Column(String, nullable=False)  # fiat, crypto, hybrid
    description = Column(Text, nullable=True)
    supported_currencies = Column(JSON, nullable=False)  # Array of currency codes
    metadata = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    exchange_rates = relationship("ExchangeRate", back_populates="exchange")

class ExchangeRate(Base):
    __tablename__ = "exchange_rates"
    
    id = Column(Integer, primary_key=True, index=True)
    exchange_id = Column(Integer, ForeignKey("exchanges.id"))
    from_currency = Column(String, nullable=False)
    to_currency = Column(String, nullable=False)
    rate = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    source = Column(String, nullable=True)  # Source of the rate (oracle, manual, etc.)
    
    exchange = relationship("Exchange", back_populates="exchange_rates")
```

## Структура фронтенда (React) | Фронтенд құрылымы (React)

### Компоненты центров | Орталықтар компоненттері

```tsx
// src/components/centers/RegionalCentersList.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRegionalCenters } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const RegionalCentersList: React.FC = () => {
  const { t } = useLanguage();
  const { data: centers, isLoading, error } = useQuery({
    queryKey: ['regionalCenters'],
    queryFn: getRegionalCenters,
  });

  if (isLoading) return <div className="p-4">{t('loading')}</div>;
  if (error) return <div className="p-4 text-red-500">{t('errorLoadingRegionalCenters')}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{t('regionalCenters')}</h2>
      
      {centers && centers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {centers.map((center: any) => (
            <div key={center.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold">{center.name}</h3>
              <div className="text-sm text-gray-500 mb-2">{center.code}</div>
              {center.description && <p className="text-gray-700">{center.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>{t('noRegionalCentersFound')}</p>
      )}
    </div>
  );
};

export default RegionalCentersList;
```

```tsx
// src/components/centers/NationalCentersList.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNationalCenters } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const NationalCentersList: React.FC = () => {
  const { t } = useLanguage();
  const { data: centers, isLoading, error } = useQuery({
    queryKey: ['nationalCenters'],
    queryFn: getNationalCenters,
  });

  if (isLoading) return <div className="p-4">{t('loading')}</div>;
  if (error) return <div className="p-4 text-red-500">{t('errorLoadingNationalCenters')}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{t('nationalCenters')}</h2>
      
      {centers && centers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {centers.map((center: any) => (
            <div key={center.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold">{center.name}</h3>
              <div className="text-sm text-gray-500 mb-2">{center.code}</div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{t('currency')}:</span> {center.currency_code}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{t('languages')}:</span> {center.language_codes.join(', ')}
              </div>
              {center.description && <p className="text-gray-700">{center.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>{t('noNationalCentersFound')}</p>
      )}
    </div>
  );
};

export default NationalCentersList;
```

### Компоненты идентификации | Сәйкестендіру компоненттері

```tsx
// src/components/global/GlobalCitizenIDCard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserPassport } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const GlobalCitizenIDCard: React.FC = () => {
  const { t } = useLanguage();
  const { data: passport, isLoading, error } = useQuery({
    queryKey: ['passport'],
    queryFn: getUserPassport,
  });

  if (isLoading) return <div className="p-4">{t('loading')}</div>;
  if (error) return <div className="p-4 text-red-500">Error loading global citizen ID</div>;
  if (!passport) return <div className="p-4">{t('noPassportFound')}</div>;

  const hasGlobalID = passport && passport.passport_metadata && passport.passport_metadata.global_citizen_id;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{t('globalCitizenID')}</h2>
      
      {hasGlobalID ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">{t('globalVerification')}</h3>
              <p className="text-sm text-gray-600">{passport.passport_metadata.global_status}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              passport.passport_metadata.global_status === 'verified' 
                ? 'bg-green-100 text-green-800' 
                : passport.passport_metadata.global_status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {t(passport.passport_metadata.global_status)}
            </div>
          </div>
          
          {/* Additional verification levels */}
          
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">{t('globalCitizenID')}</h3>
            <p className="font-mono text-sm break-all">{passport.passport_metadata.global_citizen_id}</p>
            <div className="mt-2 flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                passport.blockchain_verified ? 'bg-green-500' : 'bg-gray-300'
              }`}></span>
              <span className="text-sm text-gray-600">
                {passport.blockchain_verified ? t('blockchainVerified') : t('notVerified')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border border-gray-200 rounded-lg">
          <p>{t('noGlobalCitizenID')}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('createGlobalCitizenID')}
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalCitizenIDCard;
```

### Компоненты обменов | Айырбастау компоненттері

```tsx
// src/components/exchanges/ExchangesList.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExchanges } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const ExchangesList: React.FC = () => {
  const { t } = useLanguage();
  const { data: exchanges, isLoading, error } = useQuery({
    queryKey: ['exchanges'],
    queryFn: getExchanges,
  });

  if (isLoading) return <div className="p-4">{t('loading')}</div>;
  if (error) return <div className="p-4 text-red-500">Error loading exchanges</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{t('digitalFinanceExchange')}</h2>
      
      {exchanges && exchanges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exchanges.map((exchange: any) => (
            <div key={exchange.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold">{exchange.name}</h3>
              <div className="text-sm text-gray-500 mb-2">{exchange.code}</div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{t('exchangeType')}:</span> {t(exchange.type)}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{t('supportedCurrencies')}:</span> {exchange.supported_currencies.join(', ')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('noExchangesFound')}</p>
      )}
    </div>
  );
};

export default ExchangesList;
```

### Языковой контекст | Тілдік контекст

```tsx
// src/contexts/LanguageContext.tsx (фрагмент)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ru' | 'kk';

interface Translations {
  [key: string]: {
    en: string;
    ru: string;
    kk: string;
  };
}

const translations: Translations = {
  // Общие переводы
  loading: {
    en: 'Loading...',
    ru: 'Загрузка...',
    kk: 'Жүктелуде...'
  },
  
  // Центры
  regionalCenters: {
    en: 'Regional Centers',
    ru: 'Региональные центры',
    kk: 'Аймақтық орталықтар'
  },
  nationalCenters: {
    en: 'National Centers',
    ru: 'Национальные центры',
    kk: 'Ұлттық орталықтар'
  },
  noRegionalCentersFound: {
    en: 'No regional centers found',
    ru: 'Региональные центры не найдены',
    kk: 'Аймақтық орталықтар табылмады'
  },
  noNationalCentersFound: {
    en: 'No national centers found',
    ru: 'Национальные центры не найдены',
    kk: 'Ұлттық орталықтар табылмады'
  },
  
  // Идентификация
  globalCitizenID: {
    en: 'Global Citizen ID',
    ru: 'Глобальный ID гражданина',
    kk: 'Жаһандық азамат ID'
  },
  globalVerification: {
    en: 'Global Verification',
    ru: 'Глобальная верификация',
    kk: 'Жаһандық верификация'
  },
  regionalVerification: {
    en: 'Regional Verification',
    ru: 'Региональная верификация',
    kk: 'Аймақтық верификация'
  },
  nationalVerification: {
    en: 'National Verification',
    ru: 'Национальная верификация',
    kk: 'Ұлттық верификация'
  },
  
  // Обмены
  digitalFinanceExchange: {
    en: 'Digital Finance Exchange',
    ru: 'Цифровая финансовая биржа',
    kk: 'Цифрлық қаржы биржасы'
  },
  noExchangesFound: {
    en: 'No exchanges found',
    ru: 'Биржи не найдены',
    kk: 'Биржалар табылмады'
  },
  
  // И другие переводы...
};
```

## API интеграция | API интеграциясы

```typescript
// src/services/api.ts (фрагмент)
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена авторизации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Центры
export const getRegionalCenters = async () => {
  const response = await api.get('/api/centers/regional');
  return response.data;
};

export const getNationalCenters = async () => {
  const response = await api.get('/api/centers/national');
  return response.data;
};

export const createRegionalCenter = async (data: any) => {
  const response = await api.post('/api/centers/regional', data);
  return response.data;
};

export const createNationalCenter = async (data: any) => {
  const response = await api.post('/api/centers/national', data);
  return response.data;
};

// Идентификация
export const getUserPassport = async () => {
  const response = await api.get('/api/identity/passport');
  return response.data;
};

export const createGlobalCitizenID = async () => {
  const response = await api.post('/api/identity/global-citizen-id');
  return response.data;
};

// Обмены
export const getExchanges = async () => {
  const response = await api.get('/api/exchanges');
  return response.data;
};

export const getExchangeRates = async () => {
  const response = await api.get('/api/exchanges/rates');
  return response.data;
};

export const createExchange = async (data: any) => {
  const response = await api.post('/api/exchanges', data);
  return response.data;
};

export const createExchangeRate = async (data: any) => {
  const response = await api.post('/api/exchanges/rates', data);
  return response.data;
};
```

## Интеграция с блокчейном | Блокчейнмен интеграция

```python
# app/services/blockchain.py (фрагмент)
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_defunct
import json
import os
from app.core.config import settings

class BlockchainService:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_PROVIDER_URL))
        self.contract_address = settings.NFT_PASSPORT_CONTRACT_ADDRESS
        self.contract_abi = self._load_contract_abi()
        self.contract = self.w3.eth.contract(address=self.contract_address, abi=self.contract_abi)
        
    def _load_contract_abi(self):
        abi_path = os.path.join(os.path.dirname(__file__), '../contracts/NFTPassport.json')
        with open(abi_path, 'r') as f:
            contract_json = json.load(f)
        return contract_json['abi']
    
    async def verify_passport(self, passport_id, user_address):
        """Verify passport ownership on blockchain"""
        try:
            owner = self.contract.functions.ownerOf(passport_id).call()
            return owner.lower() == user_address.lower()
        except Exception as e:
            print(f"Error verifying passport: {e}")
            return False
    
    async def mint_passport(self, user_address, metadata_uri):
        """Mint new NFT passport"""
        private_key = settings.BLOCKCHAIN_PRIVATE_KEY
        account = Account.from_key(private_key)
        
        nonce = self.w3.eth.get_transaction_count(account.address)
        
        txn = self.contract.functions.mintPassport(
            user_address,
            metadata_uri
        ).build_transaction({
            'chainId': settings.BLOCKCHAIN_CHAIN_ID,
            'gas': 2000000,
            'gasPrice': self.w3.eth.gas_price,
            'nonce': nonce,
        })
        
        signed_txn = self.w3.eth.account.sign_transaction(txn, private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        if receipt['status'] == 1:
            # Get token ID from event logs
            event = self.contract.events.PassportMinted().process_receipt(receipt)[0]
            token_id = event['args']['tokenId']
            return token_id
        else:
            raise Exception("Transaction failed")
    
    async def verify_global_citizen_id(self, global_citizen_id, signature):
        """Verify GlobalCitizenID using cryptographic signature"""
        try:
            message = encode_defunct(text=global_citizen_id)
            signer = Account.recover_message(message, signature=signature)
            
            # Check if signer is authorized verifier
            is_verifier = self.contract.functions.isVerifier(signer).call()
            return is_verifier
        except Exception as e:
            print(f"Error verifying GlobalCitizenID: {e}")
            return False
```

## Интеграция с Birlik Live | Birlik Live интеграциясы

```python
# app/integrations/birlik_live/client.py (фрагмент)
import httpx
from app.core.config import settings

class BirlikLiveClient:
    def __init__(self):
        self.base_url = settings.BIRLIK_LIVE_API_URL
        self.api_key = settings.BIRLIK_LIVE_API_KEY
        
    async def get_headers(self, auth_token=None):
        headers = {
            "Content-Type": "application/json",
            "X-API-Key": self.api_key
        }
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        return headers
    
    async def verify_identity(self, user_data, auth_token):
        """Verify user identity through Birlik Live"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/identity/verify",
                json=user_data,
                headers=await self.get_headers(auth_token)
            )
            return response.json()
    
    async def register_global_citizen(self, user_data, auth_token):
        """Register user as global citizen in Birlik Live"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/global/register",
                json=user_data,
                headers=await self.get_headers(auth_token)
            )
            return response.json()
    
    async def get_exchange_rates(self):
        """Get current exchange rates from Birlik Live"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/finance/exchange-rates",
                headers=await self.get_headers()
            )
            return response.json()
```

## Визуальный дизайн | Визуалды дизайн

```tsx
// src/pages/GlobalEconomy.tsx
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
      {/* Background pattern with Kazakh ornaments */}
      <div className="absolute inset-0 bg-kazakh-pattern opacity-5 pointer-events-none"></div>
      
      {/* Page header with Kazakh emblem */}
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
      
      {/* Decorative element with Golden Horde symbol */}
      <div className="absolute bottom-0 right-0 bg-golden-horde bg-contain bg-no-repeat w-16 h-16 opacity-20 animate-ornament-pulse"></div>
    </div>
  );
}
```

```css
/* Tailwind CSS конфигурация */
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'kazakh-blue': '#0066CC',
        'kazakh-gold': '#FFD700',
        'kazakh-darkBlue': '#00478F',
        'kazakh-red': '#CE1126',
      },
      backgroundImage: {
        'kazakh-pattern': "url('/src/assets/kazakh-pattern.svg')",
        'kazakh-ornament': "url('/src/assets/kazakh-ornament.svg')",
        'kazakh-emblem': "url('/src/assets/kazakh-emblem.svg')",
        'golden-horde': "url('/src/assets/golden-horde.svg')",
      },
      animation: {
        'ornament-pulse': 'ornament-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'ornament-pulse': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.5' },
        }
      }
    },
  },
  plugins: [],
}
```

## Заключение | Қорытынды

Интеграция архитектуры GlobalDigitalEconomy в Цифровой Банк представляет собой комплексное решение, объединяющее современные технологии блокчейна, цифровой идентификации и финансовых обменов. Реализация включает в себя полную поддержку русского и казахского языков, а также интеграцию казахских национальных элементов в дизайн интерфейса.

GlobalDigitalEconomy архитектурасын Цифровой Банк-ке интеграциялау блокчейн, цифрлық сәйкестендіру және қаржылық айырбастаудың заманауи технологияларын біріктіретін кешенді шешім болып табылады. Іске асыру орыс және қазақ тілдерін толық қолдауды, сондай-ақ интерфейс дизайнына қазақ ұлттық элементтерін интеграциялауды қамтиды.
