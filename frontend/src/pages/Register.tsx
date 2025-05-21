import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { register as registerUser } from "../services/api";
import { initWeb3, getWalletAddress } from "../services/web3";
import { useLanguage } from "../contexts/LanguageContext";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  full_name: z.string().min(1, "Full name is required"),
  wallet_address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      wallet_address: "",
    },
  });
  
  const mutation = useMutation({
    mutationFn: (userData: FormValues) => {
      const { confirmPassword, ...rest } = userData;
      return registerUser(rest);
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || t('loginFailed'));
    },
  });
  
  async function connectWallet() {
    setIsConnectingWallet(true);
    try {
      const success = await initWeb3();
      if (success) {
        const address = await getWalletAddress();
        form.setValue("wallet_address", address);
      } else {
        setError("Failed to connect wallet. Please make sure you have MetaMask installed.");
      }
    } catch (error) {
      setError("Error connecting to wallet: " + (error as Error).message);
    } finally {
      setIsConnectingWallet(false);
    }
  }
  
  function onSubmit(values: FormValues) {
    setError("");
    mutation.mutate(values);
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kazakh-blue via-kazakh-light to-kazakh-gold relative">
      {/* Large centered background emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-96 h-96 opacity-25 animate-ornament-pulse"></div>
      </div>
      
      {/* Top ornament */}
      <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
        <div className="bg-kazakh-ornament bg-contain bg-no-repeat bg-center w-full h-32 opacity-30 animate-ornament-pulse"></div>
      </div>
      
      {/* Bottom ornament */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
        <div className="bg-kazakh-ornament bg-contain bg-no-repeat bg-center w-full h-32 opacity-30 animate-ornament-pulse"></div>
      </div>
      
      <div className="max-w-md w-full p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-kazakh-gold/30 relative overflow-hidden z-10">
        {/* Background ornament */}
        <div className="absolute inset-0 bg-kazakh-pattern opacity-10"></div>
        
        {/* Emblem */}
        <div className="absolute top-0 right-0 bg-kazakh-emblem bg-contain bg-no-repeat w-24 h-24 opacity-30"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-24 h-24 mb-2 animate-ornament-pulse"></div>
            <h1 className="text-3xl font-bold text-kazakh-darkBlue">Birlik Digital Bank</h1>
            <p className="text-kazakh-blue mt-2">{t('createAccount')}</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-kazakh-darkBlue">{t('username')}</label>
              <input
                {...form.register("username")}
                className="w-full px-3 py-2 border border-kazakh-blue/30 rounded-md focus:ring-2 focus:ring-kazakh-gold/50 focus:border-kazakh-gold transition-colors"
                placeholder={t('enterUsername')}
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-kazakh-darkBlue">{t('email')}</label>
              <input
                {...form.register("email")}
                type="email"
                className="w-full px-3 py-2 border border-kazakh-blue/30 rounded-md focus:ring-2 focus:ring-kazakh-gold/50 focus:border-kazakh-gold transition-colors"
                placeholder={t('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-kazakh-darkBlue">{t('fullName')}</label>
              <input
                {...form.register("full_name")}
                className="w-full px-3 py-2 border border-kazakh-blue/30 rounded-md focus:ring-2 focus:ring-kazakh-gold/50 focus:border-kazakh-gold transition-colors"
                placeholder={t('fullName')}
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-red-500">{form.formState.errors.full_name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-kazakh-darkBlue">{t('password')}</label>
              <input
                {...form.register("password")}
                type="password"
                className="w-full px-3 py-2 border border-kazakh-blue/30 rounded-md focus:ring-2 focus:ring-kazakh-gold/50 focus:border-kazakh-gold transition-colors"
                placeholder={t('enterPassword')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-kazakh-darkBlue">{t('confirmPassword')}</label>
              <input
                {...form.register("confirmPassword")}
                type="password"
                className="w-full px-3 py-2 border border-kazakh-blue/30 rounded-md focus:ring-2 focus:ring-kazakh-gold/50 focus:border-kazakh-gold transition-colors"
                placeholder={t('confirmPassword')}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-kazakh-darkBlue">{t('walletAddress')} ({t('optional')})</label>
              <div className="flex space-x-2">
                <input
                  {...form.register("wallet_address")}
                  className="flex-1 px-3 py-2 border border-kazakh-blue/30 rounded-md focus:ring-2 focus:ring-kazakh-gold/50 focus:border-kazakh-gold transition-colors"
                  placeholder={t('connectWalletOrEnterManually')}
                  readOnly={isConnectingWallet}
                />
                <button
                  type="button"
                  onClick={connectWallet}
                  className="px-3 py-2 bg-kazakh-gold text-kazakh-darkBlue rounded-md hover:bg-kazakh-darkGold transition-colors"
                  disabled={isConnectingWallet}
                >
                  {isConnectingWallet ? t('connecting') : t('connect')}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-kazakh-blue to-kazakh-darkBlue text-white font-medium rounded-md hover:from-kazakh-darkBlue hover:to-kazakh-blue disabled:opacity-50 transition-all duration-300 border border-kazakh-gold/30"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t('creatingAccount') : t('createAccount')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-kazakh-darkBlue">
              {t('alreadyHaveAccount')}{" "}
              <Link to="/login" className="text-kazakh-blue font-medium hover:text-kazakh-darkBlue hover:underline transition-colors">
                {t('signIn')}
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-kazakh-gold/20 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
              <div className="bg-golden-horde bg-contain bg-no-repeat bg-center w-8 h-8 animate-ornament-pulse"></div>
            </div>
            
            <h3 className="text-center text-sm font-medium text-kazakh-darkBlue mb-4">
              {t('birlikFeatures')}
            </h3>
            <ul className="space-y-2 text-sm text-kazakh-darkBlue">
              <li className="flex items-center">
                <span className="mr-2 text-kazakh-gold">✓</span>
                <span>{t('swiftIndependentTransfers')}</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-kazakh-gold">✓</span>
                <span>{t('nftPassport')}</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-kazakh-gold">✓</span>
                <span>{t('multiCurrency')}</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-kazakh-gold">✓</span>
                <span>{t('daoGovernance')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
