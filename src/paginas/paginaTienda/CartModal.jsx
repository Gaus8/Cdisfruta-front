import { tw } from '../../funciones/tw.js';
import { useState, useEffect, useRef } from "react";
import { 
  FaTrash, FaTimes, FaWhatsapp, FaUser, FaEnvelope, 
  FaPhone, FaMapMarkerAlt, FaHome, FaStickyNote, FaCheckCircle, FaGlobeAmericas, FaCity 
} from "react-icons/fa";
import { apiAxios } from "../../funciones/conexion";
import { useNavigate } from 'react-router-dom';

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
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [orderComplete, setOrderComplete] = useState(null);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [accountAlreadyExists, setAccountAlreadyExists] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  
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

  const municipiosDisponibles = COLOMBIA_GEO[formData.departamento] || [];

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
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'departamento' ? { municipio: '' } : {})
    });
  };

  const handleConfirmarPedido = async () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    if (!formData.compromiso) {
      alert("⚠️ Debes aceptar el compromiso de pago contra entrega para poder confirmar tu pedido en CDISFRUTA.shop.");
      return;
    }

    setSubmittingOrder(true);
    const nuevoPedido = {
      productos: cartItems.map(i => ({
        productoId: i._id,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.quantity,
        imagen: i.imagen || i.img || i.url || i.foto
      })),
      total: total,
      datosEnvio: {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        whatsapp: formData.whatsapp,
        departamento: formData.departamento,
        municipio: formData.municipio,
        direccion: formData.direccion,
        barrio: formData.barrio,
        correo: formData.correo,
        nota: formData.nota
      }
    };

    try {
      // 2. Guardar pedido en MongoDB mediante la API
      const { data: orderResponse } = await apiAxios.post('/pedidos', nuevoPedido);

      // 3. Generar mensaje de WhatsApp
      const confirmedTotal = Number(orderResponse.pedido?.total || total);
      const confirmedItems = orderResponse.pedido?.productos || cartItems;
      const mensaje = 
        `*CDISFRUTA SHOP - NUEVO PEDIDO*\n` +
        `_Gracias por elegir nuestros productos._\n\n` +
        `--------------------------------\n` +
        `*CLIENTE*\n` +
        `- Nombre: ${formData.nombres} ${formData.apellidos}\n` +
        `- WhatsApp: ${formData.whatsapp}\n` +
        `- Correo: ${formData.correo || 'No especificado'}\n\n` +
        `*ENTREGAS*\n` +
        `- Departamento: ${formData.departamento}\n` +
        `- Ciudad / Municipio: ${formData.municipio}\n` +
        `- Dirección: ${formData.direccion}\n` +
        `- Barrio / Sector: ${formData.barrio}\n` +
        `- Observaciones: ${formData.nota || 'Ninguna'}\n` +
        `--------------------------------\n\n` +
        `*RESUMEN DE PRODUCTOS*\n` +
        confirmedItems.map(i => `- *${i.nombre}*\n  Cantidad: ${i.cantidad ?? i.quantity} | Subtotal: *$${(i.precio * (i.cantidad ?? i.quantity)).toLocaleString("es-CO")}*`).join('\n\n') + `\n\n` +
        `--------------------------------\n` +
        `*TOTAL A PAGAR: $${confirmedTotal.toLocaleString("es-CO")}* (Pago contra entrega)\n` +
        `_Pedido confirmado por el cliente._`;

      const miNumero = "573229683625"; // Puedes cambiarlo si usas otro número aquí
      const whatsappUrl = `https://wa.me/${miNumero}?text=${encodeURIComponent(mensaje)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // 4. LIMPIAR CARRITO Y CERRAR MODAL AUTOMÁTICAMENTE
      localStorage.removeItem("cart_cdisfruta");
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdate'));
      const guest = Boolean(orderResponse.guestClaimToken);
      setOrderComplete({ id: orderResponse.pedido?.id, total: confirmedTotal, claimToken: orderResponse.guestClaimToken, guest });
      setConfirmEmail(formData.correo);
      setRegistrationComplete(false);
      setAccountAlreadyExists(false);
      setRegisterError('');
      if (guest && orderResponse.guestClaimToken) {
        sessionStorage.setItem('guest_order_claim', JSON.stringify({ claimToken: orderResponse.guestClaimToken, email: formData.correo.trim().toLowerCase() }));
      }

    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      alert(error.response?.data?.message || "Hubo un error al registrar tu pedido en el sistema. Inténtalo de nuevo.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handlePostPurchaseRegistration = async (event) => {
    event.preventDefault();
    setRegisterError('');
    const email = String(formData.correo || '').trim().toLowerCase();
    const repeatedEmail = String(confirmEmail || '').trim().toLowerCase();
    if (email !== repeatedEmail) {
      setRegisterError('Los correos no coinciden. Confirma el mismo correo usado en el pedido.');
      return;
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.!@#$%^&*])[\S]{8,16}$/.test(accountPassword)) {
      setRegisterError('Usa de 8 a 16 caracteres, con mayúscula, minúscula, número y símbolo (.!@#$%^&*).');
      return;
    }
    if (!acceptTerms) {
      setRegisterError('Debes aceptar los términos y la política de tratamiento de datos.');
      return;
    }
    setRegistering(true);
    try {
      const { data } = await apiAxios.post('/auth/registro-post-compra', {
        name: `${formData.nombres} ${formData.apellidos}`.replace(/[^\p{L}\s]/gu, ' ').replace(/\s+/g, ' ').trim(),
        email,
        emailConfirmacion: repeatedEmail,
        password: accountPassword,
        terminosAceptados: true,
        claimToken: orderComplete.claimToken
      });
      localStorage.setItem('userEmail', email);
      sessionStorage.removeItem('guest_order_claim');
      setRegistrationComplete(true);
      setVerificationEmailSent(data.correoEnviado !== false);
      setVerificationMessage(data.correoEnviado === false ? data.message : '');
      setAccountAlreadyExists(false);
      setAccountPassword('');
    } catch (error) {
      const message = error.response?.data?.message || 'No se pudo crear la cuenta. El pedido permanece registrado.';
      setAccountAlreadyExists(Boolean(error.response?.status === 409 && message.toLowerCase().includes('ya tiene una cuenta')));
      setRegisterError(message);
    } finally { setRegistering(false); }
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    setVerificationMessage('');
    try {
      const { data } = await apiAxios.post('/auth/reenviar-verificacion-post-compra', {
        email: formData.correo.trim().toLowerCase()
      });
      setVerificationEmailSent(true);
      setVerificationMessage(data.message || 'Enviamos el código de verificación.');
    } catch (error) {
      setVerificationMessage(error.response?.data?.message || 'No se pudo enviar el código ahora. Inténtalo más tarde.');
    } finally {
      setResendingVerification(false);
    }
  };

  const closeCart = () => {
    setOrderComplete(null);
    setRegistrationComplete(false);
    setRegisterError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={tw("cart-modal-overlay")} onClick={closeCart}>
      <div className={tw("cart-modal-content")} onClick={(e) => e.stopPropagation()}>
        <div className={tw("cart-header")}>
          <h2><FaCheckCircle className={tw("![color:#ff7a5c]")} /> Tu Carrito</h2>
          <button className={tw("close-cart-btn")} onClick={closeCart} aria-label="Cerrar carrito">
            <FaTimes />
          </button>
        </div>

        {orderComplete ? <section className={tw('cart-body')}>
          <div className={tw('mx-auto my-6 w-full max-w-2xl rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:my-10 sm:p-8')}>
            <div className={tw('mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600')}><FaCheckCircle /></div>
            <h3 className={tw('mt-4 text-center text-2xl font-bold text-slate-800')}>¡Pedido confirmado!</h3>
            <p className={tw('mt-2 text-center text-sm leading-6 text-slate-600')}>Registramos tu pedido{orderComplete.id ? ` #${String(orderComplete.id).slice(-8).toUpperCase()}` : ''} por <strong>${orderComplete.total.toLocaleString('es-CO')}</strong>. Te contactaremos con los datos de envío que proporcionaste.</p>
            {orderComplete.guest && !registrationComplete && <div className={tw('mt-6 rounded-2xl border border-orange-100 bg-orange-50/50 p-4 sm:p-5')}>
              <div className={tw('mb-4')}><h4 className={tw('font-bold text-slate-800')}>Crea tu cuenta para consultar el pedido</h4><p className={tw('mt-1 text-sm leading-5 text-slate-600')}>Tu compra quedará vinculada automáticamente. Confirma el correo del pedido y define una contraseña.</p></div>
              <form onSubmit={handlePostPurchaseRegistration} className={tw('space-y-3')}>
                <label className={tw('block text-sm font-medium text-slate-700')}>Correo del pedido<input type="email" value={formData.correo} readOnly className={tw('mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-600')} /></label>
                <label className={tw('block text-sm font-medium text-slate-700')}>Confirma tu correo<input type="email" required autoComplete="email" value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)} className={tw('mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#ff7e5f] focus:ring-4 focus:ring-orange-100')} /></label>
                <label className={tw('block text-sm font-medium text-slate-700')}>Crea una contraseña<input type="password" required minLength={8} maxLength={16} autoComplete="new-password" value={accountPassword} onChange={(event) => setAccountPassword(event.target.value)} className={tw('mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#ff7e5f] focus:ring-4 focus:ring-orange-100')} /><span className={tw('mt-1 block text-xs font-normal text-slate-500')}>8–16 caracteres, una mayúscula, minúscula, número y símbolo.</span></label>
                <label className={tw('flex items-start gap-2 text-xs leading-5 text-slate-600')}><input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} className={tw('mt-1 accent-[#ff7e5f]')} /><span>Acepto los <a href="/terminos" target="_blank" rel="noreferrer" className={tw('font-semibold text-[#e06d43] underline')}>Términos y Condiciones</a> y la <a href="/politica-datos" target="_blank" rel="noreferrer" className={tw('font-semibold text-[#e06d43] underline')}>Política de Tratamiento de Datos</a>.</span></label>
                {registerError && <p role="alert" className={tw('rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700')}>{registerError}</p>}
                {accountAlreadyExists && <button type="button" onClick={() => { closeCart(); navigate('/login'); }} className={tw('min-h-11 w-full rounded-xl border border-[#e06d43] bg-white px-4 text-sm font-semibold text-[#e06d43] hover:bg-orange-50')}>Iniciar sesión y asociar mi pedido</button>}
                <button type="submit" disabled={registering} className={tw('min-h-12 w-full rounded-xl bg-[#ff7e5f] px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-[#e06d43] disabled:opacity-60')}>{registering ? 'Creando cuenta…' : 'Crear cuenta y vincular pedido'}</button>
              </form>
            </div>}
            {registrationComplete && <div role="status" className={tw('mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center')}><p className={tw('font-semibold text-emerald-800')}>Cuenta creada y pedido asociado.</p><p className={tw('mt-1 text-sm leading-5 text-emerald-700')}>{verificationEmailSent ? 'Enviamos un código de verificación a tu correo. Verifícalo para activar el acceso y consultar tus pedidos.' : 'El correo de verificación no pudo enviarse por el momento. Tu cuenta y pedido están guardados; podrás solicitar el código más tarde.'}</p>{verificationMessage && <p className={tw('mt-2 text-sm text-slate-600')} aria-live="polite">{verificationMessage}</p>}{!verificationEmailSent && <button type="button" onClick={handleResendVerification} disabled={resendingVerification} className={tw('mt-3 min-h-10 rounded-xl border border-emerald-700 bg-white px-4 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-60')}>{resendingVerification ? 'Solicitando código…' : 'Reintentar envío del código'}</button>}<button type="button" onClick={() => { closeCart(); navigate('/validacion'); }} className={tw('mt-3 min-h-10 w-full rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800')}>Ir a verificación</button></div>}
            <button type="button" onClick={closeCart} className={tw('mt-4 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50')}>Continuar comprando</button>
          </div>
        </section> : <div className={tw("cart-body")}>
          <div className={tw("cart-items-section")}>
            {cartItems.length === 0 ? (
              <p className={tw("empty-cart-msg")}>Tu carrito está vacío</p>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className={tw("cart-item-professional")}>
                  <img src={item.imagen} alt={item.nombre} />
                  <div className={tw("item-info")}>
                    <h4>{item.nombre}</h4>
                    <p>{item.quantity} x <span>${item.precio.toLocaleString("es-CO")}</span></p>
                  </div>
                  <button className={tw("remove-btn-minimal")} onClick={() => removeItem(item._id)}>
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>

          <form ref={formRef} className={tw("checkout-form-professional")} onSubmit={(e) => e.preventDefault()}>
            <h3>Datos de Entrega</h3>
            
            <div className={tw("form-grid")}>
              <div className={tw("input-box")}>
                <label>Nombres *</label>
                <div className={tw("input-field")}>
                  <FaUser />
                  <input type="text" name="nombres" required value={formData.nombres} onChange={handleInputChange} placeholder="Ej. Juan" />
                </div>
              </div>
              <div className={tw("input-box")}>
                <label>Apellidos *</label>
                <div className={tw("input-field")}>
                  <FaUser />
                  <input type="text" name="apellidos" required value={formData.apellidos} onChange={handleInputChange} placeholder="Ej. Pérez" />
                </div>
              </div>
            </div>

            <div className={tw("input-box")}>
              <label>Número de WhatsApp *</label>
              <div className={tw("input-field")}>
                <FaPhone />
                <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} placeholder="310..." />
              </div>
            </div>

            <div className={tw("form-grid")}>
              <div className={tw("input-box")}>
                <label>Departamento *</label>
                <div className={tw("input-field")}>
                  <FaGlobeAmericas />
                  <select name="departamento" value={formData.departamento} onChange={handleInputChange} className={tw("filter-select")} required>
                    <option value="">Seleccione departamento...</option>
                    {DEPARTAMENTOS_ORDENADOS.map((dep, idx) => (
                      <option key={idx} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={tw("input-box")}>
                <label>Municipio / Ciudad *</label>
                <div className={tw("input-field")}>
                  <FaCity />
                  <select 
                    name="municipio" 
                    value={formData.municipio} 
                    onChange={handleInputChange} 
                    className={tw("filter-select")} 
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

            <div className={tw("form-grid")}>
              <div className={tw("input-box")}>
                <label>Dirección *</label>
                <div className={tw("input-field")}>
                  <FaMapMarkerAlt />
                  <input type="text" name="direccion" required value={formData.direccion} onChange={handleInputChange} placeholder="Calle/Cra..." />
                </div>
              </div>
              <div className={tw("input-box")}>
                <label>Barrio o Sector *</label>
                <div className={tw("input-field")}>
                  <FaHome />
                  <input type="text" name="barrio" required value={formData.barrio} onChange={handleInputChange} placeholder="Ej. Centro" />
                </div>
              </div>
            </div>

            <div className={tw("input-box")}>
              <label>Correo electrónico *</label>
              <div className={tw("input-field")}>
                <FaEnvelope />
                <input type="email" name="correo" required value={formData.correo} onChange={handleInputChange} placeholder="tu@email.com" />
              </div>
            </div>

            <div className={tw("input-box")}>
              <label>Nota del pedido</label>
              <div className={tw("input-field textarea")}>
                <FaStickyNote />
                <textarea name="nota" value={formData.nota} onChange={handleInputChange} placeholder="Especificar detalles de Casa, Unidad y/o Apartamento"></textarea>
              </div>
            </div>

            <div className={tw("checkbox-container")}>
              <input type="checkbox" id="compromiso" name="compromiso" checked={formData.compromiso} onChange={handleInputChange} />
              <label htmlFor="compromiso">
                Me comprometo a pagar al recibir mi producto y confirmo que mis datos son correctos.
              </label>
            </div>

            <div className={tw("cart-footer-sticky")}>
              <div className={tw("total-display")}>
                <span>Total a pagar</span>
                <strong>${total.toLocaleString("es-CO")}</strong>
              </div>
              <button 
                type="button" 
                className={tw("btn-confirm-whatsapp")} 
                onClick={handleConfirmarPedido}
                disabled={cartItems.length === 0 || submittingOrder}
              >
                {submittingOrder ? 'Registrando pedido…' : <>Confirmar Pedido <FaWhatsapp size={20} /></>}
              </button>
            </div>
          </form>
        </div>}
      </div>
    </div>
  );
}
