import { useNavigate } from 'react-router';
import { IoLockClosedOutline, IoLogInOutline, IoHomeOutline } from 'react-icons/io5';
import '../../assets/styles/usuarios/acceso_denegado.css'

function AccesoDenegado() {
  const navigate = useNavigate();

  return (
    <div className="acceso-wrapper">
      <div className="acceso-container">

        <div className="lock-wrap">
          <IoLockClosedOutline size={36} />
        </div>

        <span className="code-pill">401 unauthorized</span>

        <h1 className="acceso-title">Acceso restringido</h1>
        <p className="acceso-subtitle">
          No tienes credenciales para ver esta página.<br />
          Inicia sesión para continuar.
        </p>

        <div className="acceso-divider" />

        <div className="acceso-actions">
          <button className="btn-primary" onClick={() => navigate('/')}>
            <IoLogInOutline size={16} />
            Iniciar sesión
          </button>
          <button className="btn-ghost" onClick={() => navigate('/')}>
            <IoHomeOutline size={16} />
            Volver al inicio
          </button>
        </div>

        <p className="acceso-meta">cdisfruta.shop · sesión no autenticada</p>
      </div>
    </div>
  );
}

export default AccesoDenegado;