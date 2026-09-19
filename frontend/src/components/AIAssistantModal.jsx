import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, X, Send, Bot, User, Loader2, Volume2, HelpCircle
} from 'lucide-react';
import VoiceInputButton from './VoiceInputButton.jsx';
import TextToSpeechButton from './TextToSpeechButton.jsx';
import { aiService } from '../lib/api/services.js';

export default function AIAssistantModal({ isOpen, onClose, role = 'farmer' }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: role === 'farmer'
        ? t('dashboard.farmer_subhead')
        : t('dashboard.buyer_subhead'),
      time: 'Just now'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'en';

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const text = (textToSend || query).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const result = await aiService.askAssistant(text, role, currentLang);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: result.response || result.message || 'No response generated.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Could not connect to AI service. Please check your network and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (transcriptText) => {
    setQuery(transcriptText);
  };

  const sampleQueries = [
    t('assistant.query_price'),
    t('assistant.query_disease'),
    t('assistant.query_harvest'),
    t('assistant.query_buyer'),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[700px] border border-slate-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#1B4D3E] to-[#266854] text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 text-white">
              <Bot className="size-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight flex items-center gap-2">
                {t('assistant.modal_title')}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  {currentLang.toUpperCase()}
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-100/80">
                {t('assistant.modal_subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={t('common.close')}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="size-7 rounded-lg bg-[#1B4D3E] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <Sparkles className="size-3.5" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#1B4D3E] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/70 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div className={`mt-2 flex items-center justify-between gap-2 pt-1 border-t ${
                  msg.sender === 'user' ? 'border-white/20 text-white/70' : 'border-slate-100 text-slate-400'
                } text-[10px]`}>
                  <span>{msg.time}</span>
                  {msg.sender === 'bot' && (
                    <TextToSpeechButton text={msg.text} showLabel={false} size="sm" />
                  )}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="size-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  <User className="size-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 justify-start items-center">
              <div className="size-7 rounded-lg bg-[#1B4D3E] text-white flex items-center justify-center shrink-0">
                <Loader2 className="size-3.5 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-xs flex items-center gap-2 text-xs text-slate-500">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>AgriFlow AI is analyzing in {currentLang.toUpperCase()}...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sample Prompts */}
        <div className="px-4 py-2 bg-white border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-1.5">
            <HelpCircle className="size-3 text-[#1B4D3E]" />
            <span>{t('assistant.quick_queries')}</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(q);
                  handleSend(q);
                }}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-[#1B4D3E] text-slate-600 text-[11px] font-medium transition-colors border border-slate-200/60 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Voice Controls */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('assistant.input_placeholder')}
                className="w-full pl-3.5 pr-11 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E]/30 focus:border-[#1B4D3E] text-slate-800 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-1.5 flex items-center">
                <VoiceInputButton
                  onTranscript={handleVoiceTranscript}
                  size="sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="flex items-center justify-center size-10 rounded-xl bg-[#1B4D3E] hover:bg-[#153e32] disabled:opacity-50 text-white shadow-sm transition-all cursor-pointer shrink-0"
              aria-label={t('common.submit')}
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

