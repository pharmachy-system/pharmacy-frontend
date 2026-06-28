import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const DEFAULT_FLAGS = {
  aiChat:           true,
  aiSymptomChecker: true,
  aiMedicineAssist: true,
  drugInteractions: true,
  smartSearch:      true,
  prescriptionOCR:  true,
  passkeys:         true,
  guestShopping:    true,
  nafathLogin:      true,
  darkMode:         true,
  hasAIKey:         false,
};

const FlagContext = createContext({ flags: DEFAULT_FLAGS, loading: true });

export function FeatureFlagProvider({ children }) {
  const [flags, setFlags]     = useState(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const { data } = await axios.get(`${base}/app/config`, { timeout: 5000 });
        if (data?.config?.features) {
          setFlags(f => ({ ...f, ...data.config.features }));
        }
      } catch {
        // Fall back to defaults — app still works without feature flags
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <FlagContext.Provider value={{ flags, loading }}>
      {children}
    </FlagContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FlagContext);
}

export function useFlag(name) {
  const { flags } = useFeatureFlags();
  return flags[name] ?? true;
}
