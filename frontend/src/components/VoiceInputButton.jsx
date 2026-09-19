import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import {
  isSpeechRecognitionSupported,
  getSpeechRecognitionClass,
  getSpeechRecognitionLang
} from '../lib/speech/speechConfig.js';

export default function VoiceInputButton({
  onTranscript,
  placeholder,
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
}) {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef(null);

  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) { }
      }
    };
  }, []);

  const handleStartListening = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setErrorMessage('');

    if (!supported) {
      setErrorMessage(t('common.speech_unsupported'));
      return;
    }

    const SpeechClass = getSpeechRecognitionClass();
    if (!SpeechClass) {
      setErrorMessage(t('common.speech_unsupported'));
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const langCode = i18n.language ? i18n.language.split('-')[0] : 'en';
      recognition.lang = getSpeechRecognitionLang(langCode);

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText && onTranscript) {
          onTranscript(currentText);
        }

        if (finalTranscript.trim() && onFinalTranscript) {
          onFinalTranscript(finalTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage(t('common.speech_error'));
        } else if (event.error === 'no-speech') {
          setErrorMessage(t('common.no_speech'));
        } else {
          setErrorMessage(`Speech error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to initialize Speech Recognition:', err);
      setErrorMessage(t('common.speech_error'));
      setIsListening(false);
    }
  };

  const handleStopListening = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) { }
    }
    setIsListening(false);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'px-3.5 py-2 text-sm',
  }[size] || 'p-2 text-sm';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={isListening ? handleStopListening : handleStartListening}
        disabled={disabled}
        className={`relative flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${sizeClasses} ${isListening
            ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30 ring-2 ring-rose-400 animate-pulse'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 border border-slate-200/80'
          } ${className}`}
        aria-label={isListening ? t('common.stop') : t('common.speak')}
        title={isListening ? t('common.listening') : t('common.speak')}
      >
        {isListening ? (
          <div className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-white"></span>
            </span>
            <MicOff className="size-4 shrink-0" />
            {size === 'lg' && <span className="font-semibold text-xs tracking-wide">{t('common.listening')}</span>}
          </div>
        ) : (
          <Mic className="size-4 shrink-0 text-[#1B4D3E]" />
        )}
      </button>

      {errorMessage && (
        <div
          role="status"
          aria-live="polite"
          className="absolute left-0 bottom-full mb-1.5 z-50 w-48 p-2 rounded-lg bg-slate-900 text-white text-[11px] shadow-lg animate-in fade-in flex items-start gap-1.5"
        >
          <AlertCircle className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-tight">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-slate-400 hover:text-white cursor-pointer ml-1 text-xs"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

