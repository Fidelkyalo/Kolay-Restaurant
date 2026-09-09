import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const LanguageSelector = ({ variant = 'dark', direction = 'auto' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);

  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  const isDark = variant === 'dark';

  const filteredLanguages = LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        aria-label={t('footer_language', 'Select Language')}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer select-none ${
          isDark 
            ? 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:border-[#E67E22] hover:bg-white/10' 
            : 'bg-black/5 border-black/10 text-black/70 hover:text-black hover:border-[#E67E22] hover:bg-black/10'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-[#E67E22]" />
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="font-bold">{current.native}</span>
        <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute z-[9999] w-64 max-h-[380px] bg-[#140D06] border border-[#E67E22]/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 flex flex-col animate-in fade-in zoom-in-95 duration-150 ${
            direction === 'down' 
              ? 'top-full mt-2 left-0 sm:left-auto sm:right-0' 
              : 'bottom-full mb-2 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0'
          }`}
        >
          {/* Header & Search */}
          <div className="p-2 border-b border-white/10 mb-1 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E67E22]">
                {t('footer_language', 'Language')} ({LANGUAGES.length})
              </span>
              <span className="text-[10px] text-white/40 font-medium">
                {current.name}
              </span>
            </div>
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full bg-white/5 border border-white/10 focus:border-[#E67E22] text-white text-xs rounded-xl pl-8 pr-7 py-1.5 outline-none transition-colors placeholder:text-white/30"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Languages List */}
          <div className="overflow-y-auto space-y-1 pr-1 custom-scrollbar flex-1 max-h-[260px]">
            {filteredLanguages.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-xs font-medium">
                No matching languages
              </div>
            ) : (
              filteredLanguages.map(lang => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setOpen(false); }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#E67E22]/15 border-[#E67E22]/40 text-[#E67E22] font-bold' 
                        : 'bg-transparent border-transparent text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base shrink-0">{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold leading-tight">{lang.native}</span>
                        <span className="text-[10px] text-white/40 font-medium">{lang.name}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#E67E22] shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
