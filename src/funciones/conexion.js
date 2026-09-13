import axios from 'axios';

export const URL_SERVER = import.meta.env.VITE_API_URL;

export const apiAxios = axios.create({
  baseURL: URL_SERVER,
  withCredentials: true
});

apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/login');

    if (
      error.response && 
      (error.response.status === 401 || error.response.status === 403) &&
      !isAuthRoute
    ) {
      // Disparar evento global para reaccionar al instante en React
      window.dispatchEvent(new CustomEvent('session-expired'));
    }
    return Promise.reject(error);
  }
);