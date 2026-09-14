import '../../assets/styles/usuarios/forms.css';
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
      const dataUsuario = await iniciarSesion(data);

      if (verifyToken) {
        await verifyToken();
      }

      setMensajeExpirado("");

      // Redirección limpia a las rutas protegidas según el rol
      if (dataUsuario?.rol === 'admin') {
        navigate("/admin", { replace: true });
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
      <div className="auth-page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <form
          className="form-container"
          onSubmit={handleSubmit}
        >
          <button
            type="button"
            className="btn-close-modal"
            onClick={() => navigate('/')}
            disabled={loading}
            title="Volver a la tienda"
          >
            <IoArrowBackOutline />
          </button>

          <img className="logo-empresa" src="/img/logo_cdisfruta.webp" alt="logo_cdisfruta" />
          <h3>Inicio de Sesión</h3>

          {mensajeExpirado && (
            <div
              style={{
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '15px',
                border: '1px solid #ffeeba',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.88rem',
                textAlign: 'left'
              }}
            >
              <IoTimeOutline size={20} style={{ flexShrink: 0 }} />
              <span>{mensajeExpirado}</span>
            </div>
          )}

          <div className="form-container-input">
            <IoMailOutline className="icon-react" />
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

          <div className="form-container-input">
            <IoLockClosedOutline className="icon-react" />
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
              className="btn-eye"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              disabled={loading}
            >
              {mostrarPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          {respuestaServer && <p className="error-text">{respuestaServer}</p>}

          <button
            className="button"
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span className="spinner-css"></span>
                <span>Iniciando Sesión...</span>
              </span>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <IoArrowForwardOutline className="icon-btn" />
              </>
            )}
          </button>

          <LoginGoogle />

          <button
            type="button"
            className="link-switch"
            onClick={() => setIsResetOpen(true)}
            style={{ background: 'none', border: 'none', width: '100%' }}
          >
            ¿Olvidaste tu contraseña?
          </button>

          <span
            className="link-switch"
            onClick={() => !loading && navigate('/registro')}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
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