import { useCallback, useEffect, useState } from 'react';
import { clearChatHistory, fetchChatStatus, readChatHistory, saveChatHistory, sendChatMessage } from './chatService.js';

const WELCOME = { id: 'welcome', role: 'assistant', content: '¡Hola! Soy CDISFRUTA IA. Puedo ayudarte con nuestros productos, compras y navegación por la plataforma.' };

export default function useChat() {
  const [messages, setMessages] = useState(() => [WELCOME, ...readChatHistory().map((item, index) => ({ ...item, id: `history-${index}` }))]);
  const [loading, setLoading] = useState(false);
  const [lock, setLock] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState('');
  const syncLock = useCallback(async () => {
    try {
      const status = await fetchChatStatus();
      setLock(status.lock || null);
      setSecondsLeft(status.lock?.retryAfterSeconds || 0);
    } catch {
      // Fallo temporal de estado no impide abrir el chat.
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchChatStatus().then((status) => {
      if (!mounted) return;
      setLock(status.lock || null);
      setSecondsLeft(status.lock?.retryAfterSeconds || 0);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!lock) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setLock(null);
          fetchChatStatus().then((status) => {
            setLock(status.lock || null);
            setSecondsLeft(status.lock?.retryAfterSeconds || 0);
          }).catch(() => {});
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lock]);

  const send = useCallback(async (rawMessage) => {
    const message = rawMessage.trim();
    if (!message || loading || lock) return;
    setError('');
    setLoading(true);
    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: message };
    setMessages((current) => [...current, userMessage]);
    try {
      const history = messages.filter((item) => ['user', 'assistant'].includes(item.role)).slice(-10).map(({ role, content }) => ({ role, content }));
      const response = await sendChatMessage(message, history);
      if (response.blocked) {
        setLock({ blockedUntil: response.blockedUntil });
        setSecondsLeft(response.retryAfterSeconds || 600);
      }
      const content = response.message || 'No recibí una respuesta. Inténtalo de nuevo.';
      setMessages((current) => {
        const safeCurrent = response.moderation ? current.filter((item) => item.id !== userMessage.id) : current;
        const updated = [...safeCurrent, { id: `assistant-${Date.now()}`, role: response.moderation || response.blocked ? 'system' : 'assistant', content, links: response.links || [], moderation: response.moderation, incidentCount: response.incidentCount, blocked: response.blocked }];
        saveChatHistory(updated);
        return updated;
      });
    } catch (requestError) {
      const payload = requestError.response?.data;
      if (payload?.blocked || payload?.retryAfterSeconds >= 60) {
        setLock({ blockedUntil: payload.blockedUntil || Date.now() + payload.retryAfterSeconds * 1000 });
        setSecondsLeft(payload.retryAfterSeconds);
      }
      if (payload?.message) {
        setMessages((current) => [...current, { id: `system-${Date.now()}`, role: 'system', content: payload.message, moderation: payload.moderation, incidentCount: payload.incidentCount, blocked: payload.blocked }]);
      } else {
        setError('No se pudo enviar. Revisa tu conexión e inténtalo otra vez.');
      }
    } finally {
      setLoading(false);
    }
  }, [loading, lock, messages]);

  const reset = useCallback(() => {
    clearChatHistory();
    setMessages([WELCOME]);
    setError('');
  }, []);

  return { messages, loading, lock, secondsLeft, error, send, reset, syncLock };
}
