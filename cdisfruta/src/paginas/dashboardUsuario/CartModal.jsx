import { useState, useEffect } from "react";
import { 
  FaTrash, FaTimes, FaWhatsapp, FaUser, FaEnvelope, 
  FaPhone, FaMapMarkerAlt, FaHome, FaStickyNote, FaCheckCircle 
} from "react-icons/fa";
import "../../assets/styles/dashboardUsuario/cart_modal.css";

export default function CartModal({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    whatsapp: "",
    direccion: "",
    barrio: "",
    nota: "",
    correo: "",
    compromiso: false
  });

  useEffect(() => {
    if (isOpen) {
      const savedCart = JSON.parse(localStorage.getItem("cart_cdisfruta") || "[]");
      setCartItems(savedCart);
    }
  }, [isOpen]);

  const total = cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  const removeItem = (id) => {
    const newCart = cartItems.filter(item => item._id !== id);
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

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!formData.compromiso) {
      alert("Por favor, acepta el compromiso de pago para continuar.");
      return;
    }

    const mensaje = `*Nuevo Pedido CDISFRUTA*\n\n` +
      `*Cliente:* ${formData.nombres} ${formData.apellidos}\n` +
      `*WhatsApp:* ${formData.whatsapp}\n` +
      `*Dirección:* ${formData.direccion} - ${formData.barrio}\n` +
      `*Nota:* ${formData.nota || 'Ninguna'}\n\n` +
      `*Productos:*\n${cartItems.map(i => `- ${i.nombre} (x${i.quantity})`).join('\n')}\n\n` +
      `*Total a pagar: $${total.toLocaleString()}*`;

    const miNumero = "573112865361";
    // Usamos la variable miNumero dentro del template string
    const whatsappUrl = `https://wa.me/${miNumero}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
    
    // Opcional: Limpiar carrito después de pedir
    // localStorage.removeItem("cart_cdisfruta");
    // window.dispatchEvent(new Event('cartUpdate'));
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
            <h2><FaCheckCircle style={{color: '#ff7a5c'}} /> Tu Carrito</h2>
            {/* Botón de cerrar estilizado */}
            <button className="close-cart-btn" onClick={onClose} aria-label="Cerrar carrito">
                <FaTimes />
            </button>
            </div>

        <div className="cart-body">
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-professional">
                <img src={item.imagen} alt={item.nombre} />
                <div className="item-info">
                  <h4>{item.nombre}</h4>
                  <p>{item.quantity} x <span>${item.precio.toLocaleString()}</span></p>
                </div>
                <button className="remove-btn-minimal" onClick={() => removeItem(item._id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <form className="checkout-form-professional" onSubmit={handleCheckout}>
            <h3>Datos de Entrega</h3>
            
            <div className="form-grid">
              <div className="input-box">
                <label>Nombres *</label>
                <div className="input-field">
                  <FaUser />
                  <input type="text" name="nombres" required onChange={handleInputChange} placeholder="Ej. Juan" />
                </div>
              </div>
              <div className="input-box">
                <label>Apellidos *</label>
                <div className="input-field">
                  <FaUser />
                  <input type="text" name="apellidos" required onChange={handleInputChange} placeholder="Ej. Pérez" />
                </div>
              </div>
            </div>

            <div className="input-box">
              <label>Número de WhatsApp *</label>
              <div className="input-field">
                <FaPhone />
                <input type="tel" name="whatsapp" required onChange={handleInputChange} placeholder="310..." />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-box">
                <label>Dirección (Ubaté) *</label>
                <div className="input-field">
                  <FaMapMarkerAlt />
                  <input type="text" name="direccion" required onChange={handleInputChange} placeholder="Calle/Cra..." />
                </div>
              </div>
              <div className="input-box">
                <label>Barrio o Sector *</label>
                <div className="input-field">
                  <FaHome />
                  <input type="text" name="barrio" required onChange={handleInputChange} placeholder="Ej. Centro" />
                </div>
              </div>
            </div>

            <div className="input-box">
              <label>Correo electrónico (Opcional)</label>
              <div className="input-field">
                <FaEnvelope />
                <input type="email" name="correo" onChange={handleInputChange} placeholder="tu@email.com" />
              </div>
            </div>

            <div className="input-box">
              <label>Nota del pedido</label>
              <div className="input-field textarea">
                <FaStickyNote />
                <textarea name="nota" onChange={handleInputChange} placeholder="Especificar detalles de Casa, Unidad y/o Apartamento"></textarea>
              </div>
            </div>

            <div className="checkbox-container">
              <input 
                type="checkbox" 
                id="compromiso" 
                name="compromiso" 
                required 
                onChange={handleInputChange} 
              />
              <label htmlFor="compromiso">
                Me comprometo a pagar al recibir mi producto (si elegí pago al recibir) y confirmo que mis datos son correctos.
              </label>
            </div>

            <div className="cart-footer-sticky">
              <div className="total-display">
                <span>Total a pagar</span>
                <strong>${total.toLocaleString()}</strong>
              </div>
              <button type="submit" className="btn-confirm-whatsapp">
                Confirmar Pedido <FaWhatsapp size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}