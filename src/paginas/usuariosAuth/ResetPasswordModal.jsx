import { tw } from '../../funciones/tw.js';
import React, { useState } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import { solicitarRestablecerPassword } from '../../funciones/usuarioAuth';

export const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const data = await solicitarRestablecerPassword(email);
      setSuccessMessage(data.message || 'Se ha enviado un enlace a tu correo.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={tw("modal-overlay")} onClick={onClose}>
      <div className={tw("form-container")} onClick={(e) => e.stopPropagation()}>
        <button className={tw("btn-close-modal")} onClick={onClose} aria-label="Cerrar">
          <FaTimes />
        </button>

        <h3>Recuperar Contraseña</h3>
        
        <p className={tw("modal-description")}>
          Ingresa tu correo electrónico registrado y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className={tw("![width:100%]")}>
          <div className={tw("form-container-input")}>
            <FaEnvelope className={tw("icon-react")} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={tw("error-text")}>
            {error && <span>{error}</span>}
          </div>

          {successMessage && (
            <div className={tw("success-text")}>
              {successMessage}
            </div>
          )}

          <button type="submit" className={tw("button")} disabled={loading}>
            {loading ? <div className={tw("spinner-css")} /> : 'Enviar enlace'}
          </button>
        </form>

        <span className={tw("link-switch")} onClick={onClose}>
          Volver al inicio de sesión
        </span>
      </div>
    </div>
  );
};