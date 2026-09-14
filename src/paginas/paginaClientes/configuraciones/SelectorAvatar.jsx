
export default function SelectorAvatar({ avatarOptions, avatarSeleccionado, setAvatarSeleccionado }) {
  return (
    <div style={{ background: '#f8fafc', padding: '20px 40px', borderBottom: '1px solid #e2e8f0' }}>
      <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>Elige tu estilo de avatar favorito:</p>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {avatarOptions.map((url, index) => (
          <div 
            key={index}
            onClick={() => setAvatarSeleccionado(url)}
            style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              cursor: 'pointer', 
              border: avatarSeleccionado === url ? '3px solid var(--primary-orange)' : '2px solid #cbd5e1',
              background: 'white',
              transition: '0.2s'
            }}
          >
            <img src={url} alt={`Opcion ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </div>
  );
}