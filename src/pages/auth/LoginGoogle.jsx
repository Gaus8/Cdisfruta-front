import { tw } from '../../utils/tw.js';
import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginConGoogle } from '../../services/api/authService';
import { useAuth } from '../../hooks/useAuth';
import { homePathForRole } from '../../utils/roleHome.js';

export default function LoginGoogle({ cerrarModal }) {
  const [respuestaServer, setRespuestaServer] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(320);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { verifyToken, establishSession } = useAuth();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    const update = () => setButtonWidth(Math.min(400, Math.max(240, Math.floor(element.clientWidth))));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [loading]);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setRespuestaServer('Google no devolvió la sesión. Ciérrala e inténtalo de nuevo.');
      return;
    }

    setLoading(true);
    setRespuestaServer("");

    try {
      const data = await loginConGoogle(credentialResponse.credential);

      // Igual que el login con email: la cookie ya existe, pero AuthContext
      // sigue en authenticated=false hasta verificar. Sin esto, RutaProtegida
      // redirige de vuelta a /login y parece que "recarga y no entra".
      const tokenData = await verifyToken();
      const sessionUser = (tokenData?.valid && tokenData?.user) ? tokenData.user : (data?.user || null);
      if (!sessionUser) {
        setRespuestaServer('Google confirmó la cuenta, pero la sesión no quedó activa. Inténtalo de nuevo.');
        return;
      }

      establishSession(sessionUser);
      if (cerrarModal) cerrarModal();
      navigate(homePathForRole(sessionUser.rol), { replace: true });
    } catch (err) {
      setRespuestaServer(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className={tw("google-btn-container")}>
      {loading ? (
        <button className={tw("button-google")} type="button" disabled>Autenticando...</button>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setRespuestaServer('No se pudo completar el ingreso con Google. Inténtalo de nuevo.')}
          theme="outline"
          size="large"
          shape="pill"
          text="continue_with"
          width={buttonWidth}
          use_fedcm_for_button={false}
        />
      )}
      {respuestaServer && (
        <p className={tw(tw("error-text"), "![text-align:center]")} >
          {respuestaServer}
        </p>
      )}
    </div>
  );
}
