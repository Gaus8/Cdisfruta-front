import '../../assets/styles/usuarios/forms.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router";
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoArrowForwardOutline, IoCloseOutline } from "react-icons/io5";
import { URL_SERVER } from '../conexion';
import { GoogleLogin } from '@react-oauth/google';
import LoginGoogle from './LoginGoogle';

function Registro({ cerrar, irLogin }) { // Recibimos cerrar e irLogin
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [respuestas, setRespuestas] = useState({ s1: "", s2: "", s3: "" });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Limpiar errores previos
    setRespuestas({ s1: "", s2: "", s3: "" });

    if (!data.name || !data.email || !data.password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await axios.post(`${URL_SERVER}/registro`, data, { withCredentials: true });
      if (response.status === 201) {
        localStorage.setItem('userEmail', data.email);
        cerrar(); // Cerramos el modal antes de ir a la validación
        navigate('/validacion');
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.error && Array.isArray(errorData.error)) {
        let nuevosErrores = { s1: "", s2: "", s3: "" };
        errorData.error.forEach((e) => {
          if (e.message === "error1") nuevosErrores.s1 = "El nombre solo puede tener caracteres alfabéticos";
          else if (e.message === "error2") nuevosErrores.s2 = "El email debe ser válido";
          else if (e.message === "error3") nuevosErrores.s3 = "La contraseña no cumple los requisitos";
        });
        setRespuestas(nuevosErrores);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${URL_SERVER}/auth/google`, {
        token: credentialResponse.credential
      }, { withCredentials: true });

      if (res.status === 200) {
        cerrar();
        if (res.data?.rol === 'admin') navigate("/dashboard_admin");
        else navigate("/dashboard_user");
      }
    } catch (err) {
      setRespuestaServer("Error al iniciar sesión con Google.");
    }
  };

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <form
        className="form-container"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
      >
        <button type="button" className="btn-close-modal" onClick={cerrar}>
          <IoCloseOutline />
        </button>

        <img className="logo-empresa" src="/img/logo_siecu.png" alt="logo" />
        <h3>Crear cuenta</h3>

        <div className="form-container-input">
          <IoPersonOutline className="icon-react" />
          <input
            type="text"
            placeholder="Nombre completo"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>
        <p className="error-text">{respuestas.s1}</p>

        <div className="form-container-input">
          <IoMailOutline className="icon-react" />
          <input
            type="email"
            placeholder="Correo electrónico"
            name="email"
            value={data.email}
            onChange={handleChange}
          />
        </div>
        <p className="error-text">{respuestas.s2}</p>

        <div className="form-container-input">
          <IoLockClosedOutline className="icon-react" />
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            value={data.password}
            onChange={handleChange}
          />
        </div>
        <p className="error-text">{respuestas.s3}</p>

        <button className="button" type="submit">
          <span>Registrarse</span>
          <IoArrowForwardOutline className="icon-btn" />
        </button>

         <LoginGoogle/>
        {/* Cambiamos la ruta por la función irLogin */}
        <span className="link-switch" onClick={irLogin}>
          ¿Ya tienes cuenta? Inicia Sesión
        </span>
      </form>
    </div>
  );
}

export default Registro;