import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime + 300) {
        const refreshTokenValue = localStorage.getItem("refresh_token");
        if (refreshTokenValue) {
          try {
            const refreshResponse = await refreshToken(refreshTokenValue);
            localStorage.setItem("token", refreshResponse.access_token);
            localStorage.setItem("refresh_token", refreshResponse.refresh_token);
            config.headers.Authorization = `Bearer ${refreshResponse.access_token}`;
          } catch (refreshError) {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
            return Promise.reject(new Error("Session expired"));
          }
        } else {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject(new Error("Token expired"));
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return Promise.reject(new Error("Invalid token"));
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
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

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post("/api/auth/refresh", {
    refresh_token: refreshToken
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
