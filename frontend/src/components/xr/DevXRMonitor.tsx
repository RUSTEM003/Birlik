import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DevMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface DevXRMonitorProps {
  metrics?: DevMetric[];
  refreshInterval?: number;
}

const DevXRMonitor: React.FC<DevXRMonitorProps> = ({ 
  metrics = [], 
  refreshInterval = 30000 
}) => {
  const { t } = useLanguage();
  const [isXRMode, setIsXRMode] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<DevMetric[]>(metrics);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (metrics.length === 0) {
      setCurrentMetrics([
        {
          id: 'cpu',
          name: t('cpuUsage'),
          value: 42,
          unit: '%',
          status: 'normal',
          trend: 'stable'
        },
        {
          id: 'memory',
          name: t('memoryUsage'),
          value: 3.7,
          unit: 'GB',
          status: 'normal',
          trend: 'up'
        },
        {
          id: 'network',
          name: t('networkLatency'),
          value: 120,
          unit: 'ms',
          status: 'warning',
          trend: 'up'
        },
        {
          id: 'disk',
          name: t('diskUsage'),
          value: 78,
          unit: '%',
          status: 'warning',
          trend: 'up'
        },
        {
          id: 'users',
          name: t('activeUsers'),
          value: 1243,
          unit: '',
          status: 'normal',
          trend: 'up'
        }
      ]);
    } else {
      setCurrentMetrics(metrics);
    }
  }, [metrics, t]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.id === 'users' 
          ? Math.floor(metric.value * (1 + (Math.random() * 0.1 - 0.05)))
          : metric.id === 'network'
            ? Math.floor(metric.value * (1 + (Math.random() * 0.2 - 0.1)))
            : metric.value,
        trend: Math.random() > 0.7 
          ? (Math.random() > 0.5 ? 'up' : 'down') 
          : metric.trend
      })));
      setLastUpdated(new Date());
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '→';
      default:
        return '→';
    }
  };

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-kazakh-gold/20">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-kazakh-darkBlue">{t('devXRMonitor')}</h3>
        <button
          onClick={() => setIsXRMode(!isXRMode)}
          className={`px-3 py-1 text-xs rounded-md ${
            isXRMode ? 'bg-kazakh-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isXRMode ? t('2DMode') : t('xrMode')}
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        {t('lastUpdated')}: {lastUpdated.toLocaleTimeString()}
      </div>
      
      <div className={`grid ${isXRMode ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'} gap-3`}>
        {currentMetrics.map((metric) => (
          <div 
            key={metric.id}
            className={`p-3 rounded-lg border ${
              metric.status === 'critical' ? 'border-red-300 bg-red-50' :
              metric.status === 'warning' ? 'border-yellow-300 bg-yellow-50' :
              'border-green-300 bg-green-50'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">{metric.name}</span>
              <div className="w-2 h-2 rounded-full ${getStatusColor(metric.status)}"></div>
            </div>
            
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold text-kazakh-darkBlue">{metric.value}</span>
              {metric.unit && <span className="text-xs text-gray-500">{metric.unit}</span>}
              <span className="text-xs ml-1">{getTrendIcon(metric.trend)}</span>
            </div>
          </div>
        ))}
      </div>
      
      {isXRMode && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-600">{t('xrModeDescription')}</p>
          <div className="mt-2 h-40 bg-gradient-to-b from-kazakh-blue/10 to-kazakh-gold/10 rounded flex items-center justify-center">
            <span className="text-sm text-kazakh-darkBlue">{t('xrVisualizationPlaceholder')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevXRMonitor;
