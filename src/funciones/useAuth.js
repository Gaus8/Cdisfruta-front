import { useState, useEffect, useCallback } from 'react';
import { apiAxios } from './conexion';

export const useAuth = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const verifyToken = useCallback(async () => {
    try {
      // Usamos apiAxios: las cookies httpOnly se envían automáticamente
      const res = await apiAxios.get('/auth/verificar-token');

      if (res.data.valid) {
        setUserData(res.data.user);
        setAuthenticated(true);
        return res.data;
      } else {
        setUserData(null);
        setAuthenticated(false);
        return null;
      }
    } catch (error) {
      setUserData(null);
      setAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Verificar token al cargar el hook
    verifyToken();

    // 2. Escuchar cuando el interceptor detecte un 401/403
    const handleSessionExpired = () => {
      setUserData(null);
      setAuthenticated(false);
      setLoading(false);
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [verifyToken]);

  return { userData, loading, authenticated, verifyToken };
};