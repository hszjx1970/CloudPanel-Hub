import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Translations = { [key: string]: string };

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState<{ [key: string]: Translations } | null>(null);

  const getInitialLanguage = () => {
    const savedLang = localStorage.getItem('language');
    // Ensure the saved language is one of the supported ones
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      return savedLang;
    }
    // Detect browser language
    const browserLang = navigator.language.split(/[-_]/)[0];
    return browserLang === 'zh' ? 'zh' : 'en';
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const [enResponse, zhResponse] = await Promise.all([
          fetch('./locales/en.json'),
          fetch('./locales/zh.json')
        ]);
        if (!enResponse.ok || !zhResponse.ok) {
            throw new Error('Failed to fetch translation files');
        }
        const enData = await enResponse.json();
        const zhData = await zhResponse.json();
        setTranslations({ en: enData, zh: zhData });
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to empty objects to prevent app crash
        setTranslations({ en: {}, zh: {} });
      }
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    if (!translations) {
      return key; // Return key as fallback while loading
    }
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
