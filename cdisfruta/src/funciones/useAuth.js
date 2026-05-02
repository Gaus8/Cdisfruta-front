import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL_SERVER } from './conexion';

export const useAuth = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const verifyToken = async () => {
    try {
      const res = await axios.get(`${URL_SERVER}/verify-token`, {
        withCredentials: true,
      });

      if (res.data.valid) {
        setUserData(res.data.user);
        setAuthenticated(true);
        return res.data;
      } else {
        setAuthenticated(false);
        return null;
      }
    } catch (error) {
      setAuthenticated(false);
      console.error("Error de autenticación:", error.response?.data?.message || error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  // Retornamos los estados y la función por si quieres re-verificar manualmente
  return { userData, loading, authenticated };
};