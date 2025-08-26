import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 12,
    condition: 'Cloudy',
    icon: '☁️',
    location: 'London, UK'
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const weatherTimer = setInterval(() => {
      const conditions = [
        { temp: 12, condition: 'Cloudy', icon: '☁️' },
        { temp: 15, condition: 'Partly Cloudy', icon: '⛅' },
        { temp: 18, condition: 'Sunny', icon: '☀️' },
        { temp: 8, condition: 'Rainy', icon: '🌧️' }
      ];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      setWeather(prev => ({ ...prev, ...randomCondition }));
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="weather-widget px-4 py-2 rounded-lg">
      <div className="flex items-center space-x-3 text-sm">
        <div className="text-kazakh-ink font-medium">
          {formatTime(currentTime)}
        </div>
        <div className="w-px h-4 bg-kazakh-elegantGray/30"></div>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{weather.icon}</span>
          <span className="text-kazakh-ink font-medium">{weather.temperature}°C</span>
        </div>
        <div className="text-kazakh-elegantGray text-xs">
          {weather.location}
        </div>
      </div>
    </div>
  );
}
