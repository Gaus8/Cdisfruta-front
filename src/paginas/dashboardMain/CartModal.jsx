import { useState, useEffect, useRef } from "react";
import { 
  FaTrash, FaTimes, FaWhatsapp, FaUser, FaEnvelope, 
  FaPhone, FaMapMarkerAlt, FaHome, FaStickyNote, FaCheckCircle, FaGlobeAmericas, FaCity 
} from "react-icons/fa";
import "../../assets/styles/dashboardUsuario/cart_modal.css";

const COLOMBIA_GEO = {
  "Amazonas": ["El Encanto", "La Chorrera", "La Pedrera", "Leticia", "Mirití-Paraná", "Puerto Alegría", "Puerto Arica", "Puerto Nariño", "Puerto Santander", "Tarapacá"],
  "Antioquia": ["Amagá", "Apartadó", "Arboletes", "Barbacoas", "Bello", "Caldas", "Caucasia", "Chigorodó", "Copacabana", "Dabeiba", "El Bagre", "Envigado", "Girardota", "Itagüí", "La Estrella", "Medellín", "Necoclí", "Pto. Berrío", "Rionegro", "Sabaneta", "San Pedro de los Milagros", "Santa Bárbara", "Santa Rosa de Osos", "Segovia", "Sonsón", "Tarazá", "Titiribí", "Turbo", "Urrao", "Venecia", "Yarumal", "Yolombó"],
  "Arauca": ["Arauca", "Arauquita", "Cravo Norte", "Fortul", "Puerto Rondón", "Saravena", "Tame"],
  "Atlántico": ["Baranoa", "Barranquilla", "Galapa", "Luruaco", "Malambo", "Manatí", "Puerto Colombia", "Sabanagrande", "Sabaneta", "Santo Tomás", "Soledad", "Usiacurí"],
  "Bolívar": ["Achí", "Altos del Rosario", "Arenal", "Arjona", "Arroyohondo", "Barranco de Loba", "Cartagena de Indias", "Cicuco", "Clemencia", "Córdoba", "El Carmen de Bolívar", "El Guamo", "Hatillo de Loba", "Magangué", "Mahates", "Margarita", "Mompós", "Montecristo", "Morales", "Norosí", "Pinillos", "Regidor", "Río Viejo", "San Cristóbal", "San Estanislao", "San Fernando", "San Jacinto", "San Jacinto del Cauca", "San Juan Nepomuceno", "Santa Catalina", "Santa Rosa", "Santa Rosa del Sur", "Simití", "Soplaviento", "Talaigua Nuevo", "Tiquisio", "Turbaco", "Villanueva", "Zambrano"],
  "Boyacá": ["Aquitania", "Barbacoas", "Berbeo", "Beteitiva", "Boavita", "Boyacá", "Briceño", "Buenavista", "Bustamante", "Caldas", "Campohermoso", "Cerinza", "Chinavita", "Chiquinquirá", "Chiscas", "Chita", "Chitaraque", "Chivor", "Ciénega", "Cómbita", "Coper", "Corrales", "Covarachía", "Cubará", "Cucaita", "Cuítiva", "Duitama", "El Cocuy", "El Espino", "Firavitoba", "Floresta", "Gachantivá", "Gámeza", "Garagoa", "Guacamayas", "Guateque", "Guayatá", "Güicán", "Iza", "Jenesano", "Jericó", "Labranzagrande", "La Capira", "La Uvita", "La Victoria", "Macanal", "Maripí", "Miraflores", "Mongua", "Monguí", "Moniquirá", "Nobsa", "Oicatá", "Otanche", "Pachavita", "Páez", "Paipa", "Pajarito", "Panqueba", "Pauna", "Paya", "Paz de Río", "Pesca", "Pisba", "Puerto Boyacá", "Quípama", "Ramiriquí", "Ráquira", "Rondón", "Saboyá", "Sáchica", "Samacá", "San Eduardo", "San José de Pare", "San Luis de Gaceno", "San Mateo", "San Miguel de Sema", "San Pablo de Borbur", "Santana", "Santa María", "Santa Sofía", "Sativanorte", "Sativasur", "Siachoque", "Soatá", "Socha", "Sogamoso", "Somondoco", "Sora", "Soracá", "Sotaquirá", "Susacón", "Sutamarchán", "Sutatenza", "Tasco", "Tenza", "Tibaná", "Tibasosa", "Tinjacá", "Tipacoque", "Toca", "Togüí", "Tópaga", "Tota", "Tunja", "Tununguá", "Turmequé", "Tuta", "Tutasá", "Ventaquemada", "Villa de Leyva", "Viracachá", "Zetaquira"],
  "Caldas": ["Anserma", "Aranzazu", "Belalcázar", "Chinchiná", "Filadelfia", "La Dorada", "La Merced", "Manizales", "Manzanares", "Marmato", "Marquetalia", "Marulanda", "Neira", "Pácora", "Palestina", "Pensilvania", "Riosucio", "Samaná", "San José", "Supía", "Victoria", "Villamaría", "Viterbo"],
  "Caquetá": ["Albania", "Belén de los Andaquíes", "Cartagena del Chairá", "Curillo", "El Doncello", "El Paujil", "Florencia", "La Montañita", "Morelia", "Puerto Rico", "Solano", "Solita", "Valparaíso"],
  "Casanare": ["Aguazul", "Chameza", "Hato Corozal", "La Salina", "Maní", "Monterrey", "Pore", "Recetor", "Sabanalarga", "San Luis de Palenque", "Támara", "Tauramena", "Trinidad", "Villanueva", "Yopal"],
  "Cauca": ["Albania", "Argelia", "Balboa", "Bolívar", "Buenos Aires", "Cajibío", "Caldono", "Caloto", "Corinto", "El Tambo", "Florencia", "Guachené", "Guapí", "Inzá", "Jambaló", "La Sierra", "La Vega", "López de Micay", "Mercaderes", "Miranda", "Morales", "Padilla", "Páez", "Patía", "Piamonte", "Piendamó", "Popayán", "Puerto Tejada", "Puracé", "Rosas", "San Sebastián", "Santa Rosa", "Santander de Quilichao", "Silvia", "Sotará", "Sucre", "Timbío", "Timbiquí", "Toribío", "Totoró", "Villa Rica"],
  "Cesar": ["Aguachica", "Astrea", "Becerril", "Bosconia", "Chiriguaná", "Codazzi", "Curumaní", "El Copey", "El Paso", "Gamarra", "González", "La Gloria", "La Jagua de Ibirico", "La Paz", "Manaure Balcón del Cesar", "Pailitas", "Pelaya", "Río de Oro", "San Alberto", "San Diego", "San Martín", "Tamalameque", "Valledupar"],
  "Chocó": ["Acandí", "Alto Baudó", "Atrato", "Bagadó", "Bahía Solano", "Bajo Baudó", "Bojayá", "Cantón de San Pablo", "Cértegui", "Condoto", "El Carmen de Atrato", "El Carmen del Darién", "Istmina", "Juradó", "Litoral de San Juan", "Lloró", "Medio Atrato", "Medio Baudó", "Medio San Juan", "Nóvita", "Nuquí", "Quibdó", "Río Iró", "Río Quito", "Riosucio", "San José del Palmar", "Sipí", "Tadó", "Unguía"],
  "Córdoba": ["Ayapel", "Buenavista", "Canalete", "Cereté", "Chimá", "Chinú", "Ciénaga de Oro", "La Apartada", "Lorica", "Moñitos", "Montelíbano", "Montería", "Planeta Rica", "Puerto Escondido", "Puerto Libertador", "Sahagún", "San Antero", "San Bernardo del Viento", "San Carlos", "San Pelayo", "Tierralta", "Tuchín", "Valencia"],
  "Cundinamarca": ["Anapoima", "Anolaima", "Apulo", "Arbeláez", "Beltrán", "Bituima", "Bogotá D.C.", "Bojacá", "Cabrera", "Cachipay", "Cajicá", "Caparrapí", "Carmen de Carupa", "Chaguaní", "Chía", "Chocontá", "Cota", "El Peñón", "El Rosal", "Facatativá", "Fómeque", "Fosca", "Funza", "Fúquene", "Fusagasugá", "Gachancipá", "Gachetá", "Gama", "Girardot", "Granada", "Guachetá", "Guaduas", "Guasca", "Guataquí", "Guatavita", "Guayabal de Síquima", "Guayabetal", "Gutiérrez", "Jerusalén", "Junín", "La Calera", "La Mesa", "La Palma", "La Peña", "La Vega", "Lenguazaque", "Machetá", "Manta", "Medina", "Mosquera", "Nariño", "Nemocón", "Nilo", "Nimaima", "Nocaima", "Pacho", "Paime", "Pandi", "Paratebueno", "Pasca", "Puerto Salgar", "Pulí", "Quebradanegra", "Quetame", "Ricaurte", "San Antonio del Tequendama", "San Bernardo", "San Cayetano", "San Francisco", "San Juan de Rioseco", "Sasaima", "Sesquilé", "Sibaté", "Silvania", "Simijaca", "Soacha", "Sopó", "Subachoque", "Suesca", "Supatá", "Susa", "Sutatausa", "Tabio", "Tausa", "Tena", "Tenjo", "Tibacuy", "Tibirita", "Tocaima", "Tocancipá", "Topaipí", "Ubalá", "Ubaté", "Une", "Útica", "Venecia", "Vergara", "Vianí", "Villagómez", "Villapinzón", "Villeta", "Viotá", "Yacopí", "Zipacón", "Zipaquirá"],
  "Guainía": ["Barranco Minas", "Cacahual", "Inírida", "La Guadalupe", "Mapiripana", "Morichal", "Pana Pana", "Puerto Colombia", "San Felipe"],
  "Guaviare": ["Calamar", "El Retorno", "Miraflores", "San José del Guaviare"],
  "Huila": ["Aipe", "Algeciras", "Baraya", "Campoalegre", "Garzón", "Gigante", "Hobo", "Íquira", "Isnos", "La Argentina", "La Plata", "Nátaga", "Neiva", "Oporapa", "Paicol", "Palermo", "Pital", "Pitalito", "Rivera", "Saladoblanco", "San Agustín", "Santa María", "Suaza", "Tarqui", "Tello", "Teruel", "Tesalia", "Timaná", "Villavieja", "Yaguará"],
  "La Guajira": ["Albania", "Barrancas", "Dibulla", "El Molino", "Fonseca", "Hatonuevo", "Maicao", "Manaure", "Riohacha", "San Juan del Cesar", "Uribia", "Villanueva"],
  "Magdalena": ["Aracataca", "Cerro de San Antonio", "Chibolo", "Ciénaga", "Concordia", "El Banco", "El Piñón", "El Retén", "Fundación", "Guamal", "Pedraza", "Pivijay", "Plato", "Pueblo Viejo", "Remolino", "Sabanas de San Ángel", "Salamina", "San Sebastián de Buenavista", "San Zenón", "Santa Ana", "Santa Bárbara de Pinto", "Santa Marta", "Sitionuevo", "Tenerife", "Zapayán", "Zona Bananera"],
  "Meta": ["Acacías", "Cubarral", "Cumaral", "El Calvario", "El Castillo", "El Dorado", "Fuente de Oro", "Granada", "Lejanías", "Mapiripán", "Mesetas", "Puerto Concordia", "Puerto Gaitán", "Puerto Lleras", "Puerto López", "Puerto Rico", "Restrepo", "San Carlos de Guaroa", "San Juan de Arama", "San Juanito", "San Martín", "Villavicencio", "Vistahermosa"],
  "Nariño": ["Albán", "Aldana", "Ancuya", "Arboleda", "Barbacoas", "Buesaco", "Chachagüí", "Colón", "Consacá", "Contadero", "Córdoba", "Cuaspud", "Cumbal", "Cumbitara", "El Charco", "El Peñol", "El Rosario", "El Tablón de Gómez", "El Tambo", "Funes", "Guachucal", "Gualmatán", "Iles", "Imués", "Ipiales", "La Cruz", "La Florida", "La Llanada", "La Tola", "La Unión", "Leiva", "Linares", "Los Andes", "Magüí Payán", "Mallama", "Mosquera", "Nariño", "Olaya Herrera", "Ospina", "Pasto", "Policarpa", "Potosí", "Providencia", "Puerres", "Pupiales", "Ricaurte", "Roberto Payán", "Samaniego", "Sandoná", "San Bernardo", "San Lorenzo", "San Pablo", "San Pedro de Cartago", "Santa Bárbara", "Santacruz", "Sapuyes", "Taminango", "Tangua", "Tumaco", "Túquerres", "Yacuanquer"],
  "Norte de Santander": ["Ábrego", "Arboledas", "Bochalema", "Cachirá", "Cácota", "Cachirá", "Chitagá", "Convención", "Cúcuta", "El Carmen", "El Tarra", "El Zulia", "Gramalote", "Hacarí", "Herrán", "La Esperanza", "La Playa de Belén", "Labateca", "Los Patios", "Lourdes", "Mutiscua", "Ocaña", "Pamplona", "Pamplonita", "Puerto Santander", "Ragonvalia", "Salazar", "San Calixto", "San Cayetano", "Santiago", "Sardinata", "Silos", "Teorama", "Tibú", "Toledo", "Villa Caro", "Villa del Rosario"],
  "Putumayo": ["Colón", "Mocoa", "Orito", "Puerto Asís", "Puerto Caicedo", "Puerto Guzmán", "Puerto Leguízamo", "San Francisco", "San Miguel", "Santiago", "Valle del Guamuez", "Villagarzón"],
  "Quindío": ["Armenia", "Buenavista", "Calarcá", "Circasia", "Córdoba", "Filandia", "Génova", "La Tebaida", "Montenegro", "Pijao", "Quimbaya", "Salento"],
  "Risaralda": ["Apía", "Balboa", "Belén de Umbría", "Dosquebradas", "Guática", "La Celia", "La Virginia", "Marsella", "Mistrató", "Pereira", "Pueblo Rico", "Quinchía", "Santa Rosa de Cabal", "Santuario"],
  "San Andrés y Providencia": ["Providencia y Santa Catalina", "San Andrés"],
  "Santander": ["Aratoca", "Barbosa", "Barichara", "Barrancabermeja", "Bolívar", "Bucaramanga", "Cabrera", "California", "Capitanejo", "Carcasí", "Cepitá", "Cerrito", "Charalá", "Charta", "Chima", "Chipatá", "Cimitarra", "Concepción", "Confines", "Contratación", "Coromoro", "El Carmen de Chucurí", "El Guacamayo", "El Peñón", "El Playón", "Encino", "Enciso", "Florián", "Floridablanca", "Galán", "Gámbita", "Girón", "Guaca", "Guadalupe", "Guapotá", "Guavatá", "Güepsa", "Hato", "Jesús María", "Jordán", "La Belleza", "La Paz", "Landázuri", "Lebrija", "Los Santos", "Macaravita", "Málaga", "Matanza", "Mogotes", "Molagavita", "Oiba", "Ocamonte", "Páramo", "Piedecuesta", "Pinchote", "Puente Nacional", "Puerto Parra", "Puerto Wilches", "Rionegro", "Sabana de Torres", "San Andrés", "San Benito", "San Gil", "San Joaquín", "San José de Miranda", "San Miguel", "San Vicente de Chucurí", "Santa Bárbara", "Santa Helena del Opón", "Simacota", "Socorro", "Suaita", "Sucre", "Suratá", "Tona", "Valle de San José", "Vélez", "Vetas", "Villanueva", "Zapatoca"],
  "Sucre": ["Buenavista", "Caimito", "Chalán", "Colosó", "Corozal", "Coveñas", "El Roble", "Galeras", "Guaranda", "La Unión", "Los Palmitos", "Majagual", "Morroa", "Ovejas", "Sampués", "San Benito Abad", "San Juan de Betulia", "San Marcos", "San Onofre", "San Pedro", "Sincé", "Sincelejo", "Sucre", "Tolú", "Tolú Viejo"],
  "Tolima": ["Alpujarra", "Alvarado", "Ambalema", "Anzoátegui", "Armero", "Ataco", "Cajamarca", "Carmen de Apicalá", "Casabianca", "Chaparral", "Coello", "Coyaima", "Cunday", "Dolores", "El Espinal", "Falan", "Flandes", "Fresno", "Guamo", "Herveo", "Honda", "Ibagué", "Icononzo", "Lérida", "Líbano", "Mariquita", "Melgar", "Murillo", "Natagaima", "Ortega", "Palocabildo", "Piedras", "Planadas", "Prado", "Purificación", "Rioblanco", "Roncesvalles", "Rovira", "Saldaña", "San Antonio", "San Luis", "Santa Isabel", "Suárez", "Valle de San Juan", "Venadillo", "Villahermosa", "Villarrica"],
  "Valle del Cauca": ["Alcalá", "Andalucía", "Ansermanuevo", "Argelia", "Bolívar", "Buenaventura", "Buga", "Bugalagrande", "Caicedonia", "Cali", "Calima", "Candelaria", "Cartago", "Dagua", "El Águila", "El Cairo", "El Cerrito", "El Dovio", "Florida", "Ginebra", "Guacarí", "Jamundí", "La Cumbre", "La Unión", "La Victoria", "Obando", "Palmira", "Pradera", "Restrepo", "Riofrío", "Roldanillo", "San Pedro", "Sevilla", "Toro", "Trujillo", "Tuluá", "Ulloa", "Versalles", "Yotoco", "Yumbo", "Zarzal"],
  "Vaupés": ["Carurú", "Mitú", "Pacoa", "Papunaua", "Taraira", "Yavaraté"],
  "Vichada": ["Cumaribo", "La Primavera", "Puerto Carreño", "Santa Rosalía"]
};

const DEPARTAMENTOS_ORDENADOS = Object.keys(COLOMBIA_GEO).sort();

export default function CartModal({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [municipiosDisponibles, setMunicipiosDisponibles] = useState([]);
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    whatsapp: "",
    departamento: "",
    municipio: "",
    direccion: "",
    barrio: "",
    nota: "",
    correo: "",
    compromiso: false
  });

  useEffect(() => {
    if (formData.departamento && COLOMBIA_GEO[formData.departamento]) {
      setMunicipiosDisponibles(COLOMBIA_GEO[formData.departamento]);
      setFormData(prev => ({ ...prev, municipio: "" }));
    } else {
      setMunicipiosDisponibles([]);
      setFormData(prev => ({ ...prev, municipio: "" }));
    }
  }, [formData.departamento]);

  useEffect(() => {
    const handleSync = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart_cdisfruta") || "[]");
      setCartItems(savedCart);
    };

    if (isOpen) {
      handleSync();
      window.addEventListener('cartUpdate', handleSync);
    }
    return () => window.removeEventListener('cartUpdate', handleSync);
  }, [isOpen]);

  const total = cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  const removeItem = (id) => {
    const currentCart = JSON.parse(localStorage.getItem("cart_cdisfruta") || "[]");
    const newCart = currentCart.filter(item => item._id !== id);
    
    setCartItems(newCart);
    localStorage.setItem("cart_cdisfruta", JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleConfirmarPedido = () => {
    // 1. Validar los campos requeridos mediante el formulario nativo del navegador
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity(); // Esto despliega la alerta nativa señalando el campo faltante
      return;
    }

    // 2. Validar explícitamente el checkbox de compromiso
    if (!formData.compromiso) {
      alert("⚠️ Debes aceptar el compromiso de pago contra entrega para poder confirmar tu pedido en CDISFRUTA.shop.");
      return;
    }

    // 3. Generar el mensaje y abrir WhatsApp si todo es correcto
    const mensaje = 
      `🍃 *CDISFRUTA.SHOP - NUEVO PEDIDO* 🍃\n` +
      `✨ _¡Gracias por elegirnos para tus momentos saludables!_ ✨\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *CLIENTE*\n` +
      `• Nombre: ${formData.nombres} ${formData.apellidos}\n` +
      `• WhatsApp: ${formData.whatsapp}\n` +
      `• Correo: ${formData.correo || 'No especificado'}\n\n` +
      `📍 *ENTREGAS*\n` +
      `• Departamento: ${formData.departamento}\n` +
      `• Ciudad / Municipio: ${formData.municipio}\n` +
      `• Dirección: ${formData.direccion}\n` +
      `• Barrio / Sector: ${formData.barrio}\n` +
      `• Observaciones: ${formData.nota || 'Ninguna'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🛒 *RESUMEN DE PRODUCTOS:*\n` +
      cartItems.map(i => `  ▪️ *${i.nombre}* \n    Cantidad: ${i.quantity} | Subtotal: *$${(i.precio * i.quantity).toLocaleString("es-CO")}*`).join('\n\n') + `\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💳 *TOTAL A PAGAR: *$${total.toLocaleString("es-CO")}* (Pago Contra Entrega)\n` +
      `✅ _Pedido verificado y respaldado por el cliente._`;

    const miNumero = "573229683625";
    const whatsappUrl = `https://wa.me/${miNumero}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2><FaCheckCircle style={{color: '#ff7a5c'}} /> Tu Carrito</h2>
          <button className="close-cart-btn" onClick={onClose} aria-label="Cerrar carrito">
            <FaTimes />
          </button>
        </div>

        <div className="cart-body">
          <div className="cart-items-section">
            {cartItems.length === 0 ? (
              <p className="empty-cart-msg">Tu carrito está vacío</p>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="cart-item-professional">
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="item-info">
                    <h4>{item.nombre}</h4>
                    <p>{item.quantity} x <span>${item.precio.toLocaleString("es-CO")}</span></p>
                  </div>
                  <button className="remove-btn-minimal" onClick={() => removeItem(item._id)}>
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>

          <form ref={formRef} className="checkout-form-professional" onSubmit={(e) => e.preventDefault()}>
            <h3>Datos de Entrega</h3>
            
            <div className="form-grid">
              <div className="input-box">
                <label>Nombres *</label>
                <div className="input-field">
                  <FaUser />
                  <input type="text" name="nombres" required value={formData.nombres} onChange={handleInputChange} placeholder="Ej. Juan" />
                </div>
              </div>
              <div className="input-box">
                <label>Apellidos *</label>
                <div className="input-field">
                  <FaUser />
                  <input type="text" name="apellidos" required value={formData.apellidos} onChange={handleInputChange} placeholder="Ej. Pérez" />
                </div>
              </div>
            </div>

            <div className="input-box">
              <label>Número de WhatsApp *</label>
              <div className="input-field">
                <FaPhone />
                <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} placeholder="310..." />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-box">
                <label>Departamento *</label>
                <div className="input-field">
                  <FaGlobeAmericas />
                  <select name="departamento" value={formData.departamento} onChange={handleInputChange} className="filter-select" required>
                    <option value="">Seleccione departamento...</option>
                    {DEPARTAMENTOS_ORDENADOS.map((dep, idx) => (
                      <option key={idx} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-box">
                <label>Municipio / Ciudad *</label>
                <div className="input-field">
                  <FaCity />
                  <select 
                    name="municipio" 
                    value={formData.municipio} 
                    onChange={handleInputChange} 
                    className="filter-select" 
                    required 
                    disabled={!formData.departamento}
                  >
                    <option value="">{formData.departamento ? "Seleccione municipio..." : "Elija un departamento primero"}</option>
                    {municipiosDisponibles.map((mun, idx) => (
                      <option key={idx} value={mun}>{mun}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="input-box">
                <label>Dirección *</label>
                <div className="input-field">
                  <FaMapMarkerAlt />
                  <input type="text" name="direccion" required value={formData.direccion} onChange={handleInputChange} placeholder="Calle/Cra..." />
                </div>
              </div>
              <div className="input-box">
                <label>Barrio o Sector *</label>
                <div className="input-field">
                  <FaHome />
                  <input type="text" name="barrio" required value={formData.barrio} onChange={handleInputChange} placeholder="Ej. Centro" />
                </div>
              </div>
            </div>

            <div className="input-box">
              <label>Correo electrónico (Opcional)</label>
              <div className="input-field">
                <FaEnvelope />
                <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} placeholder="tu@email.com" />
              </div>
            </div>

            <div className="input-box">
              <label>Nota del pedido</label>
              <div className="input-field textarea">
                <FaStickyNote />
                <textarea name="nota" value={formData.nota} onChange={handleInputChange} placeholder="Especificar detalles de Casa, Unidad y/o Apartamento"></textarea>
              </div>
            </div>

            <div className="checkbox-container">
              <input type="checkbox" id="compromiso" name="compromiso" checked={formData.compromiso} onChange={handleInputChange} />
              <label htmlFor="compromiso">
                Me comprometo a pagar al recibir mi producto y confirmo que mis datos son correctos.
              </label>
            </div>

            <div className="cart-footer-sticky">
              <div className="total-display">
                <span>Total a pagar</span>
                <strong>${total.toLocaleString("es-CO")}</strong>
              </div>
              <button 
                type="button" 
                className="btn-confirm-whatsapp" 
                onClick={handleConfirmarPedido}
                disabled={cartItems.length === 0}
              >
                Confirmar Pedido <FaWhatsapp size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}