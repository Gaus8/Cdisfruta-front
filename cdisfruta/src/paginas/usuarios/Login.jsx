import '../../assets/styles/usuarios/forms.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IoMailOutline, IoLockClosedOutline, IoArrowForwardOutline, IoCloseOutline } from "react-icons/io5";
import { URL_SERVER } from '../conexion';

function Login({ cerrar, irRegistro }) {
  const navigate = useNavigate();
  const [respuestaServer, setRespuestaServer] = useState("");
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuestaServer("");

    if (!data.email || !data.password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await axios.post(`${URL_SERVER}/login`, data, { withCredentials: true });

      if (res.status === 200) {
        // Cerramos el modal antes de cualquier redirección
        cerrar();

        if (res.data?.rol === 'admin') {
          navigate("/dashboard_admin");
        } else {
          navigate("/dashboard_user");
        }
      }
    } catch (err) {
      const errorData = err.response?.data;
      setRespuestaServer(errorData?.message || "Error al iniciar sesión. Intente de nuevo.");
    }
  };

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <form
        className="form-container"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()} // Evita que el click dentro cierre el modal
      >
        {/* Botón de cerrar modal */}
        <button type="button" className="btn-close-modal" onClick={cerrar}>
          <IoCloseOutline />
        </button>

        <img className="logo-empresa" src="/img/logo_siecu.png" alt="logo_siecu" />
        <h3>Inicio de Sesión</h3>

        {/* Campo Email */}
        <div className="form-container-input">
          <IoMailOutline className="icon-react" />
          <input
            type="email"
            placeholder="Ingrese su email"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Contraseña */}
        <div className="form-container-input">
          <IoLockClosedOutline className="icon-react" />
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mensaje de Error del Servidor */}
        <p className="error-text">{respuestaServer}</p>


        <button className="button" type="submit">
          <span>Iniciar Sesión</span>
          <IoArrowForwardOutline className="icon-btn" />
        </button>
        
        {/* Cambio a Registro */}
        <span className="link-switch" onClick={irRegistro}>
          ¿No tienes cuenta? Regístrate aquí
        </span>

      </form>
    </div>
  );
}

export default Login;