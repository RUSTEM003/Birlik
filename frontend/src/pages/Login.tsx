import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      navigate("/");
    },
    onError: (error: any) => {
      setError(error.response?.data?.detail || t('loginFailed'));
    },
  });
  
  function onSubmit(values: FormValues) {
    setError("");
    mutation.mutate(values);
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kazakh-blue via-kazakh-light to-kazakh-gold relative">
      {/* Large centered background emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-96 h-96 opacity-20 animate-ornament-pulse"></div>
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
            <h1 className="text-3xl font-bold text-kazakh-darkBlue">Цифровой Банк</h1>
            <p className="text-kazakh-blue mt-2">{t('signInToAccount')}</p>
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
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-kazakh-blue to-kazakh-darkBlue text-white font-medium rounded-md hover:from-kazakh-darkBlue hover:to-kazakh-blue disabled:opacity-50 transition-all duration-300 border border-kazakh-gold/30"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t('signingIn') : t('signIn')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-kazakh-darkBlue">
              {t('dontHaveAccount')}{" "}
              <Link to="/register" className="text-kazakh-blue font-medium hover:text-kazakh-darkBlue hover:underline transition-colors">
                {t('register')}
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
                <span className="mr-2 text-kazakh-gold">•</span>
                <span>{t('swiftIndependentTransfers')}</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-kazakh-gold">•</span>
                <span>{t('nftPassport')}</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-kazakh-gold">•</span>
                <span>{t('multiCurrency')}</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-kazakh-gold">•</span>
                <span>{t('daoGovernance')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
