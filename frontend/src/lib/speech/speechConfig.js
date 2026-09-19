/**
 * AgriFlow Speech & Voice Recognition Configuration
 * Maps application language codes to BCP 47 speech recognition and synthesis locales.
 */

export const SPEECH_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    bcp47: 'en-IN',
    speechRecognitionLocales: ['en-IN', 'en-US', 'en-GB'],
    ttsLocales: ['en-IN', 'en_IN', 'en-US', 'en-GB'],
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bcp47: 'hi-IN',
    speechRecognitionLocales: ['hi-IN', 'hi'],
    ttsLocales: ['hi-IN', 'hi_IN', 'hi'],
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    bcp47: 'pa-IN',
    speechRecognitionLocales: ['pa-IN', 'pa-Guru-IN', 'pa'],
    ttsLocales: ['pa-IN', 'pa_IN', 'pa'],
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    bcp47: 'bn-IN',
    speechRecognitionLocales: ['bn-IN', 'bn-BD', 'bn'],
    ttsLocales: ['bn-IN', 'bn_IN', 'bn'],
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    bcp47: 'mr-IN',
    speechRecognitionLocales: ['mr-IN', 'mr'],
    ttsLocales: ['mr-IN', 'mr_IN', 'mr'],
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    bcp47: 'te-IN',
    speechRecognitionLocales: ['te-IN', 'te'],
    ttsLocales: ['te-IN', 'te_IN', 'te'],
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    bcp47: 'ta-IN',
    speechRecognitionLocales: ['ta-IN', 'ta-LK', 'ta'],
    ttsLocales: ['ta-IN', 'ta_IN', 'ta'],
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    bcp47: 'gu-IN',
    speechRecognitionLocales: ['gu-IN', 'gu'],
    ttsLocales: ['gu-IN', 'gu_IN', 'gu'],
  },
};

/**
 * Check if Web Speech Recognition is supported in the current browser
 */
export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Check if Web Speech Synthesis (TTS) is supported in the current browser
 */
export function isSpeechSynthesisSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);
}

/**
 * Get Speech Recognition constructor
 */
export function getSpeechRecognitionClass() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Get the best BCP 47 locale for speech recognition based on language code
 */
export function getSpeechRecognitionLang(langCode = 'en') {
  const norm = (langCode || 'en').toLowerCase().split('-')[0];
  const entry = SPEECH_LANGUAGES[norm] || SPEECH_LANGUAGES.en;
  return entry.bcp47;
}

/**
 * Match the best available TTS voice for a given language code
 */
export function matchSynthesisVoice(langCode = 'en') {
  if (!isSpeechSynthesisSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const norm = (langCode || 'en').toLowerCase().split('-')[0];
  const entry = SPEECH_LANGUAGES[norm] || SPEECH_LANGUAGES.en;
  const preferredLocales = entry.ttsLocales || [entry.bcp47];

  // 1. Exact or prefix match with preferred locales
  for (const loc of preferredLocales) {
    const found = voices.find(v => v.lang.toLowerCase() === loc.toLowerCase() || v.lang.toLowerCase().replace('_', '-').startsWith(loc.toLowerCase().replace('_', '-')));
    if (found) return found;
  }

  // 2. Match by lang code prefix (e.g. 'hi', 'ta', 'mr')
  const langMatch = voices.find(v => v.lang.toLowerCase().startsWith(norm));
  if (langMatch) return langMatch;

  // 3. Fallback to default or first voice
  return voices.find(v => v.default) || voices[0] || null;
}

