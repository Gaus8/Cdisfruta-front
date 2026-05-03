import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import '../../assets/styles/dashboardUsuario/header_usuario.css';

export default function HeaderDashboard() {
  return (
    <header className="user-header">
      <div className="header-content">
        <h1 className="logo">CDISFRUTA<span>.shop</span></h1>
        
        <div className="search-bar">
          <input type="text" placeholder="Buscar snacks saludables..." />
          <button className="search-btn"><FaSearch /></button>
        </div>

        <div className="header-icons">
          <div className="icon-badge">
            <FaShoppingCart className="icon" />
            <span className="badge">0</span>
          </div>
          <FaUserCircle className="icon user-profile-icon" />
        </div>
      </div>
    </header>
  );
}