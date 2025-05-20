/**
 * Birlik Live Integration Service
 * 
 * This service provides integration with the Birlik Live platform for:
 * - User registration and Web3 wallet creation
 * - NFT passport generation
 * - Document storage
 * - Cross-border transfers
 */
import axios from 'axios';
import Web3 from 'web3';
import { ethers } from 'ethers';

export type UserType = 'citizen' | 'government' | 'corporation' | 'international';

export interface NFTPassportMetadata {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  userType: UserType;
  additionalData?: Record<string, any>;
}

export interface NFTPassport {
  id: number;
  owner_id: number;
  nft_token_id: string;
  passport_type: UserType;
  passport_metadata: NFTPassportMetadata;
  ipfs_hash: string | null;
  is_active: boolean;
  issued_at: string;
  expires_at: string | null;
}

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
}

export interface TransactionResult {
  transaction_hash: string;
  sender: string;
  recipient: string;
  amount: number;
  currency: string;
  status: string;
}

export interface BirlikLiveStatus {
  connected: boolean;
  username?: string;
  lastConnected?: string;
  services?: string[];
}

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Connect to Birlik Live platform
 * 
 * @param credentials Login credentials
 * @returns Connection status
 */
export const connectToBirlikLive = async (credentials: { username: string; password: string }): Promise<BirlikLiveStatus> => {
  try {
    const response = await api.post('/api/integrations/birlik-live/connect', credentials);
    return response.data;
  } catch (error) {
    console.error('Error connecting to Birlik Live:', error);
    throw error;
  }
};

/**
 * Get Birlik Live connection status
 * 
 * @returns Connection status
 */
export const getBirlikLiveStatus = async (): Promise<BirlikLiveStatus> => {
  try {
    const response = await api.get('/api/integrations/birlik-live/status');
    return response.data;
  } catch (error) {
    console.error('Error getting Birlik Live status:', error);
    return { connected: false };
  }
};

/**
 * Birlik Live Integration Service
 */
export const BirlikLiveService = {
  /**
   * Register a new user and create a Web3 wallet
   * 
   * @param userData User registration data
   * @returns User data with wallet information
   */
  async registerUser(userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    user_type: UserType;
  }) {
    try {
      const wallet = ethers.Wallet.createRandom();
      
      const response = await api.post('/api/auth/register', {
        ...userData,
        wallet_address: wallet.address,
      });
      
      const encryptedWallet = await wallet.encrypt(userData.password);
      localStorage.setItem('encrypted_wallet', encryptedWallet);
      
      return {
        ...response.data,
        wallet: {
          address: wallet.address,
          privateKey: wallet.privateKey, // Only returned once during registration
        },
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  /**
   * Login user and retrieve wallet
   * 
   * @param credentials Login credentials
   * @returns User data with token
   */
  async login(credentials: { username: string; password: string }) {
    try {
      const params = new URLSearchParams();
      params.append('username', credentials.username);
      params.append('password', credentials.password);
      
      const response = await api.post('/api/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      localStorage.setItem('token', response.data.access_token);
      
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  /**
   * Create an NFT passport for the user
   * 
   * @param passportData Passport data
   * @returns Created NFT passport
   */
  async createNFTPassport(passportData: {
    passport_type: UserType;
    passport_metadata: NFTPassportMetadata;
  }) {
    try {
      const response = await api.post('/api/identity/passport', passportData);
      return response.data as NFTPassport;
    } catch (error) {
      console.error('Error creating NFT passport:', error);
      throw error;
    }
  },
  
  /**
   * Get the user's NFT passport
   * 
   * @returns User's NFT passport
   */
  async getNFTPassport() {
    try {
      const response = await api.get('/api/identity/passport');
      return response.data as NFTPassport;
    } catch (error) {
      console.error('Error getting NFT passport:', error);
      throw error;
    }
  },
  
  /**
   * Connect to Web3 wallet (MetaMask or other provider)
   * 
   * @returns Wallet information
   */
  async connectWallet(): Promise<WalletInfo> {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const web3 = new Web3(window.ethereum);
        
        const networkId = await web3.eth.net.getId();
        let network = 'unknown';
        
        const networkIdNum = Number(networkId);
        
        switch (networkIdNum) {
          case 1:
            network = 'Ethereum Mainnet';
            break;
          case 3:
            network = 'Ropsten Testnet';
            break;
          case 4:
            network = 'Rinkeby Testnet';
            break;
          case 5:
            network = 'Goerli Testnet';
            break;
          case 42:
            network = 'Kovan Testnet';
            break;
          case 11155111:
            network = 'Sepolia Testnet';
            break;
        }
        
        const balance = await web3.eth.getBalance(accounts[0]);
        const etherBalance = web3.utils.fromWei(balance, 'ether');
        
        return {
          address: accounts[0],
          balance: etherBalance,
          network,
        };
      } else {
        throw new Error('Web3 provider not found. Please install MetaMask or another Web3 wallet.');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  },
  
  /**
   * Upload a document to IPFS via Birlik Live
   * 
   * @param file File to upload
   * @param metadata Document metadata
   * @returns IPFS hash and gateway URL
   */
  async uploadDocument(file: File, metadata: Record<string, any>) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));
      
      const response = await api.post('/api/storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },
  
  /**
   * Create a cross-border transfer
   * 
   * @param transferData Transfer data
   * @returns Transaction result
   */
  async createTransfer(transferData: {
    recipient: string;
    amount: number;
    currency: string;
  }): Promise<TransactionResult> {
    try {
      const response = await api.post('/api/transfers', transferData);
      return response.data;
    } catch (error) {
      console.error('Error creating transfer:', error);
      throw error;
    }
  },
  
  /**
   * Get user's transaction history
   * 
   * @returns List of transactions
   */
  async getTransactions() {
    try {
      const response = await api.get('/api/transfers');
      return response.data;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  },
  
  /**
   * Get user's wallet balance
   * 
   * @param currency Optional currency code
   * @returns Balance information
   */
  async getWalletBalance(currency?: string) {
    try {
      const params = currency ? `?currency=${currency}` : '';
      const response = await api.get(`/api/wallet/balance${params}`);
      return response.data;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  },
  
  /**
   * Connect to Birlik Live platform
   * 
   * @param credentials Login credentials
   * @returns Connection status
   */
  connectToBirlikLive,
  
  /**
   * Get Birlik Live connection status
   * 
   * @returns Connection status
   */
  getBirlikLiveStatus,
};

declare global {
  interface Window {
    ethereum: any;
  }
}

export default BirlikLiveService;
