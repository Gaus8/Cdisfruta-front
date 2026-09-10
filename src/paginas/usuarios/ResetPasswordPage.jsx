import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { restablecerPasswordConToken } from '../../funciones/usuarioAuth';
import '../../assets/styles/usuarios/reset_password_page.css';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Obtiene el ?token=xxx de la URL

  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNuevaPassword, setShowNuevaPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!token) {
      setError('El enlace no es válido o ha expirado.');
      return;
    }

    if (!nuevaPassword || !confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (nuevaPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const data = await restablecerPasswordConToken({ token, nuevaPassword });
      setSuccessMessage(data.message || 'Contraseña restablecida con éxito.');
      setTimeout(() => {
        navigate('/login'); // Redirige al login tras cambiar la clave
      }, 2500);
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page-container">
      <div className="form-container">
        <img
          src="/img/logo_cdisfruta.webp"
          alt="Logo Cdisfruta"
          className="reset-page-logo"
        />

        <h3>Restablecer Contraseña</h3>
        <p className="modal-description">Ingresa tu nueva contraseña para actualizar la cuenta.</p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Campo Nueva Contraseña */}
          <div className="form-container-input">
            <FaLock className="icon-react" />
            <input
              type={showNuevaPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              disabled={loading}
            />
            <span
              className="icon-eye-toggle"
              onClick={() => setShowNuevaPassword(!showNuevaPassword)}
              style={{ cursor: 'pointer', padding: '0 8px', color: '#888' }}
            >
              {showNuevaPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="form-container-input" style={{ marginTop: '12px' }}>
            <FaLock className="icon-react" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <span
              className="icon-eye-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: 'pointer', padding: '0 8px', color: '#888' }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
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
            {loading ? <div className="spinner-css" /> : 'Guardar nueva contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};