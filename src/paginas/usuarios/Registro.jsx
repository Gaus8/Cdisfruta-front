import '../../assets/styles/usuarios/forms.css';
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoArrowForwardOutline, 
  IoCloseOutline 
} from "react-icons/io5";
import { registrarUsuario, procesarErroresRegistro } from '../../funciones/usuarioAuth';
import LoginGoogle from './LoginGoogle';

function Registro({ cerrar, irLogin }) {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [terminos, setTerminos] = useState(false); 
  const [respuestas, setRespuestas] = useState({ s1: "", s2: "", s3: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuestas({ s1: "", s2: "", s3: "" });

    if (!terminos) {
      alert('Debes aceptar los términos y condiciones para registrarte.');
      return;
    }

    if (!data.name || !data.email || !data.password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const response = await registrarUsuario(data, terminos);
      
      if (response.status === 201) {
        localStorage.setItem('userEmail', data.email);
        cerrar(); 
        navigate('/validacion');
      }
    } catch (errorData) {
      const erroresFormateados = procesarErroresRegistro(errorData);
      setRespuestas(erroresFormateados);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <form
        className="form-container"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="btn-close-modal" onClick={cerrar} disabled={loading}>
          <IoCloseOutline />
        </button>

        <img className="logo-empresa" src="/img/logo_cdisfruta.webp" alt="logo" />
        <h3>Crear cuenta</h3>

        <div className="form-container-input">
          <IoPersonOutline className="icon-react" />
          <input
            type="text"
            placeholder="Nombre completo"
            name="name"
            value={data.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <p className="error-text">{respuestas.s1}</p>

        <div className="form-container-input">
          <IoMailOutline className="icon-react" />
          <input
            type="email"
            placeholder="Correo electrónico"
            name="email"
            value={data.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <p className="error-text">{respuestas.s2}</p>

        <div className="form-container-input">
          <IoLockClosedOutline className="icon-react" />
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            value={data.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <p className="error-text">{respuestas.s3}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0.5rem', fontSize: '0.9rem' }}>
          <input 
            type="checkbox" 
            id="terminos" 
            checked={terminos}
            onChange={(e) => setTerminos(e.target.checked)}
            disabled={loading}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          />
          <label htmlFor="terminos" style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
            Acepto los{' '}
            <Link to="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>
              Términos y Condiciones
            </Link>{' '}
            y la{' '}
            <Link to="/politica-datos" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>
              Política de Tratamiento de Datos
            </Link>
          </label>
        </div>

        <button 
          className="button" 
          type="submit" 
          disabled={loading} 
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="spinner-css"></span>
              <span>Registrando...</span>
            </span>
          ) : (
            <>
              <span>Registrarse</span>
              <IoArrowForwardOutline className="icon-btn" />
            </>
          )}
        </button>

        <LoginGoogle cerrarModal={cerrar} />
        
        <span className="link-switch" onClick={!loading ? irLogin : undefined} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
          ¿Ya tienes cuenta? Inicia Sesión
        </span>
      </form>
    </div>
  );
}

export default Registro;  