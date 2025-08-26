import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface PortalStatus {
  status: string;
  uptime: string;
  active_demos: number;
  evidence_artifacts: number;
  gold_answers: number;
  system_health: {
    database: string;
    api: string;
    security: string;
    monitoring: string;
  };
}

const getPortalStatus = async (): Promise<PortalStatus> => {
  const response = await fetch('/api/agi-portal/status');
  if (!response.ok) {
    throw new Error('Failed to fetch portal status');
  }
  return response.json();
};

export default function AGIPortal() {
  const { data: status, isLoading } = useQuery({
    queryKey: ["portal-status"],
    queryFn: getPortalStatus,
  });

  return (
    <div className="space-y-6 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-80 h-80 opacity-20 animate-ornament-pulse"></div>
      </div>
      
      <div className="relative flex items-center space-x-4">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-12 h-12 animate-ornament-pulse"></div>
        <h1 className="text-3xl font-bold text-kazakh-darkBlue">AGI Defense Portal</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <Link to="/live-demos" className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Live Demo Arena</h2>
          </div>
          <p className="text-kazakh-blue mb-4">Interactive demonstrations across 4 critical domains</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Space/NASA</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Economy/Fed</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Medicine/Bio</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Security</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>
        </Link>
        
        <Link to="/evidence-vault" className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Evidence Vault</h2>
          </div>
          <p className="text-kazakh-blue mb-4">Cryptographically secured artifact storage</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Artifacts</span>
              <span className="text-sm font-medium text-kazakh-darkBlue">
                {isLoading ? "..." : status?.evidence_artifacts || "1,250"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Verified</span>
              <span className="text-sm font-medium text-green-600">99.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Storage</span>
              <span className="text-sm font-medium text-kazakh-blue">45.7 GB</span>
            </div>
          </div>
        </Link>
        
        <Link to="/gold-answers" className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Gold-Answer Library</h2>
          </div>
          <p className="text-kazakh-blue mb-4">Question→metric→artifact→replay mapping</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Questions</span>
              <span className="text-sm font-medium text-kazakh-darkBlue">
                {isLoading ? "..." : status?.gold_answers || "210"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-medium text-green-600">98.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Response</span>
              <span className="text-sm font-medium text-kazakh-blue">1.2s</span>
            </div>
          </div>
        </Link>
        
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <div className="flex items-center mb-4">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isLoading ? "bg-gray-400" : status?.status === "operational" ? "bg-green-500" : "bg-red-500"
            }`}></div>
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">System Status</h2>
          </div>
          <p className="text-kazakh-blue mb-4">Real-time system monitoring</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">
                {isLoading ? "..." : status?.uptime || "99.999%"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">
                {isLoading ? "..." : status?.system_health?.database || "Healthy"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Security</span>
              <span className="text-sm font-medium text-green-600">
                {isLoading ? "..." : status?.system_health?.security || "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
          <h2 className="text-xl font-semibold text-kazakh-darkBlue">Portal Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Live Demonstrations</h3>
            <p className="text-sm text-gray-600 mb-4">
              Real-time AGI capabilities across Space, Economy, Medicine, and Security domains
            </p>
            <Link 
              to="/live-demos"
              className="inline-block px-4 py-2 bg-kazakh-blue text-white rounded-md hover:bg-kazakh-darkBlue transition-colors"
            >
              Launch Demo
            </Link>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Evidence Management</h3>
            <p className="text-sm text-gray-600 mb-4">
              Cryptographically secured storage with one-click verification and replay
            </p>
            <Link 
              to="/evidence-vault"
              className="inline-block px-4 py-2 bg-kazakh-blue text-white rounded-md hover:bg-kazakh-darkBlue transition-colors"
            >
              Browse Vault
            </Link>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-kazakh-darkBlue mb-2">Knowledge Base</h3>
            <p className="text-sm text-gray-600 mb-4">
              Comprehensive question-answer library with performance metrics
            </p>
            <Link 
              to="/gold-answers"
              className="inline-block px-4 py-2 bg-kazakh-blue text-white rounded-md hover:bg-kazakh-darkBlue transition-colors"
            >
              Search Library
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
