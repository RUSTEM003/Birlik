import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import useSound from "use-sound";
import ttsSound from "../../assets/voice-alert.mp3";
import { useLanguage } from "../../contexts/LanguageContext";
import { useWebSocket } from "../../services/websocket";
import { 
  getUserXP, 
  getAIAnalytics, 
  getMissions, 
  getUserNFTs 
} from "../../services/api";

import Avatar3D from "../ai/Avatar3D";
import BonusNFTDisplay from "../xp/BonusNFTDisplay";
import MissionCards from "../missions/MissionCards";
import SmartProgress from "../xp/SmartProgress";
import AIAgent from "../ai/AIAgent";
import XRViewer from "../xr/XRViewer";
import XPInventory from "../xp/XPInventory";
import ZKernelFeed from "../xp/ZKernelFeed";
import DevXRMonitor from "../xr/DevXRMonitor";
import XPExchange from "../xp/XPExchange";

const socket = io("https://ai.birliksocket.com", { transports: ["websocket"] });

const API_KEYS = {
  weather: "YOUR_OPENWEATHERMAP_API_KEY",
  coingecko: "https://api.coingecko.com/api/v3/simple/price",
  exchangerate: "https://api.exchangerate.host/latest",
  metal: "https://www.goldapi.io/api/XAU/USD",
  bankApi: "https://api.birlikbank.com",
  logisticsApi: "https://api.birliklogistics.com",
  bonusApi: "https://api.birlikbonus.com",
  aiAnalytics: "https://api.birlikai.com/insight",
  notificationApi: "https://api.birliknotify.com",
  langApi: "https://api.birliklang.com",
  tts: "https://api.birlikai.com/tts"
};

const LANG_OPTIONS = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "kk", label: "Қазақша" }
];

export default function DashboardHeaderAI() {
  const { language, setLanguage, t } = useLanguage();
  const { messages: wsMessages } = useWebSocket();
  
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<any>({});
  const [prices, setPrices] = useState<any>({});
  const [bankStatus, setBankStatus] = useState<any>({});
  const [logisticsStatus, setLogisticsStatus] = useState<any>({});
  const [aiInsight, setAiInsight] = useState("");
  const [xpStatus, setXpStatus] = useState<any>({
    total: 0,
    level: 1,
    inventory: [],
    missions: [],
    actions: []
  });
  const [theme, setTheme] = useState("dark");
  const [play] = useSound(ttsSound);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const weatherRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=${language}&appid=${API_KEYS.weather}`
          );
          setWeather(weatherRes.data);
        });

        const [cryptoRes, fxRes, metalRes, bankRes, logisticsRes, aiRes, xpRes] = await Promise.all([
          axios.get(`${API_KEYS.coingecko}?ids=bitcoin,ethereum,tether&vs_currencies=usd`),
          axios.get(`${API_KEYS.exchangerate}?base=USD&symbols=KZT,RUB,EUR,GBP`),
          axios.get(API_KEYS.metal, { headers: { "x-access-token": "YOUR_GOLDAPI_KEY" } }),
          axios.get(`${API_KEYS.bankApi}/status`),
          axios.get(`${API_KEYS.logisticsApi}/summary`),
          getAIAnalytics(),
          getUserXP()
        ]);

        setPrices({
          bitcoin: cryptoRes.data.bitcoin.usd,
          ethereum: cryptoRes.data.ethereum.usd,
          tether: cryptoRes.data.tether.usd,
          usdKzt: fxRes.data.rates.KZT,
          usdRub: fxRes.data.rates.RUB,
          usdEur: fxRes.data.rates.EUR,
          usdGbp: fxRes.data.rates.GBP,
          gold: metalRes.data.price
        });

        setBankStatus(bankRes.data);
        setLogisticsStatus(logisticsRes.data);
        setAiInsight(aiRes.summary);
        setXpStatus(xpRes);

        const [missionsRes, nftsRes] = await Promise.all([
          getMissions(),
          getUserNFTs()
        ]);

        setXpStatus(prev => ({
          ...prev,
          missions: missionsRes.missions || [],
          nfts: nftsRes.nfts || []
        }));

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Birlik Обновление", {
            body: `XP: ${xpRes.total}, AI: ${aiRes.summary}`
          });
          play();
          await axios.post(API_KEYS.tts, { text: aiRes.summary, lang: language });
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [language, play]);

  useEffect(() => {
    const aiFeedMessages = wsMessages['ai-feed'];
    if (aiFeedMessages.length > 0) {
      const latestMessage = aiFeedMessages[aiFeedMessages.length - 1];
      setAiInsight(latestMessage.message);
    }
    
    const xpUpdateMessages = wsMessages['xp-update'];
    if (xpUpdateMessages.length > 0) {
      const latestXpUpdate = xpUpdateMessages[xpUpdateMessages.length - 1];
      setXpStatus(prev => ({
        ...prev,
        ...latestXpUpdate.data
      }));
    }
  }, [wsMessages]);

  return (
    <div className={`w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} py-2 px-4 text-sm flex flex-col md:flex-row md:justify-between md:items-center`}>
      <div className="flex flex-col gap-2 w-full md:w-2/3">
        <strong>
          {time.toLocaleDateString(language === "ru" ? "ru-RU" : language === "kk" ? "kk-KZ" : "en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </strong>, {time.toLocaleTimeString(language === "ru" ? "ru-RU" : language === "kk" ? "kk-KZ" : "en-US")}

        {weather.name && (
          <span>
            🌦️ {weather.name}: {Math.round(weather.main?.temp)}°C, {weather.weather?.[0]?.description}
          </span>
        )}

        <div className="overflow-hidden whitespace-nowrap animate-marquee">
          📈 BTC: ${prices.bitcoin} | ETH: ${prices.ethereum} | GOLD: ${prices.gold}$ | USD/KZT: {prices.usdKzt} | 
          🏦 {t('bank')}: {bankStatus.health} | 🚚 {t('routes')}: {logisticsStatus.active_routes} | 
          🧠 AI: {aiInsight} | 🏅 XP: {xpStatus.total}
        </div>

        <div className="flex gap-2 mt-2">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ru' | 'kk')} 
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            {LANG_OPTIONS.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>

          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="bg-blue-600 text-white px-2 py-1 rounded"
          >
            {theme === "dark" ? "☀️ " + t('dayMode') : "🌙 " + t('nightMode')}
          </button>
        </div>

        <BonusNFTDisplay xp={xpStatus.total} nfts={xpStatus.nfts} />
        <SmartProgress xp={xpStatus.total} level={xpStatus.level} />
        <XPInventory inventory={xpStatus.inventory} />
        <MissionCards missions={xpStatus.missions} />
        <XPExchange xp={xpStatus.total} />
        <XRViewer />
        <ZKernelFeed xp={xpStatus.total} actions={xpStatus.actions} />
        <DevXRMonitor />
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center">
        <Avatar3D emotion="engaged" lang={language} insight={aiInsight} xp={xpStatus.total} />
        <AIAgent locale={language} insight={aiInsight} />
      </div>
    </div>
  );
}
