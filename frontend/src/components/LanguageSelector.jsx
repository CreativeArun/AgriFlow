import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n.js';

export default function LanguageSelector({ className = '' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangCode = i18n.language ? i18n.language.split('-')[0] : 'en';
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLangCode) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code) => {
    i18n.changeLanguage(code);
    try {
      localStorage.setItem('agriflow_language', code);
    } catch (e) { }
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white/95 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium shadow-xs transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E]/30"
        aria-label="Select platform language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="size-4 text-[#1B4D3E]" />
        <span className="font-semibold text-slate-800">{currentLang.nativeName}</span>
        <ChevronDown className={`size-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-48 sm:w-52 rounded-xl bg-white shadow-xl ring-1 ring-black/10 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-100">
            Select Language / भाषा
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLangCode;
              return (
                <button
                  key={lang.code}
                  role="menuitem"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B4D3E]/10 text-[#1B4D3E] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-snug">{lang.nativeName}</span>
                    <span className="text-[11px] text-slate-400 leading-tight">{lang.name}</span>
                  </div>
                  {isSelected && <Check className="size-4 text-[#1B4D3E] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

