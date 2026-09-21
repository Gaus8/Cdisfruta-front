import { useRef } from "react";
import { FaUpload, FaUser } from "react-icons/fa";

export default function SelectorAvatar({ avatarOptions, avatarSeleccionado, setAvatarSeleccionado }) {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido.");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setAvatarSeleccionado(imageUrl);
      
      // Opcional: Si necesitas el archivo binario para enviarlo al backend, 
      // puedes pasarlo mediante una prop adicional (ej. onFileSelect(file))
    }
  };

  return (
    <div style={{ background: '#f8fafc', padding: '20px 40px', borderBottom: '1px solid #e2e8f0' }}>
      
      {/* Vista previa principal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <div style={{ 
          width: '85px', 
          height: '85px', 
          borderRadius: '50%', 
          overflow: 'hidden', 
          border: '3px solid var(--primary-orange)', 
          background: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {avatarSeleccionado ? (
            <img src={avatarSeleccionado} alt="Vista previa avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FaUser size={35} color="#cbd5e1" />
          )}
        </div>
        <div>
          <p style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            Vista previa del perfil
          </p>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
            Elige un diseño predeterminado o sube una foto personalizada desde tu equipo.
          </p>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>
        Opciones disponibles:
      </p>

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Input de archivo oculto */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />

        {/* Botón para subir imagen personalizada */}
        <div 
          onClick={() => fileInputRef.current.click()}
          title="Subir imagen desde el dispositivo"
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            cursor: 'pointer', 
            border: '2px dashed var(--primary-blue)',
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-blue)',
            transition: '0.2s'
          }}
        >
          <FaUpload size={18} />
        </div>

        {/* Lista de avatares predeterminados */}
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