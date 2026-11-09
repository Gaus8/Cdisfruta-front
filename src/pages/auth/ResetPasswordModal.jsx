import { tw } from '../../utils/tw.js';
import React, { useState } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import { solicitarRestablecerPassword } from '../../services/api/authService';
import { useTranslation } from 'react-i18next';

export const ResetPasswordModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation('auth');
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
      setError(t('requiredEmail'));
      return;
    }

    setLoading(true);

    try {
      const data = await solicitarRestablecerPassword(email);
      setSuccessMessage(data.message || t('resetLinkSent'));
      setEmail('');
    } catch (err) {
      setError(err.message || t('requestError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={tw("modal-overlay")} onClick={onClose}>
      <div className={tw("form-container")} onClick={(e) => e.stopPropagation()}>
        <button className={tw("btn-close-modal")} onClick={onClose} aria-label={t('close')}>
          <FaTimes />
        </button>

        <h3>{t('recoverPassword')}</h3>
        
        <p className={tw("modal-description")}>
          Ingresa tu correo electrónico registrado y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className={tw("![width:100%]")}>
          <div className={tw("form-container-input")}>
            <FaEnvelope className={tw("icon-react")} />
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
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
            {loading ? <div className={tw("spinner-css")} /> : t('sendLink')}
          </button>
        </form>

        <span className={tw("link-switch")} onClick={onClose}>
          Volver al inicio de sesión
        </span>
      </div>
    </div>
  );
};
