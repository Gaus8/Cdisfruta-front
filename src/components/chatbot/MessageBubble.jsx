import { Link } from 'react-router-dom';

function renderInline(text) {
  return String(text).split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : <span key={index}>{part}</span>);
}

export default function MessageBubble({ message, onNavigate }) {
  const isSystem = message.role === 'system';
  return (
    <article className={`cdi-chat-message cdi-chat-message--${isSystem ? 'system' : message.role}`}>
      <div className="cdi-chat-message__bubble">
        {message.incidentCount > 0 && <strong className="cdi-chat-message__warning">Aviso {message.incidentCount} de 3</strong>}
        {message.content.split('\n').filter(Boolean).map((line, index) => <p key={index}>{renderInline(line)}</p>)}
        {message.blocked && <strong className="cdi-chat-message__blocked">Chat temporalmente pausado</strong>}
      </div>
      {message.links?.length > 0 && <nav className="cdi-chat-message__links" aria-label="Enlaces relacionados">
        {message.links.map((item) => <Link key={item.to} to={item.to} onClick={onNavigate}>{item.label}</Link>)}
      </nav>}
    </article>
  );
}
