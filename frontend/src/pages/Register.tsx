import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { register as registerUser } from "../services/api";
import { initWeb3, getWalletAddress } from "../services/web3";

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
      setError(error.response?.data?.detail || "Registration failed. Please try again.");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Birlik Digital Bank</h1>
          <p className="text-gray-600 mt-2">Create a new account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Username</label>
            <input
              {...form.register("username")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Choose a username"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              {...form.register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Full Name</label>
            <input
              {...form.register("full_name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your full name"
            />
            {form.formState.errors.full_name && (
              <p className="text-sm text-red-500">{form.formState.errors.full_name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Password</label>
            <input
              {...form.register("password")}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Create a password"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              {...form.register("confirmPassword")}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Confirm your password"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Wallet Address (Optional)</label>
            <div className="flex space-x-2">
              <input
                {...form.register("wallet_address")}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Connect your wallet or enter address manually"
                readOnly={isConnectingWallet}
              />
              <button
                type="button"
                onClick={connectWallet}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                disabled={isConnectingWallet}
              >
                {isConnectingWallet ? "Connecting..." : "Connect"}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating account..." : "Create Account"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
