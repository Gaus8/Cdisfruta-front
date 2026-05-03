import { FaBell, FaUserCircle } from "react-icons/fa";
import '../../assets/styles/dashboardAdmin/header_admin.css'

export default function Header({ userName }) {
  return (
    <header className="header-admin">
      <div className="header-search">
        <input type="text" placeholder="Buscar..." />
      </div>
      <div className="header-actions">
        <FaBell className="icon-btn" />
        <div className="user-profile">
          <span>{userName}</span>
          <FaUserCircle size={24} />
        </div>
      </div>
    </header>
  );
}