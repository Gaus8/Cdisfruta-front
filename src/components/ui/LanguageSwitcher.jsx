import { useEffect, useId, useRef, useState } from 'react';
import { FaCheck, FaChevronDown, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage, supportedLanguages } from '../../i18n/index.js';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ className = '' }) {
  const { t, i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const activeLanguage = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'es';
  const languageNames = { es: t('language.spanish'), en: t('language.english') };

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const toggleMenu = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      window.requestAnimationFrame(() => optionRefs.current[event.key === 'ArrowUp' ? 1 : 0]?.focus());
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
    setOpen((value) => !value);
  };

  const handleOptionKeyDown = (event, index) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      optionRefs.current[(index + direction + supportedLanguages.length) % supportedLanguages.length]?.focus();
    }
  };

  const chooseLanguage = async (language) => {
    await changeAppLanguage(language);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={`cdi-lang ${className}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="cdi-lang__trigger"
        aria-label={t('language.active', { language: languageNames[activeLanguage] })}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={toggleMenu}
      >
        <FaGlobe aria-hidden="true" />
        <span>{activeLanguage.toUpperCase()}</span>
        <FaChevronDown className="cdi-lang__chevron" aria-hidden="true" />
      </button>
      {open && <div id={menuId} className="cdi-lang__menu" role="menu" aria-label={t('language.select')}>
        {supportedLanguages.map((language, index) => (
          <button
            key={language}
            ref={(element) => { optionRefs.current[index] = element; }}
            type="button"
            role="menuitemradio"
            aria-checked={activeLanguage === language}
            lang={language}
            className="cdi-lang__option"
            onClick={() => chooseLanguage(language)}
            onKeyDown={(event) => handleOptionKeyDown(event, index)}
          >
            <span>{language === 'es' ? `${languageNames.es} – ES` : `${languageNames.en} – EN`}</span>
            {activeLanguage === language && <FaCheck aria-hidden="true" />}
          </button>
        ))}
      </div>}
    </div>
  );
}
