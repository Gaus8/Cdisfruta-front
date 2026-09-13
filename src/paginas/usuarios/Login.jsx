import '../../assets/styles/usuarios/forms.css';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoArrowForwardOutline,
  IoCloseOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoTimeOutline
} from "react-icons/io5";
import { iniciarSesion } from '../../funciones/usuarioAuth';
import LoginGoogle from './LoginGoogle';
import { ResetPasswordModal } from './ResetPasswordModal';

function Login({ cerrar, irRegistro }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [respuestaServer, setRespuestaServer] = useState("");
  const [mensajeExpirado, setMensajeExpirado] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  // Detectar si fue redirigido por expiración de token
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setMensajeExpirado('Tu sesión ha expirado por inactividad. Ingresa nuevamente.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuestaServer("");
    setMensajeExpirado(""); // Limpia la alerta de expiración al intentar ingresar

    if (!data.email || !data.password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const dataUsuario = await iniciarSesion(data);
      cerrar();

      if (dataUsuario?.rol === 'admin') {
        navigate("/dashboard_admin");
      } else {
        navigate("/dashboard_usuario");
      }
    } catch (err) {
      setRespuestaServer(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={cerrar}>
        <form
          className="form-container"
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="btn-close-modal"
            onClick={cerrar}
            disabled={loading}
          >
            <IoCloseOutline />
          </button>

          <img className="logo-empresa" src="/img/logo_cdisfruta.webp" alt="logo_cdisfruta" />
          <h3>Inicio de Sesión</h3>

          {/* Banner de alerta si la sesión expiró */}
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

          {/* Campo Email */}
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

          {/* Campo Contraseña con Ojo */}
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

          <p className="error-text">{respuestaServer}</p>

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

          <LoginGoogle cerrarModal={cerrar} />

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
            onClick={!loading ? irRegistro : undefined}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            ¿No tienes cuenta? Regístrate aquí
          </span>
        </form>
      </div>

      {/* Modal renderizado fuera de la jerarquía del form */}
      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />
    </>
  );
}

export default Login;