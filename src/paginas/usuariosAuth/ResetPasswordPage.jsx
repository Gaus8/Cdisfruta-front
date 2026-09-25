import { tw } from '../../funciones/tw.js';
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { restablecerPasswordConToken } from '../../funciones/usuarioAuth';
import AuthBackground from './AuthBackground';

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
    <div className={tw("relative isolate flex min-h-screen w-full items-center justify-center overflow-y-auto px-4 py-6 sm:px-6")}>
      <AuthBackground />
      <div className={tw("form-container", "relative z-10")}>
        <img
          src="/img/logo_cdisfruta.webp"
          alt="Logo Cdisfruta"
          className={tw("reset-page-logo")}
        />

        <h3>Restablecer Contraseña</h3>
        <p className={tw("modal-description")}>Ingresa tu nueva contraseña para actualizar la cuenta.</p>

        <form onSubmit={handleSubmit} className={tw("![width:100%]")}>
          {/* Campo Nueva Contraseña */}
          <div className={tw("form-container-input")}>
            <FaLock className={tw("icon-react")} />
            <input
              type={showNuevaPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              disabled={loading}
            />
            <span
              className={tw(tw("icon-eye-toggle"), "![cursor:pointer]", "![padding:0_8px]", "![color:#888]")}
              onClick={() => setShowNuevaPassword(!showNuevaPassword)}
              
            >
              {showNuevaPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className={tw(tw("form-container-input"), "![margin-top:12px]")} >
            <FaLock className={tw("icon-react")} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <span
              className={tw(tw("icon-eye-toggle"), "![cursor:pointer]", "![padding:0_8px]", "![color:#888]")}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
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
            {loading ? <div className={tw("spinner-css")} /> : 'Guardar nueva contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};
