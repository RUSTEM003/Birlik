import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('language')}:</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'ru')}
        className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer"
      >
        <option value="en">{t('english')}</option>
        <option value="ru">{t('russian')}</option>
      </select>
    </div>
  );
}
