import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import axios from 'axios';
import '../../assets/styles/usuarios/validacion.css';
import { URL_SERVER } from '../../funciones/conexion';

function Validacion() {
  const [codigo, setCodigo] = useState(new Array(6).fill(""));
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  // Manejar el cambio en cada cuadro
  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, ""); // Solo números
    if (!value) return;

    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = value.substring(value.length - 1);
    setCodigo(nuevoCodigo);

    // Mover al siguiente input si existe
    if (index < 5 && value) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Manejar el borrado (Backspace)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!codigo[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }
      const nuevoCodigo = [...codigo];
      nuevoCodigo[index] = "";
      setCodigo(nuevoCodigo);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    
    const codigoCompleto = codigo.join("");

    if (codigoCompleto.length !== 6) {
      return setError('Por favor completa el código de 6 dígitos.');
    }
  
    setCargando(true);
    try {
      const email = localStorage.getItem('userEmail')
      const res = await axios.post(`${URL_SERVER}/validacion`, { 
        email,
        codigo: codigoCompleto 
      });

      if (res.status === 200) {
        setMensaje('¡Cuenta verificada con éxito!');
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto o expirado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="body-validacion">
      <form className="form-container-validacion" onSubmit={handleVerify}>
        <img className="logo-empresa-validacion" src="/img/logo_siecu.webp" alt="logo" />
        <h3>Verificación de Cuenta</h3>
        <p>Ingresa el código enviado a tu correo.</p>

        <div className="otp-container">
          {codigo.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputsRef.current[index] = el)}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input"
            />
          ))}
        </div>

        {mensaje && <p className="mensaje-ok">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        <button 
          type="submit" 
          className="btn-verificar" 
          disabled={cargando || codigo.join("").length < 6}
        >
          {cargando ? 'Verificando...' : 'Verificar Cuenta'}
        </button>

        <div className="footer-links">
          <a href="/login">Volver al Inicio de Sesión</a>
        </div>
      </form>
    </div>
  );
}

export default Validacion;