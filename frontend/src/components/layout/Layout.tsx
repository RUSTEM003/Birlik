import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-kazakh-blue via-kazakh-light to-kazakh-gold">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-kazakh-darkBlue to-kazakh-blue shadow-lg border-r border-kazakh-gold">
        <div className="p-6 flex items-center justify-center">
          <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-12 h-12 mr-2"></div>
          <h1 className="text-2xl font-bold text-kazakh-gold">Цифровой Банк</h1>
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">{t('dashboard')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/transfers"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">{t('transfers')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/wallet"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">{t('wallet')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/identity"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">{t('identity')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/governance"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">{t('governance')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/birlik-live"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">{t('birlikLiveIntegration')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/ar-dashboard"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">{t('arFinancialDashboard')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/agi-portal"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">AGI Defense Portal</span>
              </Link>
            </li>
            <li>
              <Link
                to="/live-demos"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">Live Demo Arena</span>
              </Link>
            </li>
            <li>
              <Link
                to="/evidence-vault"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">Evidence Vault</span>
              </Link>
            </li>
            <li>
              <Link
                to="/gold-answers"
                className="flex items-center px-6 py-3 text-white hover:bg-kazakh-blue/30 hover:text-kazakh-gold border-l-4 border-transparent hover:border-kazakh-gold transition-all duration-200"
              >
                <span className="ml-2">Gold-Answer Library</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto p-4 border-t border-kazakh-gold/30">
          <div className="bg-kazakh-ornament bg-contain bg-no-repeat bg-center w-full h-24 mb-4 opacity-30 animate-ornament-pulse"></div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gradient-to-r from-kazakh-blue to-kazakh-darkBlue shadow-md border-b border-kazakh-gold/50">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center">
              <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-8 h-8 mr-2"></div>
              <h2 className="text-xl font-semibold text-white">{t('welcome')}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-kazakh-darkBlue bg-kazakh-gold rounded-md hover:bg-kazakh-darkGold transition-colors duration-200"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-kazakh-pattern bg-opacity-5 relative">
          {/* Centered Kazakh Emblem and Ornaments */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-kazakh-emblem bg-contain bg-no-repeat bg-center w-80 h-80 opacity-25 animate-ornament-pulse"></div>
          </div>
          <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
            <div className="bg-kazakh-ornament bg-contain bg-no-repeat bg-center w-full h-32 opacity-30 animate-ornament-pulse"></div>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
            <div className="bg-kazakh-ornament bg-contain bg-no-repeat bg-center w-full h-32 opacity-30 animate-ornament-pulse"></div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-kazakh-gold/20 relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
