import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'alansar_lang';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(STORAGE_KEY) || 'ar');

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const isRTL = lang === 'ar';
  const dir   = isRTL ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
