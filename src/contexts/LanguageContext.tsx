import React, { createContext, useState, useEffect, ReactNode } from 'react';
import en from '../locales/en.json';
import zh from '../locales/zh.json';

type Translations = { [key: string]: string };

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const translations: { [key: string]: Translations } = { en, zh };

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getInitialLanguage = () => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && ['en', 'zh'].includes(savedLang)) return savedLang;
    return navigator.language.startsWith('zh') ? 'zh' : 'en';
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => translations[language]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
