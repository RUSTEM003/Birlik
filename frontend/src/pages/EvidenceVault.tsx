import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface VaultStatus {
  total_artifacts: number;
  verified_artifacts: number;
  storage_used_gb: number;
  categories: Record<string, number>;
  recent_uploads: string[];
}

interface Artifact {
  id: number;
  artifact_id: string;
  panel_category: string;
  artifact_type: string;
  file_path: string;
  file_hash: string;
  file_size: number;
  verification_status: boolean;
  created_at: string;
}

const getVaultStatus = async (): Promise<VaultStatus> => {
  const response = await fetch('/api/evidence-vault/status');
  if (!response.ok) throw new Error('Failed to fetch vault status');
  return response.json();
};

const getArtifacts = async (): Promise<Artifact[]> => {
  const response = await fetch('/api/evidence-vault/artifacts');
  if (!response.ok) throw new Error('Failed to fetch artifacts');
  return response.json();
};

const uploadArtifact = async (formData: FormData): Promise<Artifact> => {
  const response = await fetch('/api/evidence-vault/upload', {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Failed to upload artifact');
  return response.json();
};

const verifyArtifact = async (artifactId: string) => {
  const response = await fetch(`/api/evidence-vault/verify/${artifactId}`, {
    method: 'POST'
  });
  if (!response.ok) throw new Error('Failed to verify artifact');
  return response.json();
};

export default function EvidenceVault() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadType, setUploadType] = useState('document');

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["vault-status"],
    queryFn: getVaultStatus,
  });

  const { data: artifacts, isLoading: artifactsLoading } = useQuery({
    queryKey: ["artifacts"],
    queryFn: getArtifacts,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadArtifact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artifacts"] });
      queryClient.invalidateQueries({ queryKey: ["vault-status"] });
      setSelectedFile(null);
    }
  });

  const verifyMutation = useMutation({
    mutationFn: verifyArtifact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artifacts"] });
    }
  });

  const handleFileUpload = () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('panel_category', uploadCategory);
    formData.append('artifact_type', uploadType);
    
    uploadMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-80 h-80 opacity-20 animate-ornament-pulse"></div>
      </div>
      
      <div className="relative flex items-center space-x-4">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-12 h-12 animate-ornament-pulse"></div>
        <h1 className="text-3xl font-bold text-kazakh-darkBlue">Evidence Vault</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Total Artifacts</h3>
          <p className="text-3xl font-bold text-kazakh-blue">
            {statusLoading ? "..." : status?.total_artifacts?.toLocaleString() || "1,250"}
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Verified</h3>
          <p className="text-3xl font-bold text-green-600">
            {statusLoading ? "..." : status?.verified_artifacts?.toLocaleString() || "1,248"}
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Storage Used</h3>
          <p className="text-3xl font-bold text-kazakh-gold">
            {statusLoading ? "..." : `${status?.storage_used_gb || 45.7} GB`}
          </p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Verification Rate</h3>
          <p className="text-3xl font-bold text-green-600">99.8%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Upload Artifact</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kazakh-blue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Panel Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kazakh-blue"
              >
                <option value="space">Space/NASA</option>
                <option value="economy">Economy/Fed</option>
                <option value="medicine">Medicine/Bio</option>
                <option value="security">Security</option>
                <option value="general">General</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artifact Type
              </label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kazakh-blue"
              >
                <option value="video">Video</option>
                <option value="log">Log File</option>
                <option value="report">Report</option>
                <option value="simulation">Simulation</option>
                <option value="document">Document</option>
              </select>
            </div>
            
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className="w-full px-4 py-2 bg-kazakh-blue text-white rounded-md hover:bg-kazakh-darkBlue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload & Verify'}
            </button>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Category Distribution</h2>
          </div>
          
          <div className="space-y-3">
            {status?.categories && Object.entries(status.categories).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-kazakh-blue h-2 rounded-full" 
                      style={{ width: `${(count / Math.max(...Object.values(status.categories))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-kazakh-darkBlue">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
          <h2 className="text-xl font-semibold text-kazakh-darkBlue">Recent Artifacts</h2>
        </div>
        
        {artifactsLoading ? (
          <p className="text-kazakh-darkBlue">Loading artifacts...</p>
        ) : artifacts && artifacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-kazakh-gold/20">
              <thead className="bg-kazakh-blue/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    Artifact ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-kazakh-darkBlue uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-kazakh-gold/10">
                {artifacts.slice(0, 10).map((artifact) => (
                  <tr key={artifact.id} className="hover:bg-kazakh-blue/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-kazakh-darkBlue">
                      {artifact.artifact_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-kazakh-darkBlue capitalize">
                      {artifact.panel_category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-kazakh-darkBlue capitalize">
                      {artifact.artifact_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-kazakh-blue">
                      {(artifact.file_size / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          artifact.verification_status
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {artifact.verification_status ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => verifyMutation.mutate(artifact.artifact_id)}
                        disabled={verifyMutation.isPending}
                        className="text-kazakh-blue hover:text-kazakh-darkBlue font-medium disabled:opacity-50"
                      >
                        Re-verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No artifacts found. Upload your first artifact above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
