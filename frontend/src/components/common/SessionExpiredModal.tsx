import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function SessionExpiredModal({ isOpen, onClose, onLogin }: SessionExpiredModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('sessionExpired')}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {t('sessionExpiredMessage')}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={onLogin}
              className="flex-1 bg-kazakh-blue text-white px-4 py-2 rounded-md hover:bg-kazakh-darkBlue transition-colors"
            >
              {t('loginAgain')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
