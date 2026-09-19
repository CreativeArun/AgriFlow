import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import pa from './locales/pa.json';
import bn from './locales/bn.json';
import mr from './locales/mr.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import gu from './locales/gu.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN' },
];

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  pa: { translation: pa },
  bn: { translation: bn },
  mr: { translation: mr },
  te: { translation: te },
  ta: { translation: ta },
  gu: { translation: gu },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'pa', 'bn', 'mr', 'te', 'ta', 'gu'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'agriflow_language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values safely
    },
  });

export default i18n;

