import ar from './ar';
import en from './en';

const translations = { ar, en };

export function t(key, lang = 'ar') {
  return translations[lang]?.[key] ?? translations['ar']?.[key] ?? key;
}

export { ar, en };
export default translations;
