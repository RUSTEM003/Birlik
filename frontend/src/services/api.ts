import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials: { username: string; password: string }) => {
  const response = await api.post("/api/auth/login", credentials);
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
  metadata: Record<string, any>;
}) => {
  const response = await api.post("/api/identity/passport", passportData);
  return response.data;
};

export const getUserPassport = async () => {
  const response = await api.get("/api/identity/passport");
  return response.data;
};
