
import React from 'react';
import { Language } from '../types';

interface Props {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageToggle: React.FC<Props> = ({ lang, setLang }) => {
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className="flex items-center space-x-2 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
    >
      <span className="w-5 h-5 flex items-center justify-center bg-emerald-600 text-white rounded-full text-[10px]">
        {lang === 'en' ? 'AR' : 'EN'}
      </span>
      <span>{lang === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
};

export default LanguageToggle;
