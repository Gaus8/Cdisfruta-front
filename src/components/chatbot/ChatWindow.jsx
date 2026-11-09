import { useEffect, useRef } from 'react';
import { FaMinus, FaPlus, FaRedoAlt, FaTimes } from 'react-icons/fa';
import MessageBubble from './MessageBubble.jsx';
import ChatInput from './ChatInput.jsx';
import { useTranslation } from 'react-i18next';

const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function ChatWindow({ chat, role, onClose, onNavigate }) {
  const { t } = useTranslation('chatbot');
  const logRef = useRef(null);
  const suggestions = role === 'admin' || role === 'catalogo' || role === 'logistica'
    ? [t('suggestions.addProduct'), t('suggestions.seeOrders')]
    : [t('suggestions.order'), t('suggestions.products'), t('suggestions.orderStatus')];

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [chat.messages, chat.loading, chat.secondsLeft]);

  useEffect(() => {
    document.getElementById('cdi-chat-input')?.focus();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <section className="cdi-chat-window" role="dialog" aria-modal="false" aria-labelledby="cdi-chat-title">
      <header className="cdi-chat-header">
        <span className="cdi-chat-avatar" aria-hidden="true"><img src="/assets/images/cdisfruta-ia.webp" alt="" onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.nextElementSibling.hidden = false; }} /><svg hidden viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-5 4v-4.2a2.5 2.5 0 0 1-2-2.3z" /></svg></span>
        <div className="cdi-chat-header__text"><h2 id="cdi-chat-title">CDISFRUTA IA</h2><span><i /> {t('online')}</span></div>
        <button type="button" aria-label={t('newConversation')} title={t('newConversation')} onClick={chat.reset}><FaRedoAlt /></button>
        <button type="button" aria-label={t('minimize')} onClick={onClose}><FaMinus /></button>
        <button type="button" aria-label={t('close')} onClick={onClose}><FaTimes /></button>
      </header>

      <div className="cdi-chat-messages" role="log" aria-live="polite" aria-relevant="additions text" ref={logRef}>
        {chat.messages.map((message) => <MessageBubble key={message.id} message={message} onNavigate={onNavigate} />)}
        {chat.loading && <div className="cdi-chat-typing" role="status"><span /><span /><span /> <span>{t('typing')}</span></div>}
        {chat.error && <div className="cdi-chat-error" role="alert">{chat.error} <button type="button" onClick={chat.syncLock}>{t('retry')}</button></div>}
      </div>

      {chat.messages.length <= 1 && !chat.lock && <div className="cdi-chat-suggestions" aria-label={t('suggestedQuestions')}>{suggestions.map((item) => <button type="button" key={item} onClick={() => chat.send(item)} disabled={chat.loading}>{item}</button>)}</div>}
      {chat.lock && <div className="cdi-chat-lock" role="status"><strong>{t('paused')}</strong><span>{t('resumeIn', { time: formatTime(chat.secondsLeft) })}</span></div>}
      <ChatInput onSend={chat.send} loading={chat.loading} disabled={Boolean(chat.lock)} />
      <p className="cdi-chat-footnote">{t('privateData')}</p>
    </section>
  );
}
