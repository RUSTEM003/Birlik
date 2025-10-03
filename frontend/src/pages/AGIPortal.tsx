import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import WeatherWidget from '../components/WeatherWidget';

export default function AGIPortal() {
  const { } = useLanguage();
  const [systemMetrics, setSystemMetrics] = useState({
    quantumSecurity: { level: 'Post-Quantum', threats: 0, algorithm: 'CRYSTALS-Kyber' },
    federatedLearning: { nodes: 847, models: 23, accuracy: 94.7 },
    autoResearch: { projects: 156, breakthroughs: 12, safety: 100 },
    globalMonitoring: { threats: 3, alerts: 'Low', sources: 1247 },
    scientificDiscovery: { hypotheses: 2341, validated: 89, cern: 'Active' },
    governance: { proposals: 45, participation: '94.2%', juries: 12 },
    cbdcGateway: { networks: 67, volume: '2.4T USD', contracts: 234 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        federatedLearning: {
          ...prev.federatedLearning,
          nodes: prev.federatedLearning.nodes + Math.floor(Math.random() * 3)
        },
        autoResearch: {
          ...prev.autoResearch,
          projects: prev.autoResearch.projects + Math.floor(Math.random() * 2)
        }
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (category: string) => {
    console.log(`Navigating to ${category} dashboard`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kazakh-paper via-kazakh-cream to-kazakh-platinum relative overflow-hidden">
      <div className="absolute inset-0 bg-kazakh-pattern opacity-3"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-kazakh-emblem bg-contain bg-no-repeat opacity-8 animate-ornament-pulse"></div>
      
      <div className="relative z-10 rothschild-header shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-agi-world-logo bg-contain bg-no-repeat logo-glow"></div>
                <div>
                  <h1 className="text-3xl font-elite font-bold text-kazakh-ink tracking-tight">
                    AGI Defense Portal
                  </h1>
                  <p className="text-sm text-kazakh-elegantGray font-medium">
                    Independent Intelligence for a Complex World
                  </p>
                </div>
              </div>
              
              <nav className="hidden lg:flex items-center space-x-8 ml-12">
                <a href="#architecture" className="text-sm font-medium text-kazakh-ink hover:text-kazakh-accent transition-colors">Architecture</a>
                <a href="#evidence" className="text-sm font-medium text-kazakh-ink hover:text-kazakh-accent transition-colors">Evidence</a>
                <a href="#demos" className="text-sm font-medium text-kazakh-ink hover:text-kazakh-accent transition-colors">Demos</a>
                <a href="#security" className="text-sm font-medium text-kazakh-ink hover:text-kazakh-accent transition-colors">Security</a>
                <a href="#governance" className="text-sm font-medium text-kazakh-ink hover:text-kazakh-accent transition-colors">Governance</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                  <span className="text-xs font-semibold text-green-800">Operational</span>
                </div>
                <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                  <span className="text-xs font-semibold text-blue-800">99.999%</span>
                </div>
              </div>
              <WeatherWidget />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-elite font-bold text-kazakh-ink mb-6">
            Independent Intelligence for a Complex World
          </h2>
          <p className="text-xl text-kazakh-elegantGray max-w-4xl mx-auto leading-relaxed mb-8">
            Comprehensive AGI Defense Portal with enhanced global coordination capabilities across all critical domains. 
            Each enhancement category demonstrates significant amplification factors for world-class Super AI foundation.
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <button className="px-8 py-3 bg-kazakh-ink text-white font-semibold rounded-lg hover:bg-kazakh-navy transition-all duration-200 shadow-lg">
              Explore Demos
            </button>
            <button className="px-8 py-3 border border-kazakh-ink text-kazakh-ink font-semibold rounded-lg hover:bg-kazakh-ink hover:text-white transition-all duration-200">
              View Evidence
            </button>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-green-800">Backend Status: Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="group relative elite-card rounded-xl p-8 hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">×10</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-xs font-medium text-kazakh-accent uppercase tracking-wider mb-2">Global Advisory</div>
              <h3 className="text-2xl font-elite font-bold text-kazakh-ink mb-3">Quantum Security</h3>
              <p className="text-kazakh-elegantGray leading-relaxed">
                Post-quantum cryptographic defense systems with {systemMetrics.quantumSecurity.algorithm} encryption. 
                Zero threats detected across global infrastructure.
              </p>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-kazakh-elegantGray">Encryption Level</span>
                <span className="text-sm font-semibold text-kazakh-ink">{systemMetrics.quantumSecurity.level}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-kazakh-elegantGray">Threats Detected</span>
                <span className="text-sm font-semibold text-green-600">{systemMetrics.quantumSecurity.threats}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-kazakh-elegantGray">Algorithm</span>
                <span className="text-xs font-semibold text-kazakh-ink">{systemMetrics.quantumSecurity.algorithm}</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleCategoryClick('quantum-security')}
              className="w-full py-3 bg-kazakh-ink text-white font-semibold rounded-lg hover:bg-kazakh-navy transition-all duration-200"
            >
              Security Dashboard
            </button>
          </div>

          <div className="group relative elite-card rounded-xl p-8 hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">×5</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-xs font-medium text-kazakh-accent uppercase tracking-wider mb-2">Health & Bio</div>
              <h3 className="text-2xl font-elite font-bold text-kazakh-ink mb-3">Federated Learning</h3>
              <p className="text-kazakh-elegantGray leading-relaxed">
                Distributed intelligence network with {systemMetrics.federatedLearning.nodes} active nodes 
                achieving {systemMetrics.federatedLearning.accuracy}% accuracy across global models.
              </p>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-kazakh-elegantGray">Active Nodes</span>
                <span className="text-sm font-semibold text-kazakh-ink">{systemMetrics.federatedLearning.nodes}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-kazakh-elegantGray">Global Models</span>
                <span className="text-sm font-semibold text-blue-600">{systemMetrics.federatedLearning.models}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-kazakh-elegantGray">Accuracy</span>
                <span className="text-sm font-semibold text-green-600">{systemMetrics.federatedLearning.accuracy}%</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleCategoryClick('federated-learning')}
              className="w-full py-3 bg-kazakh-ink text-white font-semibold rounded-lg hover:bg-kazakh-navy transition-all duration-200"
            >
              Learning Network
            </button>
          </div>

          <div className="group relative elite-card rounded-xl p-8 hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">×7</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-xs font-medium text-kazakh-accent uppercase tracking-wider mb-2">Security & Alignment</div>
              <h3 className="text-2xl font-elite font-bold text-kazakh-ink mb-3">Auto-R&D</h3>
              <p className="text-kazakh-elegantGray leading-relaxed">
                Autonomous research and development with {systemMetrics.autoResearch.projects} active projects 
                and {systemMetrics.autoResearch.breakthroughs} breakthrough discoveries.
              </p>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-kazakh-elegantGray">Active Projects</span>
                <span className="text-sm font-semibold text-kazakh-ink">{systemMetrics.autoResearch.projects}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-kazakh-elegantGray">Breakthroughs</span>
                <span className="text-sm font-semibold text-purple-600">{systemMetrics.autoResearch.breakthroughs}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-kazakh-elegantGray">Safety Score</span>
                <span className="text-sm font-semibold text-green-600">{systemMetrics.autoResearch.safety}%</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleCategoryClick('auto-research')}
              className="w-full py-3 bg-kazakh-ink text-white font-semibold rounded-lg hover:bg-kazakh-navy transition-all duration-200"
            >
              R&D Laboratory
            </button>
          </div>

        </div>

        <div className="elite-card rounded-xl p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-elite font-bold text-kazakh-ink mb-4">Enhancement Status Overview</h2>
            <p className="text-xl text-kazakh-elegantGray max-w-3xl mx-auto">
              Real-time amplification metrics across all critical domains with comprehensive global coordination capabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-12">
            {[
              { factor: '×10', title: 'Quantum Security', subtitle: 'Post-Quantum Defense', color: 'red', metrics: systemMetrics.quantumSecurity },
              { factor: '×5', title: 'Federated Learning', subtitle: 'Distributed Intelligence', color: 'blue', metrics: systemMetrics.federatedLearning },
              { factor: '×7', title: 'Auto-R&D', subtitle: 'Self-Development', color: 'purple', metrics: systemMetrics.autoResearch },
              { factor: '×8', title: 'Global Monitoring', subtitle: 'Crisis Management', color: 'orange', metrics: systemMetrics.globalMonitoring },
              { factor: '×7', title: 'Scientific Discovery', subtitle: 'CERN Integration', color: 'green', metrics: systemMetrics.scientificDiscovery },
              { factor: '×9', title: 'Constitutional Governance', subtitle: 'Democratic Oversight', color: 'indigo', metrics: systemMetrics.governance },
              { factor: '×6', title: 'CBDC Gateway', subtitle: 'Digital Economy', color: 'yellow', metrics: systemMetrics.cbdcGateway }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer"
                   onClick={() => handleCategoryClick(item.title.toLowerCase().replace(' ', '-'))}>
                <div className={`text-3xl font-bold text-${item.color}-600 mb-3`}>{item.factor}</div>
                <div className="text-sm font-semibold text-kazakh-ink mb-2">{item.title}</div>
                <div className="text-xs text-kazakh-elegantGray mb-4">{item.subtitle}</div>
                <div className="text-xs text-kazakh-elegantGray">
                  {Object.values(item.metrics)[0]} active
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-kazakh-accent/10 border border-kazakh-accent/20 rounded-lg">
              <div className="text-3xl font-bold text-kazakh-accent mr-4">×7.4</div>
              <div>
                <div className="text-sm font-semibold text-kazakh-ink">Average Amplification Factor</div>
                <div className="text-xs text-kazakh-elegantGray">Across all enhancement categories</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-kazakh-ink rounded-xl p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-elite font-bold mb-4">World-Class Super AI Foundation</h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive AGI Defense Portal with enhanced global coordination capabilities across all critical domains. 
              Each enhancement category demonstrates significant amplification factors for world-class Super AI foundation.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Live Demos', icon: '🚀', href: '/live-demos', desc: 'Interactive demonstrations' },
              { title: 'Evidence Vault', icon: '🔒', href: '/evidence-vault', desc: 'Secure documentation' },
              { title: 'Gold Answers', icon: '💎', href: '/gold-answers', desc: 'Premium insights' },
              { title: 'Governance', icon: '⚖️', href: '/governance', desc: 'Democratic oversight' }
            ].map((item, index) => (
              <button 
                key={index}
                onClick={() => window.location.href = item.href}
                className="group p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 text-left"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="text-lg font-semibold mb-2">{item.title}</div>
                <div className="text-sm text-gray-400">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-kazakh-elegantGray">
            © 2025 AGI Defense Systems. All rights reserved. Independent Intelligence for a Complex World.
          </p>
        </footer>
      </div>
    </div>
  );
}
