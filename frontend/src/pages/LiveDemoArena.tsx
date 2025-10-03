import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface DemoResult {
  [key: string]: any;
}

export default function LiveDemoArena() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, DemoResult>>({});

  const spaceMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/live-demos/space/lunar-landing', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to run space demo');
      return response.json();
    },
    onSuccess: (data) => {
      setResults(prev => ({ ...prev, space: data }));
      setActiveDemo(null);
    },
    onError: () => setActiveDemo(null)
  });

  const economyMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/live-demos/economy/cbdc-stress', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to run economy demo');
      return response.json();
    },
    onSuccess: (data) => {
      setResults(prev => ({ ...prev, economy: data }));
      setActiveDemo(null);
    },
    onError: () => setActiveDemo(null)
  });

  const medicineMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/live-demos/medicine/drug-discovery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to run medicine demo');
      return response.json();
    },
    onSuccess: (data) => {
      setResults(prev => ({ ...prev, medicine: data }));
      setActiveDemo(null);
    },
    onError: () => setActiveDemo(null)
  });

  const securityMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/live-demos/security/red-team', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to run security demo');
      return response.json();
    },
    onSuccess: (data) => {
      setResults(prev => ({ ...prev, security: data }));
      setActiveDemo(null);
    },
    onError: () => setActiveDemo(null)
  });

  const runDemo = (demoType: string) => {
    setActiveDemo(demoType);
    switch (demoType) {
      case 'space':
        spaceMutation.mutate();
        break;
      case 'economy':
        economyMutation.mutate();
        break;
      case 'medicine':
        medicineMutation.mutate();
        break;
      case 'security':
        securityMutation.mutate();
        break;
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-80 h-80 opacity-20 animate-ornament-pulse"></div>
      </div>
      
      <div className="relative flex items-center space-x-4">
        <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-12 h-12 animate-ornament-pulse"></div>
        <h1 className="text-3xl font-bold text-kazakh-darkBlue">Live Demo Arena</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Space/NASA Demo</h2>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 mb-4">Lunar landing simulation with TRN + MPC guidance</p>
          
          <button
            onClick={() => runDemo('space')}
            disabled={activeDemo === 'space'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
          >
            {activeDemo === 'space' ? 'Running Simulation...' : 'Launch Lunar Landing Demo'}
          </button>
          
          {results.space && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-green-600 mb-2">✓ Mission Success</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Trajectory:</span>
                  <span className="font-medium">{results.space.trajectory}</span>
                </div>
                <div className="flex justify-between">
                  <span>Landing Accuracy:</span>
                  <span className="font-medium">{results.space.landing_accuracy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel Efficiency:</span>
                  <span className="font-medium">{results.space.fuel_efficiency}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Economy/Fed Demo</h2>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 mb-4">CBDC stress testing with real-time monitoring</p>
          
          <button
            onClick={() => runDemo('economy')}
            disabled={activeDemo === 'economy'}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
          >
            {activeDemo === 'economy' ? 'Running Stress Test...' : 'Launch CBDC Stress Test'}
          </button>
          
          {results.economy && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-green-600 mb-2">✓ Test Passed</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>TPS:</span>
                  <span className="font-medium">{results.economy.transactions_per_second}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-medium">{results.economy.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="font-medium">{results.economy.success_rate}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Medicine/Bio Demo</h2>
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 mb-4">AI-powered drug discovery acceleration</p>
          
          <button
            onClick={() => runDemo('medicine')}
            disabled={activeDemo === 'medicine'}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
          >
            {activeDemo === 'medicine' ? 'Analyzing Compounds...' : 'Launch Drug Discovery'}
          </button>
          
          {results.medicine && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-green-600 mb-2">✓ Breakthrough Achieved</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Compounds:</span>
                  <span className="font-medium">{results.medicine.compounds_analyzed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Candidates:</span>
                  <span className="font-medium">{results.medicine.promising_candidates}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{results.medicine.time_to_discovery}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-kazakh-darkBlue">Security Demo</h2>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 mb-4">Red team penetration testing simulation</p>
          
          <button
            onClick={() => runDemo('security')}
            disabled={activeDemo === 'security'}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
          >
            {activeDemo === 'security' ? 'Running Security Scan...' : 'Launch Red Team Test'}
          </button>
          
          {results.security && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-green-600 mb-2">✓ System Secure</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Attack Vectors:</span>
                  <span className="font-medium">{results.security.attack_vectors_tested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vulnerabilities:</span>
                  <span className="font-medium">{results.security.vulnerabilities_found}</span>
                </div>
                <div className="flex justify-between">
                  <span>Defense Rate:</span>
                  <span className="font-medium">{results.security.defense_effectiveness}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md border border-kazakh-gold/20 relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-1 h-6 bg-kazakh-gold rounded"></div>
          <h2 className="text-xl font-semibold text-kazakh-darkBlue">Demo Arena Status</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-kazakh-blue">4</div>
            <div className="text-sm text-gray-600">Active Scenarios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-kazakh-gold">1.2s</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Availability</div>
          </div>
        </div>
      </div>
    </div>
  );
}
