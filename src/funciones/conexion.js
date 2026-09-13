import axios from 'axios';

export const URL_SERVER = import.meta.env.VITE_API_URL;

export const apiAxios = axios.create({
  baseURL: URL_SERVER,
  withCredentials: true  // 👈 aplica a todos los requests
});

apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Redirigir al login si la sesión caducó y no estamos ya en el login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);