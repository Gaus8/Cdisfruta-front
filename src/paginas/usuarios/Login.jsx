import '../../assets/styles/usuarios/forms.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IoMailOutline, IoLockClosedOutline, IoArrowForwardOutline, IoCloseOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { apiAxios } from '../../funciones/conexion';
import LoginGoogle from './LoginGoogle';

function Login({ cerrar, irRegistro }) {
  const navigate = useNavigate();
  const [respuestaServer, setRespuestaServer] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: ""
  });

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
      alert('Todos los campos son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const res = await apiAxios.post('/login', data);
      if (res.status === 200) {
        sessionStorage.setItem('token', res.data.token);
        cerrar();
        if (res.data?.rol === 'admin') navigate("/dashboard_admin");
        else navigate("/dashboard_usuario");
      }
    } 
    catch (err) {
      const errorData = err.response?.data;
      setRespuestaServer(errorData?.message || "Error al iniciar sesión.");
    } 
    finally {
      setLoading(false);
    }
  };

  // 2. El RENDER va al final
  return (
    <div className="modal-overlay" onClick={cerrar}>
      <form
        className="form-container"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="btn-close-modal" onClick={cerrar}>
          <IoCloseOutline />
        </button>

        <img className="logo-empresa" src="/img/logo_cdisfruta.webp" alt="logo_cdisfruta" />
        <h3>Inicio de Sesión</h3>

        {/* Campo Email */}
        <div className="form-container-input">
          <IoMailOutline className="icon-react" />
          <input
            type="email"
            placeholder="Ingrese su email"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Contraseña con el OJO */}
        <div className="form-container-input">
          <IoLockClosedOutline className="icon-react" />
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Ingrese su contraseña"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="btn-eye"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
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
        <LoginGoogle />
        <span className="link-switch" onClick={irRegistro}>
          ¿No tienes cuenta? Regístrate aquí
        </span>
      </form>
    </div>
  );
}

export default Login;