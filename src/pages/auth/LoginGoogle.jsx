import { tw } from '../../funciones/tw.js';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginConGoogle } from '../../funciones/usuarioAuth';

export default function LoginGoogle({ cerrarModal }) {
  const [respuestaServer, setRespuestaServer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleSuccess(codeResponse),
    onError: () => setRespuestaServer("Error en la autenticación con Google"),
    flow: 'auth-code',
    prompt: 'select_account', // Muestra directamente el selector de cuentas
  });

  const handleGoogleSuccess = async (codeResponse) => {
    setLoading(true);
    setRespuestaServer("");
    
    try {
      const data = await loginConGoogle(codeResponse.code);

      if (cerrarModal) cerrarModal();

      if (data?.rol === 'admin') {
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
    <div className={tw("google-btn-container")}>
      <button 
        className={tw(tw("button-google"), "![opacity:var(--tw-inline-LoginGoogle-1266-0)]", "![cursor:var(--tw-inline-LoginGoogle-1266-1)]")} 
        type="button" 
        onClick={() => login()}
        disabled={loading}
        style={{ "--tw-inline-LoginGoogle-1266-0": loading ? 0.7 : 1, "--tw-inline-LoginGoogle-1266-1": loading ? 'not-allowed' : 'pointer' }}
      >
        <img src="/img/google_logo.webp" alt="Google" />
        <span>{loading ? "Autenticando..." : "Acceder con Google"}</span>
      </button>
      {respuestaServer && (
        <p className={tw(tw("error-text"), "![text-align:center]")} >
          {respuestaServer}
        </p>
      )}
    </div>
  );
}