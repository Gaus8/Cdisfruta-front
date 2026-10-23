import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { tailwindClassMap } from './utils/tailwindClassMap.js';
import App from './routes/AppRouter.jsx'
// 1. Importar el Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

document.body.classList.add(...tailwindClassMap['global-body']);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Envolver la App con el Client ID */}
    <GoogleOAuthProvider clientId="291876279012-gsnvnoi8b3v6ja2odjl5mdvvd6rjd3d3.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
