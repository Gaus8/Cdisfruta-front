
import Videos from './Videos';
//ICONOS SECCION

import { MdOutlineComputer } from "react-icons/md";
import { IoIosTimer } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
//ICONOS FOOTER
import { IoLocationOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import CarruselProductos from './Carrusel';
import Header from './Header';

function MainPage() {

  return (
    <>
    <Header />
   
   <CarruselProductos/>

      <Videos />
      <section id="section-icons">
        <div className="section-icons-1">
          <h3 className="icon-text">Aplicación Responsive</h3>
          <MdOutlineComputer size={30} />
        </div>
        <div className="section-icons-2">
          <h3 className="icon-text">Procesos</h3>
          <IoIosTimer size={30} />
        </div>
        <div className="section-icons-3">
          <h3 className="icon-text">Modenizacion</h3>
          <AiOutlineGlobal size={30} />
        </div>
        <div className="section-icons-4">
          <h3 className="icon-text">Rendimiento</h3>
          <FaArrowTrendUp size={30} />
        </div>
      </section>

      <footer>
        <div className="footer-info">
          <div>
            <IoLocationOutline size={15} />
            <p>Ubaté, Cundinamarca</p>
          </div>
          <div>
            <BsTelephone size={15} />
            <p>3007108920</p>
          </div>
          <div>
            <MdOutlineMail size={15} />
            <p>cdifruta@gmail.com</p>
          </div>
        </div>
        <div className="footer-social">
          <h3>Acerca de CDISFRUTA</h3>
          <p>Somos una empresa de Ubaté con cuatro años en el mercado, dedicada <br />
            a la produccion de frutas deshidratas, promoviendo una
            alimentacion saludable.
          </p>
        </div>

      </footer>



    </>
  )
}

export default MainPage;

