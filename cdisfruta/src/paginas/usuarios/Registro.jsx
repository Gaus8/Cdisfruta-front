import '../../assets/styles/usuarios/forms.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router";
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoArrowForwardOutline } from "react-icons/io5";

function Registro() {
  const navigate = useNavigate();

  const urlRender = 'https://web-inventario.onrender.com/api/registro';

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [respuestaServer, setRespuestaServer] = useState("");
  const [respuesta2Server, setRespuesta2Server] = useState("");
  const [respuesta3Server, setRespuesta3Server] = useState("");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRespuestaServer("");
    setRespuesta2Server("");
    setRespuesta3Server("");

    if (!data.name || !data.email || !data.password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await axios.post(urlRender, data, { withCredentials: true });
      if (response.status === 201) {
        localStorage.setItem('userEmail', data.email);
        navigate('/validacion');
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.error && Array.isArray(errorData.error)) {
        errorData.error.forEach((e) => {
          if (e.message === "error1") setRespuestaServer("El nombre solo puede tener caracteres alfabéticos");
          else if (e.message === "error2") setRespuesta2Server("El email debe ser válido");
          else if (e.message === "error3") setRespuesta3Server("La contraseña no cumple los requisitos");
        });
      } else if (errorData?.message) {
        setRespuesta3Server(errorData.message);
      } else {
        setRespuesta3Server('Error desconocido');
      }
    }
  };

  return (
    <div className="body">
      <form className="form-container" onSubmit={handleSubmit}>
        <img className="logo-empresa" src="/img/logo_siecu.png" alt="logo_aplicacion" />
        <h3>Crear cuenta</h3>

        <div className="form-container-input">
          <IoPersonOutline className="icon-react" />
          <input
            type="text"
            placeholder="Ingrese su nombre"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>
        <p id="error-name">{respuestaServer}</p>

        <div className="form-container-input">
          <IoMailOutline className="icon-react" />
          <input
            type="email"
            placeholder="Ingrese su email"
            name="email"
            value={data.email}
            onChange={handleChange}
          />
        </div>
        <p id="error-email">{respuesta2Server}</p>

        <div className="form-container-input">
          <IoLockClosedOutline className="icon-react" />
          <input
            type="password"
            placeholder="Ingrese una contraseña"
            name="password"
            value={data.password}
            onChange={handleChange}
          />
        </div>
        <p id="error-password">{respuesta3Server}</p>

        <a href="/login">¿Ya tienes cuenta? Inicia Sesión</a>
        
        <button className="button" type="submit">
          <span>Registrarse</span>
          <IoArrowForwardOutline className="icon-btn" />
        </button>
      </form>
    </div>
  );
}

export default Registro;