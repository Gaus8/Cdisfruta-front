import axios from 'axios';

//export const URL_SERVER = 'http://localhost:5000/api' 
export const URL_SERVER = 'https://cdisfruta-back.vercel.app/api'  //URL del backend - producción

export const api = axios.create({
  baseURL: URL_SERVER,
  withCredentials: true  // 👈 aplica a todos los requests
});