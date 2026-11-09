import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

export default function ChatInput({ onSend, disabled, loading }) {
  const [value, setValue] = useState('');
  const submit = () => {
    const message = value.trim();
    if (!message || disabled || loading) return;
    setValue('');
    onSend(message);
  };

  return (
    <div className="cdi-chat-composer">
      <label className="cdi-chat-sr-only" htmlFor="cdi-chat-input">Escribe tu mensaje para CDISFRUTA IA</label>
      <textarea id="cdi-chat-input" value={value} maxLength={1000} rows={1} placeholder={disabled ? 'Espera a que termine el bloqueo' : 'Escribe tu pregunta…'} disabled={disabled || loading} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); }
      }} />
      <button type="button" aria-label="Enviar mensaje" onClick={submit} disabled={!value.trim() || disabled || loading}>
        <FaPaperPlane aria-hidden="true" />
      </button>
    </div>
  );
}
