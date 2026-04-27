import '../../assets/Styles/mainPage/mainpage.css';
import Videos from './Videos';

// ICONOS
import { MdOutlineComputer } from "react-icons/md";
import { IoIosTimer } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import CarruselProductos from './Carrusel';
import Header from './Header';

function MainPage() {
  return (
    <div className="main-container"> {/* Contenedor padre opcional para control total */}
      <Header />
      <CarruselProductos />
      <Videos />

      <section id="section-icons">
        <div className="icon-card">
          <MdOutlineComputer size={40} />
          <h3 className="icon-text">Aplicación Responsive</h3>
        </div>
        <div className="icon-card">
          <IoIosTimer size={40} />
          <h3 className="icon-text">Procesos Rápidos</h3>
        </div>
        <div className="icon-card">
          <AiOutlineGlobal size={40} />
          <h3 className="icon-text">Modernización</h3>
        </div>
        <div className="icon-card">
          <FaArrowTrendUp size={40} />
          <h3 className="icon-text">Alto Rendimiento</h3>
        </div>
      </section>

      <footer className="main-footer">
        <div className="footer-info">
          <div className="info-item">
            <IoLocationOutline size={20} />
            <p>Ubaté, Cundinamarca</p>
          </div>
          <div className="info-item">
            <BsTelephone size={20} />
            <p>300 710 8920</p>
          </div>
          <div className="info-item">
            <MdOutlineMail size={20} />
            <p>cdifruta@gmail.com</p>
          </div>
        </div>
        
        <div className="footer-social">
          <h3>Acerca de CDISFRUTA</h3>
          <p>
            Somos una empresa de Ubaté con cuatro años en el mercado, dedicada 
            a la <strong>producción de frutas deshidratadas</strong>, promoviendo una
            alimentación saludable.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;