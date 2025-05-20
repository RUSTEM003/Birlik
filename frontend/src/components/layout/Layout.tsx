import React, { useState, useEffect } from "react";
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Birlik Bank</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                to="/"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="ml-2">{t('dashboard')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/transfers"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="ml-2">{t('transfers')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/wallet"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="ml-2">{t('wallet')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/identity"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="ml-2">{t('identity')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/governance"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="ml-2">{t('governance')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/birlik-live"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="ml-2">{t('birlikLiveIntegration')}</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto p-4 border-t">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">{t('welcome')}</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
