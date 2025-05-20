import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserPassport, createNFTPassport } from "../services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Passport {
  id: number;
  owner_id: number;
  nft_token_id: string;
  passport_type: string;
  passport_metadata: Record<string, any>;
  ipfs_hash: string;
  is_active: boolean;
  issued_at: string;
  expires_at: string | null;
}

const passportFormSchema = z.object({
  passport_type: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
});

type PassportFormValues = z.infer<typeof passportFormSchema>;

export default function Identity() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formError, setFormError] = useState("");
  
  const { data: passport, isLoading } = useQuery({
    queryKey: ["passport"],
    queryFn: async () => {
      try {
        const data = await getUserPassport();
        return data as Passport;
      } catch (error) {
        console.error("Failed to fetch passport:", error);
        return undefined;
      }
    },
    retry: 1
  });
  
  const form = useForm<PassportFormValues>({
    resolver: zodResolver(passportFormSchema),
    defaultValues: {
      passport_type: "citizen",
      fullName: "",
      dateOfBirth: "",
      nationality: "",
    },
  });
  
  const createPassportMutation = useMutation({
    mutationFn: (data: { passport_type: string, passport_metadata: Record<string, any> }) => {
      return createNFTPassport(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["passport"] });
      setShowCreateForm(false);
      form.reset();
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.detail || "Failed to create passport. Please try again.");
    },
  });
  
  function onSubmit(values: PassportFormValues) {
    setFormError("");
    createPassportMutation.mutate({
      passport_type: values.passport_type,
      passport_metadata: {
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth,
        nationality: values.nationality,
      },
    });
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Digital Identity</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">NFT Passport</h2>
          
          {isLoading ? (
            <p>Loading passport information...</p>
          ) : passport ? (
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-blue-600">ID</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Passport Type</h3>
                <p className="text-lg font-medium">{passport?.passport_type}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Token ID</h3>
                <p className="text-lg font-medium break-all">{passport?.nft_token_id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">IPFS Hash</h3>
                <p className="text-lg font-medium break-all">{passport?.ipfs_hash}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Issued Date</h3>
                <p className="text-lg font-medium">
                  {passport?.issued_at ? new Date(passport.issued_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                <p className="text-lg font-medium">
                  {passport?.expires_at 
                    ? new Date(passport.expires_at).toLocaleDateString() 
                    : "Never"}
                </p>
              </div>
              
              <div className="pt-4">
                <a
                  href={`https://ipfs.io/ipfs/${passport?.ipfs_hash?.replace('ipfs://', '') || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
                >
                  View on IPFS
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 mb-4">No NFT Passport found</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create NFT Passport
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Identity Features</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>NFT-based digital passport</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Biometric authentication</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Decentralized identity verification</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>IPFS storage for identity documents</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Cross-border identity recognition</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span>Selective disclosure of personal information</span>
            </li>
          </ul>
        </div>
      </div>
      
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create NFT Passport</h2>
          
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {formError}
            </div>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Passport Type</label>
              <select 
                {...form.register("passport_type")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="citizen">Citizen</option>
                <option value="government">Government</option>
                <option value="corporation">Corporation</option>
                <option value="international">International</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Full Name</label>
              <input
                {...form.register("fullName")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your full name"
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Date of Birth</label>
              <input
                {...form.register("dateOfBirth")}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {form.formState.errors.dateOfBirth && (
                <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Nationality</label>
              <input
                {...form.register("nationality")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your nationality"
              />
              {form.formState.errors.nationality && (
                <p className="text-sm text-red-500">{form.formState.errors.nationality.message}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={createPassportMutation.isPending}
              >
                {createPassportMutation.isPending ? "Creating..." : "Create Passport"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
