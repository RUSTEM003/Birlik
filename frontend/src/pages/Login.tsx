import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/api";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
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
      setError(error.response?.data?.detail || "Login failed. Please check your credentials.");
    },
  });
  
  function onSubmit(values: FormValues) {
    setError("");
    mutation.mutate(values);
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Birlik Digital Bank</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
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
              placeholder="Enter your username"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Password</label>
            <input
              {...form.register("password")}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-center text-sm font-medium text-gray-500 mb-4">
            Birlik Digital Bank Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>SWIFT-independent cross-border transfers</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>NFT-based digital identity passports</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Multi-currency wallet (Fiat, CBDC, Crypto)</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>DAO governance for community decisions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
