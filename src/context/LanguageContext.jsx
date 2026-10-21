import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext();

// Deep merge helper ensuring every key from the fallback exists in active translation
function deepMerge(target, fallback) {
  if (!target) return fallback || {};
  if (!fallback) return target;
  const result = { ...target };
  for (const key of Object.keys(fallback)) {
    if (result[key] === undefined) {
      result[key] = fallback[key];
    } else if (
      typeof result[key] === 'object' &&
      result[key] !== null &&
      !Array.isArray(result[key]) &&
      typeof fallback[key] === 'object' &&
      fallback[key] !== null &&
      !Array.isArray(fallback[key])
    ) {
      result[key] = deepMerge(result[key], fallback[key]);
    }
  }
  return result;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sehat_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('sehat_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const activeLangDict = TRANSLATIONS[language] || TRANSLATIONS.en;
  const t = deepMerge(activeLangDict, TRANSLATIONS.en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
