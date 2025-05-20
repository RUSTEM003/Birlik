import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en' | 'ru';

export const translations = {
  en: {
    loading: 'Loading...',
    welcome: 'Welcome to Birlik Digital Bank',
    
    dashboard: 'Dashboard',
    transfers: 'Transfers',
    wallet: 'Wallet',
    identity: 'Identity',
    governance: 'Governance',
    profile: 'Profile',
    logout: 'Logout',
    
    login: 'Login',
    register: 'Register',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    dontHaveAccount: 'Don\'t have an account?',
    signUp: 'Sign Up',
    
    totalTransfers: 'Total Transfers',
    cbdcBalance: 'CBDC Balance',
    fiatBalance: 'Fiat Balance',
    recentTransactions: 'Recent Transactions',
    date: 'Date',
    recipient: 'Recipient',
    amount: 'Amount',
    status: 'Status',
    noTransactionsFound: 'No transactions found.',
    
    crossBorderTransfers: 'Cross-Border Transfers',
    transferFeatures: 'Transfer Features',
    swiftIndependent: 'SWIFT-independent transfers',
    multiCurrency: 'Multi-currency support (Fiat, CBDC, Crypto)',
    instantSettlement: 'Instant settlement (3-5 seconds)',
    lowFees: 'Low fees (0.1-0.3%)',
    blockchainVerification: 'Blockchain verification',
    crossBorderSupport: 'Cross-border support for CIS and Asia',
    transactionHistory: 'Transaction History',
    blockchainTx: 'Blockchain TX',
    view: 'View',
    
    multiCurrencyWallet: 'Multi-Currency Wallet',
    walletInformation: 'Wallet Information',
    walletAddress: 'Wallet Address',
    notConnected: 'Not connected',
    ethBalance: 'ETH Balance',
    refreshBalance: 'Refresh Balance',
    noWeb3Wallet: 'No Web3 wallet detected',
    installMetaMask: 'Please install MetaMask or another Web3 wallet to use this feature',
    fiatCbdcBalances: 'Fiat & CBDC Balances',
    walletFeatures: 'Wallet Features',
    
    nftPassport: 'NFT Passport',
    createPassport: 'Create Passport',
    verifyIdentity: 'Verify Identity',
    passportDetails: 'Passport Details',
    passportType: 'Passport Type',
    nationality: 'Nationality',
    dateOfBirth: 'Date of Birth',
    issuedAt: 'Issued At',
    expiresAt: 'Expires At',
    
    daoGovernance: 'DAO Governance',
    activeProposals: 'Active Proposals',
    pastProposals: 'Past Proposals',
    createProposal: 'Create Proposal',
    proposalTitle: 'Proposal Title',
    proposalDescription: 'Proposal Description',
    votingPeriod: 'Voting Period',
    voteFor: 'Vote For',
    voteAgainst: 'Vote Against',
    
    language: 'Language',
    english: 'English',
    russian: 'Russian',
    
    birlikLiveIntegration: 'Birlik Live Integration',
    connectToBirlikLive: 'Connect to Birlik Live',
    birlikLiveFeatures: 'Birlik Live Features',
    connectedToBirlikLive: 'Connected to Birlik Live',
    connecting: 'Connecting...',
    birlikLiveServices: 'Birlik Live Services',
    maps: 'Maps',
    mapsDescription: 'Interactive maps and location services',
    marketplace: 'Marketplace',
    marketplaceDescription: 'Buy and sell goods and services',
    socialNetwork: 'Social Network',
    socialNetworkDescription: 'Connect with other users',
  },
  ru: {
    loading: 'Загрузка...',
    welcome: 'Добро пожаловать в Birlik Digital Bank',
    
    dashboard: 'Панель управления',
    transfers: 'Переводы',
    wallet: 'Кошелек',
    identity: 'Идентификация',
    governance: 'Управление',
    profile: 'Профиль',
    logout: 'Выйти',
    
    login: 'Вход',
    register: 'Регистрация',
    username: 'Имя пользователя',
    email: 'Электронная почта',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    fullName: 'Полное имя',
    createAccount: 'Создать аккаунт',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    signIn: 'Войти',
    dontHaveAccount: 'Нет аккаунта?',
    signUp: 'Зарегистрироваться',
    
    totalTransfers: 'Всего переводов',
    cbdcBalance: 'Баланс CBDC',
    fiatBalance: 'Фиатный баланс',
    recentTransactions: 'Последние транзакции',
    date: 'Дата',
    recipient: 'Получатель',
    amount: 'Сумма',
    status: 'Статус',
    noTransactionsFound: 'Транзакции не найдены.',
    
    crossBorderTransfers: 'Трансграничные переводы',
    transferFeatures: 'Особенности переводов',
    swiftIndependent: 'Переводы без SWIFT',
    multiCurrency: 'Поддержка нескольких валют (Фиат, CBDC, Крипто)',
    instantSettlement: 'Мгновенное зачисление (3-5 секунд)',
    lowFees: 'Низкие комиссии (0.1-0.3%)',
    blockchainVerification: 'Верификация через блокчейн',
    crossBorderSupport: 'Поддержка трансграничных переводов для СНГ и Азии',
    transactionHistory: 'История транзакций',
    blockchainTx: 'Блокчейн TX',
    view: 'Просмотр',
    
    multiCurrencyWallet: 'Мультивалютный кошелек',
    walletInformation: 'Информация о кошельке',
    walletAddress: 'Адрес кошелька',
    notConnected: 'Не подключен',
    ethBalance: 'Баланс ETH',
    refreshBalance: 'Обновить баланс',
    noWeb3Wallet: 'Web3 кошелек не обнаружен',
    installMetaMask: 'Пожалуйста, установите MetaMask или другой Web3 кошелек для использования этой функции',
    fiatCbdcBalances: 'Балансы Фиат и CBDC',
    walletFeatures: 'Особенности кошелька',
    
    nftPassport: 'NFT паспорт',
    createPassport: 'Создать паспорт',
    verifyIdentity: 'Подтвердить личность',
    passportDetails: 'Детали паспорта',
    passportType: 'Тип паспорта',
    nationality: 'Гражданство',
    dateOfBirth: 'Дата рождения',
    issuedAt: 'Дата выдачи',
    expiresAt: 'Действителен до',
    
    daoGovernance: 'Управление DAO',
    activeProposals: 'Активные предложения',
    pastProposals: 'Прошлые предложения',
    createProposal: 'Создать предложение',
    proposalTitle: 'Название предложения',
    proposalDescription: 'Описание предложения',
    votingPeriod: 'Период голосования',
    voteFor: 'Голосовать за',
    voteAgainst: 'Голосовать против',
    
    language: 'Язык',
    english: 'Английский',
    russian: 'Русский',
    
    birlikLiveIntegration: 'Интеграция с Birlik Live',
    connectToBirlikLive: 'Подключиться к Birlik Live',
    birlikLiveFeatures: 'Функции Birlik Live',
    connectedToBirlikLive: 'Подключено к Birlik Live',
    connecting: 'Подключение...',
    birlikLiveServices: 'Сервисы Birlik Live',
    maps: 'Карты',
    mapsDescription: 'Интерактивные карты и сервисы локации',
    marketplace: 'Маркетплейс',
    marketplaceDescription: 'Покупка и продажа товаров и услуг',
    socialNetwork: 'Социальная сеть',
    socialNetworkDescription: 'Общение с другими пользователями',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const storedLanguage = localStorage.getItem('language') as Language;
  const [language, setLanguage] = useState<Language>(storedLanguage || 'en');

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
