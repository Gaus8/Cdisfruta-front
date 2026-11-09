import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function ChatInput({ onSend, disabled, loading }) {
  const { t } = useTranslation('chatbot');
  const [value, setValue] = useState('');
  const submit = () => {
    const message = value.trim();
    if (!message || disabled || loading) return;
    setValue('');
    onSend(message);
  };

  return (
    <div className="cdi-chat-composer">
      <label className="cdi-chat-sr-only" htmlFor="cdi-chat-input">{t('inputLabel')}</label>
      <textarea id="cdi-chat-input" value={value} maxLength={1000} rows={1} placeholder={disabled ? t('waitForUnlock') : t('input')} disabled={disabled || loading} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); }
      }} />
      <button type="button" aria-label={t('send')} onClick={submit} disabled={!value.trim() || disabled || loading}>
        <FaPaperPlane aria-hidden="true" />
      </button>
    </div>
  );
}
