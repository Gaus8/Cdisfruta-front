import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL_SERVER } from './conexion';

export const useAuth = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const verifyToken = async () => {
    try {
      const token = sessionStorage.getItem('token'); // 👈 obtén el token

      const res = await axios.get(`${URL_SERVER}/verify-token`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {} // 👈 envíalo
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

  return { userData, loading, authenticated };
};