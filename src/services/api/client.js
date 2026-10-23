import axios from 'axios';

export const URL_SERVER = import.meta.env.VITE_API_URL;

export const apiAxios = axios.create({
  baseURL: URL_SERVER,
  withCredentials: true
});

apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthRoute = 
      url.includes('/login') || 
      url.includes('/registro') || 
      url.includes('/logout') ||
      url.includes('/cambiar-password') ||
      url.includes('/verificar-token');

    const message = String(error.response?.data?.message || error.response?.data?.mensaje || '');
    const sessionRejected = error.response?.status === 401 || (
      error.response?.status === 403 && /token|access not authorized|no hay token|no token/i.test(message)
    );

    if (error.response && sessionRejected && !isAuthRoute) {
      // Guardamos la marca de que la sesión venció mientras el usuario usaba la app
      sessionStorage.setItem('session_was_expired', 'true');
      
      // Redirigimos al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);