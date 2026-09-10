import React, { useState } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import '../../assets/styles/usuarios/reset_password_modal.css';
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose} aria-label="Cerrar">
          <FaTimes />
        </button>

        <h3>Recuperar Contraseña</h3>
        
        <p className="modal-description">
          Ingresa tu correo electrónico registrado y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-container-input">
            <FaEnvelope className="icon-react" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="error-text">
            {error && <span>{error}</span>}
          </div>

          {successMessage && (
            <div className="success-text">
              {successMessage}
            </div>
          )}

          <button type="submit" className="button" disabled={loading}>
            {loading ? <div className="spinner-css" /> : 'Enviar enlace'}
          </button>
        </form>

        <span className="link-switch" onClick={onClose}>
          Volver al inicio de sesión
        </span>
      </div>
    </div>
  );
};