import { tw } from '../../funciones/tw.js';
import { useState, useEffect } from "react";
import { useAuth } from "../../funciones/useAuth";
import HeaderDashboard from "./Header";
import { FaSave, FaCheckCircle } from "react-icons/fa";
import Perfil from "./configuraciones/Perfil";
import Seguridad from "./configuraciones/Seguridad";
import HeaderPerfil from "./configuraciones/HeaderPerfil";
import SelectorAvatar from "./configuraciones/SelectorAvatar";
import { cambiarPassword, actualizarPerfil } from "../../funciones/usuarioAuth";

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Gordi1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Gordi2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Smile",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool"
];

export default function ConfiguracionUsuario() {
  // 👇 1. Extraemos setUserData (o la función que actualice el estado global en tu useAuth)
  const { userData, verifyToken } = useAuth();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [avatarSeleccionado, setAvatarSeleccionado] = useState(AVATAR_OPTIONS[0]);
  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirmar, setPassConfirmar] = useState("");

  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [activeTab, setActiveTab] = useState("perfil");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");

  // Precargar los datos tan pronto como userData cambie o esté disponible
  useEffect(() => {
    if (userData) {
      setNombre(userData.nombre || "");
      setEmail(userData.email || "");
      setTelefono(userData.telefono || "");
      setAvatarSeleccionado(userData.avatar || AVATAR_OPTIONS[0]);
    }
  }, [userData]);

  const regexCompleta = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$\%^&*])[\S]{8,16}$/;


  // Guardar Perfil y Avatar con soporte para FormData / Archivos
  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("telefono", telefono);

      // Verificamos si el avatar seleccionado es un archivo local o una URL de texto
      if (avatarSeleccionado instanceof File || (typeof avatarSeleccionado === 'string' && avatarSeleccionado.startsWith("blob:"))) {
        if (avatarSeleccionado.startsWith("blob:")) {
          const responseBlob = await fetch(avatarSeleccionado);
          const blob = await responseBlob.blob();
          formData.append("avatar", blob, "avatar_usuario.jpg");
        } else {
          formData.append("avatar", avatarSeleccionado);
        }
      } else {
        // Es un avatar predeterminado de DiceBear o la URL existente de Cloudinary
        formData.append("avatar", avatarSeleccionado);
      }

      const respuesta = await actualizarPerfil(formData);

      setTipoMensaje("success");
      setMensaje(respuesta.message || "¡Perfil y avatar actualizados correctamente!");
      setMostrarSelector(false);

      // 👇 2. LLAMADA CLAVE: Refresca el token/datos globales inmediatamente
      await verifyToken();

      setTimeout(() => setMensaje(""), 3500);

    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setTipoMensaje("error");
      setMensaje(err.message || "Error al actualizar el perfil.");
    }
  };

  // Guardar solo Contraseña de forma independiente
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      if (!passActual) {
        setTipoMensaje("error");
        setMensaje("Debes ingresar tu contraseña actual.");
        return;
      }

      if (!regexCompleta.test(passNueva)) {
        setTipoMensaje("error");
        setMensaje("La nueva contraseña no cumple con los requisitos de seguridad.");
        return;
      }

      if (passNueva !== passConfirmar) {
        setTipoMensaje("error");
        setMensaje("Las contraseñas nuevas no coinciden.");
        return;
      }

      const respuesta = await cambiarPassword(passActual, passNueva);

      setTipoMensaje("success");
      setMensaje(respuesta.message || "Contraseña actualizada exitosamente.");

      setPassActual("");
      setPassNueva("");
      setPassConfirmar("");

      setTimeout(() => setMensaje(""), 3500);
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      setTipoMensaje("error");
      setMensaje(err.message || "Error al actualizar la contraseña.");
    }
  };

  return (
    <div className={tw("userpage-container")}>
      <HeaderDashboard />

      <div className={tw(tw("content-wrapper"), "![justify-content:center]", "![padding:40px_20px]")} >
        <div className={tw("![width:100%]", "![max-width:900px]")}>

          <div className={tw("![background:var(--white)]", "![border-radius:24px]", "![border:1px_solid_#e2e8f0]", "![box-shadow:0_15px_30px_-5px_rgba(30,_41,_59,_0.08)]", "![overflow:hidden]")}>

            <HeaderPerfil
              nombre={nombre}
              avatarSeleccionado={avatarSeleccionado}
              mostrarSelector={mostrarSelector}
              setMostrarSelector={setMostrarSelector}
            />

            {mostrarSelector && (
              <SelectorAvatar
                avatarOptions={AVATAR_OPTIONS}
                avatarSeleccionado={avatarSeleccionado}
                setAvatarSeleccionado={setAvatarSeleccionado}
              />
            )}

            {/* Pestañas de Navegación */}
            <div className={tw("![display:flex]", "![border-bottom:1px_solid_#e2e8f0]", "![background:#f8fafc]", "![padding:0_30px]")}>
              <button
                type="button"
                onClick={() => { setActiveTab("perfil"); setMensaje(""); }}
                className={tw("![padding:16px_24px]", "![background:transparent]", "![border:none]", "![border-bottom:var(--tw-inline-ConfiguracionUsuario-5919-0)]", "![color:var(--tw-inline-ConfiguracionUsuario-5919-1)]", "![font-weight:var(--tw-inline-ConfiguracionUsuario-5919-2)]", "![cursor:pointer]", "![font-size:0.95rem]")} style={{ "--tw-inline-ConfiguracionUsuario-5919-0": activeTab === 'perfil' ? '3px solid var(--primary-orange)' : '3px solid transparent', "--tw-inline-ConfiguracionUsuario-5919-1": activeTab === 'perfil' ? 'var(--primary-blue)' : 'var(--text-light)', "--tw-inline-ConfiguracionUsuario-5919-2": activeTab === 'perfil' ? '700' : '500' }}
              >
                Información Personal
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("seguridad"); setMensaje(""); }}
                className={tw("![padding:16px_24px]", "![background:transparent]", "![border:none]", "![border-bottom:var(--tw-inline-ConfiguracionUsuario-6485-0)]", "![color:var(--tw-inline-ConfiguracionUsuario-6485-1)]", "![font-weight:var(--tw-inline-ConfiguracionUsuario-6485-2)]", "![cursor:pointer]", "![font-size:0.95rem]")} style={{ "--tw-inline-ConfiguracionUsuario-6485-0": activeTab === 'seguridad' ? '3px solid var(--primary-orange)' : '3px solid transparent', "--tw-inline-ConfiguracionUsuario-6485-1": activeTab === 'seguridad' ? 'var(--primary-blue)' : 'var(--text-light)', "--tw-inline-ConfiguracionUsuario-6485-2": activeTab === 'seguridad' ? '700' : '500' }}
              >
                Cambiar Contraseña
              </button>
            </div>

            <div className={tw("![padding:40px]")}>
              {mensaje && (
                <div className={tw("![background:var(--tw-inline-ConfiguracionUsuario-7157-0)]", "![border:var(--tw-inline-ConfiguracionUsuario-7157-1)]", "![color:var(--tw-inline-ConfiguracionUsuario-7157-2)]", "![padding:14px_20px]", "![border-radius:12px]", "![margin-bottom:25px]", "![display:flex]", "![align-items:center]", "![gap:10px]", "![font-weight:500]")} style={{ "--tw-inline-ConfiguracionUsuario-7157-0": tipoMensaje === 'success' ? '#ecfdf5' : '#fee2e2', "--tw-inline-ConfiguracionUsuario-7157-1": `1px solid ${tipoMensaje === 'success' ? '#a7f3d0' : '#fecaca'}`, "--tw-inline-ConfiguracionUsuario-7157-2": tipoMensaje === 'success' ? '#065f46' : '#991b1b' }}>
                  <FaCheckCircle color={tipoMensaje === 'success' ? '#10b981' : '#ef4444'} size={18} /> {mensaje}
                </div>
              )}

              {/* Renderizado condicional con formularios independientes por pestaña */}
              {activeTab === 'perfil' ? (
                <form onSubmit={handleUpdatePerfil}>
                  <Perfil
                    nombre={nombre}
                    setNombre={setNombre}
                    telefono={telefono}
                    setTelefono={setTelefono}
                    email={email}
                  />
                  <div className={tw("![margin-top:35px]", "![display:flex]", "![justify-content:flex-end]", "![border-top:1px_solid_#e2e8f0]", "![padding-top:20px]")}>
                    <button type="submit" className={tw(tw("hero-explore-btn"), "![margin:0]", "![display:flex]", "![align-items:center]", "![gap:10px]", "![padding:14px_30px]", "![font-size:1rem]")} >
                      <FaSave /> Guardar Cambios de Perfil
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleUpdatePassword}>
                  <Seguridad
                    passActual={passActual}
                    setPassActual={setPassActual}
                    passNueva={passNueva}
                    setPassNueva={setPassNueva}
                    passConfirmar={passConfirmar}
                    setPassConfirmar={setPassConfirmar}
                  />
                  <div className={tw("![margin-top:35px]", "![display:flex]", "![justify-content:flex-end]", "![border-top:1px_solid_#e2e8f0]", "![padding-top:20px]")}>
                    <button type="submit" className={tw(tw("hero-explore-btn"), "![margin:0]", "![display:flex]", "![align-items:center]", "![gap:10px]", "![padding:14px_30px]", "![font-size:1rem]")} >
                      <FaSave /> Actualizar Contraseña
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}