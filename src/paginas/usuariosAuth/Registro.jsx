import { tw } from '../../funciones/tw.js';
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoArrowForwardOutline, 
  IoArrowBackOutline 
} from "react-icons/io5";
import { registrarUsuario, procesarErroresRegistro } from '../../funciones/usuarioAuth';
import LoginGoogle from './LoginGoogle';
import AuthBackground from './AuthBackground';

export default function Registro() {
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
    <div className={tw("relative isolate flex min-h-screen w-full items-center justify-center overflow-y-auto px-4 py-6 sm:px-6")} >
      <AuthBackground />
      <form
        className={tw("form-container", "relative z-10")}
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

        <img className={tw("logo-empresa")} src="/img/logo_cdisfruta.webp" alt="logo" />
        <h3>Crear cuenta</h3>

        <div className={tw("form-container-input")}>
          <IoPersonOutline className={tw("icon-react")} />
          <input
            type="text"
            placeholder="Nombre completo"
            name="name"
            value={data.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <p className={tw("error-text")}>{respuestas.s1}</p>

        <div className={tw("form-container-input")}>
          <IoMailOutline className={tw("icon-react")} />
          <input
            type="email"
            placeholder="Correo electrónico"
            name="email"
            value={data.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <p className={tw("error-text")}>{respuestas.s2}</p>

        <div className={tw("form-container-input")}>
          <IoLockClosedOutline className={tw("icon-react")} />
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            value={data.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <p className={tw("error-text")}>{respuestas.s3}</p>

        <div className={tw("![display:flex]", "![align-items:center]", "![gap:8px]", "![margin:0.5rem]", "![font-size:0.9rem]")}>
          <input 
            type="checkbox" 
            id="terminos" 
            checked={terminos}
            onChange={(e) => setTerminos(e.target.checked)}
            disabled={loading}
            className={tw("![cursor:var(--tw-inline-Registro-3601-0)]")} style={{ "--tw-inline-Registro-3601-0": loading ? 'not-allowed' : 'pointer' }}
          />
          <label htmlFor="terminos" className={tw("![cursor:var(--tw-inline-Registro-3878-0)]")} style={{ "--tw-inline-Registro-3878-0": loading ? 'not-allowed' : 'pointer' }}>
            Acepto los{' '}
            <Link to="/terminos" target="_blank" rel="noopener noreferrer" className={tw("![color:#007bff]", "![text-decoration:underline]")}>
              Términos y Condiciones
            </Link>{' '}
            y la{' '}
            <Link to="/politica-datos" target="_blank" rel="noopener noreferrer" className={tw("![color:#007bff]", "![text-decoration:underline]")}>
              Política de Tratamiento de Datos
            </Link>
          </label>
        </div>

        <button 
          className={tw(tw("button"), "![opacity:var(--tw-inline-Registro-4457-0)]", "![cursor:var(--tw-inline-Registro-4457-1)]")} 
          type="submit" 
          disabled={loading} 
          style={{ "--tw-inline-Registro-4457-0": loading ? 0.7 : 1, "--tw-inline-Registro-4457-1": loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? (
            <span className={tw("![display:flex]", "![align-items:center]", "![justify-content:center]", "![gap:8px]")}>
              <span className={tw("spinner-css")}></span>
              <span>Registrando...</span>
            </span>
          ) : (
            <>
              <span>Registrarse</span>
              <IoArrowForwardOutline className={tw("icon-btn")} />
            </>
          )}
        </button>

        <LoginGoogle />
        
        <span 
          className={tw(tw("link-switch"), "![cursor:var(--tw-inline-Registro-5137-0)]")} 
          onClick={() => !loading && navigate('/login')} 
          style={{ "--tw-inline-Registro-5137-0": loading ? 'not-allowed' : 'pointer' }}
        >
          ¿Ya tienes cuenta? Inicia Sesión
        </span>
      </form>
    </div>
  );
}
