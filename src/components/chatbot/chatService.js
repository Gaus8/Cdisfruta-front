import { apiAxios } from '../../services/api/client.js';

const STORAGE_KEY = 'cdisfruta_ia_history_v1';
const MAX_HISTORY = 10;

const mayContainSensitiveData = (text) => /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
  || /(?:\+?57[\s.-]?)?3\d{2}[\s.-]?\d{3}[\s.-]?\d{4}\b/.test(text)
  || /\b(?:password|contrasena|token|api[_ -]?key|secret)\s*[:=]?\s*\S+/i.test(text);

export const readChatHistory = () => {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter((item) => ['user', 'assistant'].includes(item?.role) && item.id !== 'welcome' && typeof item.content === 'string' && !mayContainSensitiveData(item.content)).slice(-MAX_HISTORY)
      : [];
  } catch {
    return [];
  }
};

export const saveChatHistory = (messages) => {
  try {
    const safeHistory = messages
      .filter((item) => ['user', 'assistant'].includes(item.role) && item.id !== 'welcome' && typeof item.content === 'string' && !mayContainSensitiveData(item.content))
      .slice(-MAX_HISTORY);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeHistory));
  } catch {
    // El chat sigue funcionando aunque el navegador bloquee sessionStorage.
  }
};

export const clearChatHistory = () => {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* Ignore storage restrictions. */ }
};

export const sendChatMessage = async (message, history, lang = 'es') => {
  const { data } = await apiAxios.post('/chat', { message, history, lang });
  return data;
};

export const fetchChatStatus = async () => {
  const { data } = await apiAxios.get('/chat/status');
  return data;
};
