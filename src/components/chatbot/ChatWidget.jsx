import { useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCommentDots, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth.js';
import useChat from './useChat.js';
import ChatWindow from './ChatWindow.jsx';
import './ChatWidget.css';
import { useTranslation } from 'react-i18next';

const CHAT_EXCLUDED_PATHS = ['/login', '/registro', '/reset-password', '/validacion'];

export default function ChatWidget() {
  const location = useLocation();
  const { t } = useTranslation('chatbot');
  const { userData } = useAuth();
  const chat = useChat();
  const launcherRef = useRef(null);
  const [open, setOpen] = useState(false);
  const excluded = CHAT_EXCLUDED_PATHS.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  const close = useCallback(() => { setOpen(false); window.setTimeout(() => launcherRef.current?.focus(), 0); }, []);
  if (excluded || location.pathname.startsWith('/dev/')) return null;

  const role = userData?.rol || 'guest';
  return (
    <div className="cdi-chat-root">
      {open && <ChatWindow chat={chat} role={role} onClose={close} onNavigate={close} />}
      <button ref={launcherRef} className={`cdi-chat-launcher${open ? ' is-open' : ''}`} type="button" aria-label={open ? t('close') : t('help')} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <FaTimes aria-hidden="true" /> : <><FaCommentDots aria-hidden="true" /><span>{t('help')}</span></>}
      </button>
    </div>
  );
}
