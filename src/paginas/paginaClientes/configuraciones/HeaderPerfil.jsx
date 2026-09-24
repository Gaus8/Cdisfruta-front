import { tw } from '../../../funciones/tw.js';
import { FaCamera } from 'react-icons/fa';

export default function HeaderPerfil({ nombre, avatarSeleccionado, mostrarSelector, setMostrarSelector }) {
  return (
    <div className={tw("![background:linear-gradient(135deg,_var(--primary-blue)_0%,_#0f172a_100%)]", "![padding:35px_40px]", "![color:white]", "![display:flex]", "![align-items:center]", "![gap:24px]", "![flex-wrap:wrap]")}>
      <div className={tw("![position:relative]")}>
        <div className={tw("![width:85px]", "![height:85px]", "![border-radius:50%]", "![background:var(--primary-orange)]", "![display:flex]", "![align-items:center]", "![justify-content:center]", "![font-size:2rem]", "![font-weight:bold]", "![color:white]", "![overflow:hidden]", "![box-shadow:0_8px_20px_rgba(249,_115,_22,_0.4)]")}>
          {avatarSeleccionado ? (
            <img src={avatarSeleccionado} alt="Avatar" className={tw("![width:100%]", "![height:100%]", "![object-fit:cover]", "![background:white]")} />
          ) : (
            <span>{nombre ? nombre.charAt(0).toUpperCase() : "👤"}</span>
          )}
        </div>

        <button 
          type="button"
          onClick={() => setMostrarSelector(!mostrarSelector)} 
          className={tw("![position:absolute]", "![bottom:0]", "![right:0]", "![background:white]", "![border:none]", "![width:30px]", "![height:30px]", "![border-radius:50%]", "![display:flex]", "![align-items:center]", "![justify-content:center]", "![cursor:pointer]", "![box-shadow:0_2px_8px_rgba(0,0,0,0.2)]")} 
          title="Elegir estilo de avatar"
        >
          <FaCamera size={12} color="var(--primary-blue)" />
        </button>
      </div>

      <div>
        <span className={tw("![color:var(--primary-orange)]", "![text-transform:uppercase]", "![font-size:0.75rem]", "![font-weight:700]", "![letter-spacing:1.5px]")}>Panel de Cliente</span>
        <h1 className={tw("![font-size:1.8rem]", "![font-weight:800]", "![margin:4px_0]")}>{nombre}</h1>
        <p className={tw("![color:#94a3b8]", "![font-size:0.95rem]", "![margin:0]")}>Gestiona la información de tu cuenta y seguridad</p>
      </div>
    </div>
  );
}