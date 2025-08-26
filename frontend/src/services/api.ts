import axios from "axios";
import { tokenValidator } from '../auth/tokenValidator';

const API_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    const validation = tokenValidator.validateToken(token);
    if (validation.valid) {
      config.headers.Authorization = `Bearer ${token}`;
      
      if (tokenValidator.isTokenExpiringSoon(token, 5)) {
        console.warn('Token expiring soon, consider refreshing');
      }
    } else {
      console.error('Invalid token:', validation.error);
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(new Error('Invalid token'));
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 429) {
      console.warn('Rate limit exceeded, retrying after delay');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(api.request(error.config));
        }, 1000);
      });
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: { username: string; password: string }) => {
  const params = new URLSearchParams();
  params.append("username", credentials.username);
  params.append("password", credentials.password);
  
  const response = await api.post("/api/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  return response.data;
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  full_name: string;
  wallet_address?: string;
}) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

export const createTransfer = async (transferData: {
  recipient: string;
  amount: number;
  currency: string;
}) => {
  const response = await api.post("/api/transfers", transferData);
  return response.data;
};

export const getUserTransfers = async () => {
  const response = await api.get("/api/transfers");
  return response.data;
};

export const createNFTPassport = async (passportData: {
  passport_type: string;
  passport_metadata: Record<string, any>;
}) => {
  const response = await api.post("/api/identity/passport", passportData);
  return response.data;
};

export const getUserPassport = async () => {
  const response = await api.get("/api/identity/passport");
  return response.data;
};

export const getRegionalCenters = async () => {
  const response = await api.get("/api/centers/regional");
  return response.data;
};

export const createRegionalCenter = async (centerData: {
  code: string;
  name: string;
  description?: string;
}) => {
  const response = await api.post("/api/centers/regional", centerData);
  return response.data;
};

export const getNationalCenters = async () => {
  const response = await api.get("/api/centers/national");
  return response.data;
};

export const createNationalCenter = async (centerData: {
  code: string;
  name: string;
  description?: string;
  regional_center_id: number;
  currency_code: string;
  language_codes: string[];
}) => {
  const response = await api.post("/api/centers/national", centerData);
  return response.data;
};

export const getExchanges = async () => {
  const response = await api.get("/api/exchanges");
  return response.data;
};

export const createExchange = async (exchangeData: {
  name: string;
  code: string;
  type: string;
  supported_currencies: string[];
}) => {
  const response = await api.post("/api/exchanges", exchangeData);
  return response.data;
};

export const getExchangeRates = async (exchangeId: number) => {
  const response = await api.get(`/api/exchanges/rates/${exchangeId}`);
  return response.data;
};

export const createExchangeRate = async (rateData: {
  exchange_id: number;
  from_currency: string;
  to_currency: string;
  rate: number;
}) => {
  const response = await api.post("/api/exchanges/rates", rateData);
  return response.data;
};

export const performQuantumTransaction = async (transactionData: {
  sender_id: number;
  receiver_id: number;
  amount: number;
}) => {
  const response = await api.post("/api/quantum/transaction", transactionData);
  return response.data;
};

export const getQuantumFinancialAdvice = async () => {
  const response = await api.get("/api/quantum/financial-advice");
  return response.data;
};

export const runSpaceDemo = async () => {
  const response = await api.post("/api/live-demos/space/lunar-landing");
  return response.data;
};

export const runEconomyDemo = async () => {
  const response = await api.post("/api/live-demos/economy/cbdc-stress");
  return response.data;
};

export const runMedicineDemo = async () => {
  const response = await api.post("/api/live-demos/medicine/drug-discovery");
  return response.data;
};

export const runSecurityDemo = async () => {
  const response = await api.post("/api/live-demos/security/red-team");
  return response.data;
};

export default api;
