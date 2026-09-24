import { tw } from '../../funciones/tw.js';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoArrowForwardOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoTimeOutline,
  IoArrowBackOutline
} from "react-icons/io5";
import { iniciarSesion } from '../../funciones/usuarioAuth';
import LoginGoogle from './LoginGoogle';
import { ResetPasswordModal } from './ResetPasswordModal';

export default function Login({ verifyToken }) {
  const navigate = useNavigate();
  const [respuestaServer, setRespuestaServer] = useState("");
  const [mensajeExpirado, setMensajeExpirado] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  // Evita que el doble-render de StrictMode (solo en desarrollo) borre
  // el mensaje justo después de mostrarlo
  const yaVerificoExpiracion = useRef(false);

  useEffect(() => {
    if (yaVerificoExpiracion.current) return;
    yaVerificoExpiracion.current = true;

    // Verificamos si existe la marca de expiración
    const wasExpired = sessionStorage.getItem('session_was_expired');

    if (wasExpired === 'true') {
      setMensajeExpirado('Tu sesión ha expirado por inactividad. Debes ingresar nuevamente.');
      // Consumimos y eliminamos la marca para que NO vuelva a aparecer
      sessionStorage.removeItem('session_was_expired');
    }
  }, []);
  
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuestaServer("");

    if (!data.email || !data.password) {
      setRespuestaServer('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);

    try {
      // 1. Iniciamos sesión (se genera la cookie httpOnly en el navegador)
      await iniciarSesion(data);

      setMensajeExpirado("");

      // 2. Verificamos el token de inmediato para capturar los datos reales del usuario y su rol
      if (verifyToken) {
        const tokenData = await verifyToken();
        const rolUsuario = tokenData?.user?.rol;

        // 3. Redirección dinámica basada exactamente en el rol obtenido
        if (rolUsuario === 'admin') {
          navigate("/admin", { replace: true });
        } else {
          navigate("/cliente/tienda", { replace: true });
        }
      } else {
        navigate("/cliente/tienda", { replace: true });
      }
    } catch (err) {
      setRespuestaServer(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={tw(tw("auth-page-wrapper"), "![display:flex]", "![justify-content:center]", "![align-items:center]", "![min-height:100vh]", "![padding:20px]")} >
        <form
          className={tw("form-container")}
          onSubmit={handleSubmit}
        >
          <button
            type="button"
            className={tw("btn-close-modal")}
            onClick={() => navigate('/')}
            disabled={loading}
            title="Volver a la tienda"
          >
            <IoArrowBackOutline />
          </button>

          <img className={tw("logo-empresa")} src="/img/logo_cdisfruta.webp" alt="logo_cdisfruta" />
          <h3>Inicio de Sesión</h3>

          {mensajeExpirado && (
            <div
              className={tw("![background-color:#fff3cd]", "![color:#856404]", "![padding:10px_14px]", "![border-radius:8px]", "![margin-bottom:15px]", "![border:1px_solid_#ffeeba]", "![display:flex]", "![align-items:center]", "![gap:8px]", "![font-size:0.88rem]", "![text-align:left]")}
            >
              <IoTimeOutline size={20} className={tw("![flex-shrink:0]")} />
              <span>{mensajeExpirado}</span>
            </div>
          )}

          <div className={tw("form-container-input")}>
            <IoMailOutline className={tw("icon-react")} />
            <input
              type="email"
              placeholder="Ingrese su email"
              name="email"
              value={data.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className={tw("form-container-input")}>
            <IoLockClosedOutline className={tw("icon-react")} />
            <input
              type={mostrarPassword ? "text" : "password"}
              placeholder="Ingrese su contraseña"
              name="password"
              value={data.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <button
              type="button"
              className={tw("btn-eye")}
              onClick={() => setMostrarPassword(!mostrarPassword)}
              disabled={loading}
            >
              {mostrarPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          {respuestaServer && <p className={tw("error-text")}>{respuestaServer}</p>}

          <button
            className={tw(tw("button"), "![opacity:var(--tw-inline-Login-5361-0)]", "![cursor:var(--tw-inline-Login-5361-1)]")}
            type="submit"
            disabled={loading}
            style={{ "--tw-inline-Login-5361-0": loading ? 0.7 : 1, "--tw-inline-Login-5361-1": loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <span className={tw("![display:flex]", "![align-items:center]", "![justify-content:center]", "![gap:8px]")}>
                <span className={tw("spinner-css")}></span>
                <span>Iniciando Sesión...</span>
              </span>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <IoArrowForwardOutline className={tw("icon-btn")} />
              </>
            )}
          </button>

          <LoginGoogle />

          <button
            type="button"
            className={tw(tw("link-switch"), "![background:none]", "![border:none]", "![width:100%]")}
            onClick={() => setIsResetOpen(true)}
            
          >
            ¿Olvidaste tu contraseña?
          </button>

          <span
            className={tw(tw("link-switch"), "![cursor:var(--tw-inline-Login-6355-0)]")}
            onClick={() => !loading && navigate('/registro')}
            style={{ "--tw-inline-Login-6355-0": loading ? 'not-allowed' : 'pointer' }}
          >
            ¿No tienes cuenta? Regístrate aquí
          </span>
        </form>
      </div>

      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />
    </>
  );
}