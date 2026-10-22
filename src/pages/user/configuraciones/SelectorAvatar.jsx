import { tw } from '../../../funciones/tw.js';
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
    <div className={tw("![background:#f8fafc]", "![padding:20px_40px]", "![border-bottom:1px_solid_#e2e8f0]")}>
      
      {/* Vista previa principal */}
      <div className={tw("![display:flex]", "![align-items:center]", "![gap:20px]", "![margin-bottom:20px]")}>
        <div className={tw("![width:85px]", "![height:85px]", "![border-radius:50%]", "![overflow:hidden]", "![border:3px_solid_var(--primary-orange)]", "![background:white]", "![box-shadow:0_4px_6px_-1px_rgba(0,_0,_0,_0.1)]", "![display:flex]", "![align-items:center]", "![justify-content:center]")}>
          {avatarSeleccionado ? (
            <img src={avatarSeleccionado} alt="Vista previa avatar" className={tw("![width:100%]", "![height:100%]", "![object-fit:cover]")} />
          ) : (
            <FaUser size={35} color="#cbd5e1" />
          )}
        </div>
        <div>
          <p className={tw("![font-size:0.95rem]", "![font-weight:700]", "![color:var(--text-main)]", "![margin:0_0_4px_0]")}>
            Vista previa del perfil
          </p>
          <p className={tw("![font-size:0.8rem]", "![color:#64748b]", "![margin:0]")}>
            Elige un diseño predeterminado o sube una foto personalizada desde tu equipo.
          </p>
        </div>
      </div>

      <p className={tw("![font-size:0.85rem]", "![font-weight:600]", "![color:var(--text-main)]", "![margin-bottom:12px]")}>
        Opciones disponibles:
      </p>

      <div className={tw("![display:flex]", "![gap:15px]", "![flex-wrap:wrap]", "![align-items:center]")}>
        
        {/* Input de archivo oculto */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
          accept="image/*" 
          className={tw("![display:none]")} 
        />

        {/* Botón para subir imagen personalizada */}
        <div 
          onClick={() => fileInputRef.current.click()}
          title="Subir imagen desde el dispositivo"
          className={tw("![width:60px]", "![height:60px]", "![border-radius:50%]", "![cursor:pointer]", "![border:2px_dashed_var(--primary-blue)]", "![background:#eff6ff]", "![display:flex]", "![align-items:center]", "![justify-content:center]", "![color:var(--primary-blue)]", "![transition:0.2s]")}
        >
          <FaUpload size={18} />
        </div>

        {/* Lista de avatares predeterminados */}
        {avatarOptions.map((url, index) => (
          <div 
            key={index}
            onClick={() => setAvatarSeleccionado(url)}
            className={tw("![width:60px]", "![height:60px]", "![border-radius:50%]", "![overflow:hidden]", "![cursor:pointer]", "![border:var(--tw-inline-SelectorAvatar-3241-0)]", "![background:white]", "![transition:0.2s]")} style={{ "--tw-inline-SelectorAvatar-3241-0": avatarSeleccionado === url ? '3px solid var(--primary-orange)' : '2px solid #cbd5e1' }}
          >
            <img src={url} alt={`Opcion ${index}`} className={tw("![width:100%]", "![height:100%]", "![object-fit:cover]")} />
          </div>
        ))}

      </div>
    </div>
  );
}