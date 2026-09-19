import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, Square, Loader2 } from 'lucide-react';
import {
  isSpeechSynthesisSupported,
  matchSynthesisVoice,
  SPEECH_LANGUAGES
} from '../lib/speech/speechConfig.js';

export default function TextToSpeechButton({
  text = '',
  className = '',
  size = 'sm', // 'sm' | 'md'
  showLabel = true,
}) {
  const { t, i18n } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef(null);

  const supported = isSpeechSynthesisSupported();

  useEffect(() => {
    return () => {
      if (supported && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  const cleanTextForSpeech = (rawText) => {
    if (!rawText) return '';
    // Strip markdown formatting, symbols, brackets, raw json tokens
    return rawText
      .replace(/[*_#`~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[{}\[\]"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleSpeak = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!supported || !text) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech

      const speechText = cleanTextForSpeech(text);
      if (!speechText) return;

      const utterance = new SpeechSynthesisUtterance(speechText);
      const langCode = i18n.language ? i18n.language.split('-')[0] : 'en';

      const voice = matchSynthesisVoice(langCode);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        const entry = SPEECH_LANGUAGES[langCode] || SPEECH_LANGUAGES.en;
        utterance.lang = entry.bcp47;
      }

      utterance.rate = 0.95; // Slightly measured rate for clear agricultural listening
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS playback failed:', err);
      setIsPlaying(false);
    }
  };

  if (!supported || !text) return null;

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
        isPlaying
          ? 'bg-[#1B4D3E] text-white shadow-xs animate-pulse ring-2 ring-[#1B4D3E]/30'
          : 'bg-emerald-50 hover:bg-emerald-100 text-[#1B4D3E] border border-emerald-200/70 hover:border-emerald-300'
      } ${className}`}
      aria-label={isPlaying ? t('common.stop') : t('common.listen')}
      title={isPlaying ? t('common.stop') : t('common.listen')}
    >
      {isPlaying ? (
        <>
          <Square className="size-3 fill-current" />
          {showLabel && <span>{t('common.stop')}</span>}
        </>
      ) : (
        <>
          <Volume2 className="size-3.5 text-[#1B4D3E]" />
          {showLabel && <span>{t('common.listen')}</span>}
        </>
      )}
    </button>
  );
}

