import '../../assets/styles/usuarios/forms.css'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoArrowForwardOutline } from "react-icons/io5";
import { URL_SERVER } from '../conexion';

function Login() {
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
    if (!data.email || !data.password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await axios.post(`${URL_SERVER}/login`, data, { withCredentials: true });


      if (res.status === 200 && res.data?.rol === 'admin') {
        navigate("/dashboard_admin");
      }
      else if (res.status === 200 && res.data?.rol === 'user') {
        navigate("/dashboard_user");
      }
      else {
        window.alert('Fallo en el inicio de Sesión')
      }

    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.status === 'error') {
        setRespuestaServer(errorData.message);
      }

    }
  };

  return (
    <>
      <div className="body">
        <form className="form-container" onSubmit={handleSubmit}>
          <img className="logo-empresa" src="/img/logo_siecu.png" alt="logo_aplicacion" />
          <h3>Inicio de Sesión</h3>
          <div className="form-container-input">
            <IoPersonOutline className="icon-react" />
            <input
              id="email-input"
              type="email"
              placeholder="Ingrese su email"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <p id="error-email"></p>
          <div className="form-container-input">
            < IoLockClosedOutline className="icon-react" />
            <input id="password-input"
              type="password"
              placeholder="Ingrese una contraseña"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <p id="error-password">{respuestaServer}</p>
          <a href="/registro">Registrarse</a>
          <button className="button" type="submit">
            <span>Iniciar Sesión</span>
            <IoArrowForwardOutline className="icon-btn" />
          </button>

        </form>
      </div>
    </>
  )
}

export default Login;

