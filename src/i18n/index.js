import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esCommon from './locales/es/common.json';
import enCommon from './locales/en/common.json';
import esLanding from './locales/es/landing.json';
import enLanding from './locales/en/landing.json';
import esShop from './locales/es/shop.json';
import enShop from './locales/en/shop.json';
import esAuth from './locales/es/auth.json';
import enAuth from './locales/en/auth.json';
import esUser from './locales/es/user.json';
import enUser from './locales/en/user.json';
import esOrders from './locales/es/orders.json';
import enOrders from './locales/en/orders.json';
import esAdmin from './locales/es/admin.json';
import enAdmin from './locales/en/admin.json';
import esChatbot from './locales/es/chatbot.json';
import enChatbot from './locales/en/chatbot.json';
import esErrors from './locales/es/errors.json';
import enErrors from './locales/en/errors.json';

export const LANGUAGE_STORAGE_KEY = 'cdisfruta.language';
export const supportedLanguages = ['es', 'en'];

const getInitialLanguage = () => {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (supportedLanguages.includes(saved)) return saved;
  } catch {
    // Use browser language if storage is blocked.
  }
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return browserLanguages.some((language) => String(language).toLowerCase().startsWith('en')) ? 'en' : 'es';
};

const resources = {
  es: { common: esCommon, landing: esLanding, shop: esShop, auth: esAuth, user: esUser, orders: esOrders, admin: esAdmin, chatbot: esChatbot, errors: esErrors },
  en: { common: enCommon, landing: enLanding, shop: enShop, auth: enAuth, user: enUser, orders: enOrders, admin: enAdmin, chatbot: enChatbot, errors: enErrors },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'es',
  supportedLngs: supportedLanguages,
  defaultNS: 'common',
  ns: ['common', 'landing', 'shop', 'auth', 'user', 'orders', 'admin', 'chatbot', 'errors'],
  interpolation: { escapeValue: false },
  initImmediate: false,
});

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = supportedLanguages.includes(language) ? language : 'es';
  document.title = i18n.t('meta.title', { ns: 'common' });
});
document.documentElement.lang = i18n.resolvedLanguage || i18n.language || 'es';
document.title = i18n.t('meta.title', { ns: 'common' });

export const changeAppLanguage = async (language) => {
  const nextLanguage = supportedLanguages.includes(language) ? language : 'es';
  try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage); } catch { /* Language still changes for this session. */ }
  await i18n.changeLanguage(nextLanguage);
};

export default i18n;
