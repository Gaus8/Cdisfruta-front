export const localeForLanguage = (language = 'es') => language?.startsWith('en') ? 'en-US' : 'es-CO';

export const formatNumber = (value, language) => new Intl.NumberFormat(localeForLanguage(language)).format(Number(value || 0));

export const formatCurrency = (value, language) => new Intl.NumberFormat(localeForLanguage(language), {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const formatDate = (value, language, options = { dateStyle: 'medium' }) => value
  ? new Intl.DateTimeFormat(localeForLanguage(language), options).format(new Date(value))
  : '';
