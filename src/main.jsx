import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// 1. Importar el Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Envolver la App con el Client ID */}
    <GoogleOAuthProvider clientId="778962076786-7g3gb01hpl314q4o8tid0g5b0vub9043.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)