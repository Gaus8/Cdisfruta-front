import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios'; // No olvides importar axios
import { URL_SERVER } from '../../funciones/conexion';
import { useNavigate } from 'react-router';
export default function LoginGoogle() {
  const [respuestaServer, setRespuestaServer] = useState("");
  const navigate = useNavigate()
  // 1. Inicializamos el hook
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleSuccess(codeResponse),
    onError: (error) => setRespuestaServer("Error en la autenticación con Google"),
    flow: 'auth-code', // Recomendado para mayor seguridad con Express
  });

  const handleGoogleSuccess = async (codeResponse) => {
    try {
      const res = await axios.post(`${URL_SERVER}/auth/google`, {
        code: codeResponse.code
      }, { withCredentials: true }); // Crucial para que el navegador guarde la cookie

      if (res.status === 200) {
        // Usamos el rol que viene en tu JSON del backend
        const { rol } = res.data;

        if (rol === 'admin') {
          navigate("/dashboard_admin");
        } else {
          navigate("/dashboard_user");
        }
      }
    } catch (err) {
      setRespuestaServer("Error al iniciar sesión con Google." + err);
    }
  };
  return (
    <div className="google-btn-container">
      {/* 3. El onClick llama a 'login()', que es la función del hook */}
      <button className="button-google" type="button" onClick={() => login()}>
        <img src="/img/google_logo.png" alt="Google" />
        <span>Acceder con Google</span>
      </button>
      {respuestaServer && <p className="error-msg">{respuestaServer}</p>}
    </div>
  );
}