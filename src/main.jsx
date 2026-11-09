import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './i18n/index.js'
import { tailwindClassMap } from './utils/tailwindClassMap.js'
import App from './routes/AppRouter.jsx'

document.body.classList.add(...tailwindClassMap['global-body']);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
