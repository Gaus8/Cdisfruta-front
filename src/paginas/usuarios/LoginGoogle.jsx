import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios';
import { URL_SERVER } from '../../funciones/conexion';
import { useNavigate } from 'react-router-dom';

export default function LoginGoogle({ cerrarModal }) {
  const [respuestaServer, setRespuestaServer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleSuccess(codeResponse),
    onError: () => setRespuestaServer("Error en la autenticación con Google"),
    flow: 'auth-code',
  });

  const handleGoogleSuccess = async (codeResponse) => {
    setLoading(true);
    setRespuestaServer("");
    try {
      const res = await axios.post(`${URL_SERVER}/auth/google`, {
        code: codeResponse.code
      }, { withCredentials: true });

      if (res.status === 200) {
        const { rol, token } = res.data;
        sessionStorage.setItem('token', token);
        
        if (cerrarModal) cerrarModal();

        if (rol === 'admin') {
          navigate("/dashboard_admin");
        } else {
          navigate("/dashboard_usuario");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error al iniciar sesión con Google.";
      setRespuestaServer(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-btn-container">
      <button 
        className="button-google" 
        type="button" 
        onClick={() => login()}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        <img src="/img/google_logo.webp" alt="Google" />
        <span>{loading ? "Autenticando..." : "Acceder con Google"}</span>
      </button>
      {respuestaServer && <p className="error-text" style={{ textAlign: 'center' }}>{respuestaServer}</p>}
    </div>
  );
}