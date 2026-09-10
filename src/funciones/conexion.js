import axios from 'axios';

export const URL_SERVER = import.meta.env.VITE_API_URL;

export const apiAxios = axios.create({
  baseURL: URL_SERVER,
  withCredentials: true  // 👈 aplica a todos los requests
});