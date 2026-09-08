import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const LanguageSelector = ({ variant = 'dark' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isDark = variant === 'dark';

  return (
    <div ref={ref} className="relative" style={{ display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={t('footer_language')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '50px',
          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '0.04em',
          transition: 'all 0.2s',
          userSelect: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
          e.currentTarget.style.borderColor = '#E67E22';
          e.currentTarget.style.color = isDark ? '#fff' : '#000';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
          e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)';
        }}
      >
        <Globe size={13} />
        <span>{current.flag}</span>
        <span>{current.native}</span>
        <ChevronDown size={11} style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: '200px',
            maxHeight: '320px',
            overflowY: 'auto',
            background: '#1a1209',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
            zIndex: 9999,
            padding: '8px',
            animation: 'fadeInUp 0.15s ease',
          }}
        >
          <p style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '4px 10px 8px', userSelect: 'none' }}>
            {t('footer_language')}
          </p>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: 'none',
                background: lang.code === language ? 'rgba(230,126,34,0.15)' : 'transparent',
                color: lang.code === language ? '#E67E22' : 'rgba(255,255,255,0.75)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: lang.code === language ? '800' : '500',
                transition: 'all 0.15s',
                textAlign: 'left',
                gap: '8px',
              }}
              onMouseEnter={e => {
                if (lang.code !== language) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                if (lang.code !== language) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>{lang.flag}</span>
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span>{lang.native}</span>
                  <span style={{ fontSize: '10px', opacity: 0.5, fontWeight: '400' }}>{lang.name}</span>
                </span>
              </span>
              {lang.code === language && <Check size={13} />}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LanguageSelector;
