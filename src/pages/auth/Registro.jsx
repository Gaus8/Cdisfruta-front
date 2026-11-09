import { tw } from '../../utils/tw.js';
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoArrowForwardOutline, 
  IoArrowBackOutline,
  IoEyeOutline,
  IoEyeOffOutline
} from "react-icons/io5";
import { registrarUsuario, procesarErroresRegistro } from '../../services/api/authService';
import LoginGoogle from './LoginGoogle';
import AuthLayout from './AuthLayout';
import { useTranslation } from 'react-i18next';

export default function Registro() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [terminos, setTerminos] = useState(false); 
  const [respuestas, setRespuestas] = useState({ s1: "", s2: "", s3: "" });
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

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
    <AuthLayout variant="register">
      <form
        className={tw("form-container auth-register-card", "relative z-10")}
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

        <img className={tw("logo-empresa")} src="/img/logo_cdisfruta.webp" alt="CDISFRUTA" />
        <h3>{t('registerTitle')}</h3>
        <p className={tw("auth-login-subtitle")}>{t('registerSubtitle')}</p>

        <div className={tw("form-container-input")}>
          <IoPersonOutline className={tw("icon-react")} />
          <input
            type="text"
            placeholder={t('fullNamePlaceholder')}
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
            placeholder={t('emailPlaceholder')}
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
            type={mostrarPassword ? "text" : "password"}
            placeholder={t('passwordPlaceholder')}
            name="password"
            value={data.password}
            onChange={handleChange}
            disabled={loading}
          />
          <button
            type="button"
            className={tw("btn-eye")}
            onClick={() => setMostrarPassword((visible) => !visible)}
            disabled={loading}
            aria-label={mostrarPassword ? t('hidePassword') : t('showPassword')}
            title={mostrarPassword ? t('hidePassword') : t('showPassword')}
          >
            {mostrarPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
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
            {t('acceptTerms')}{' '}
            <Link to="/terminos" target="_blank" rel="noopener noreferrer" className={tw("auth-terms-link")}>
              {t('terms')}
            </Link>{' '}
            {` ${t('andThe')} `}
            <Link to="/politica-datos" target="_blank" rel="noopener noreferrer" className={tw("auth-terms-link")}>
              {t('privacyPolicy')}
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
              <span>{t('registering')}</span>
            </span>
          ) : (
            <>
              <span>{t('register')}</span>
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
          {t('haveAccount')}
        </span>
      </form>
    </AuthLayout>
  );
}
