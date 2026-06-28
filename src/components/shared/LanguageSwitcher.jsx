import { Globe } from 'lucide-react';
import { useLang } from '../../contexts/LanguageContext';

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useLang();

  const toggle = () => setLang(lang === 'ar' ? 'en' : 'ar');

  if (compact) return (
    <button onClick={toggle}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
      <Globe className="w-3.5 h-3.5" />
      {lang === 'ar' ? 'EN' : 'ع'}
    </button>
  );

  return (
    <button onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
      <Globe className="w-4 h-4" />
      {lang === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}
