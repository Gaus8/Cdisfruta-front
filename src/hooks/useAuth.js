import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { apiAxios } from '../services/api/client';

const AuthContext = createContext(null);

const sessionWasRejected = (error) => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const attempt = useRef(0);

  const verifyToken = useCallback(async () => {
    const current = ++attempt.current;
    const apply = (valid, user = null) => {
      if (current !== attempt.current) return;
      setUserData(valid ? user : null);
      setAuthenticated(Boolean(valid));
      setLoading(false);
    };

    const request = () => apiAxios.get('/auth/verificar-token');

    try {
      let response;
      try {
        response = await request();
      } catch (error) {
        if (sessionWasRejected(error)) {
          apply(false);
          return false;
        }
        response = await request();
      }

      if (response.data?.valid) {
        apply(true, response.data.user);
        return response.data;
      }
      apply(false);
      return false;
    } catch (error) {
      if (current !== attempt.current) return null;
      if (sessionWasRejected(error)) {
        apply(false);
        return false;
      }
      setLoading(false);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiAxios.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    attempt.current += 1;
    setUserData(null);
    setAuthenticated(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    verifyToken();

    const handleSessionExpired = () => {
      attempt.current += 1;
      setUserData(null);
      setAuthenticated(false);
      setLoading(false);
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [verifyToken]);

  return createElement(
    AuthContext.Provider,
    { value: { userData, loading, authenticated, verifyToken, logout } },
    children
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
