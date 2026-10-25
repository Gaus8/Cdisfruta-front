import { tw } from '../../utils/tw.js';
import { useState, useEffect, useRef } from "react";
import { 
  FaTrash, FaTimes, FaWhatsapp, FaUser, FaEnvelope, 
  FaPhone, FaMapMarkerAlt, FaHome, FaStickyNote, FaCheckCircle, FaGlobeAmericas, FaCity 
} from "react-icons/fa";
import { apiAxios } from "../../services/api/client.js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

import { COLOMBIA_GEO, DEPARTAMENTOS_ORDENADOS } from '../../utils/geoColombia.js';

const SHIPPING_FIELDS = ['nombres', 'apellidos', 'whatsapp', 'departamento', 'municipio', 'direccion', 'barrio', 'correo'];

const emptyForm = () => ({
  nombres: '',
  apellidos: '',
  whatsapp: '',
  departamento: '',
  municipio: '',
  direccion: '',
  barrio: '',
  nota: '',
  correo: '',
  compromiso: false,
});

const shippingStorageKey = (userId) => `shipping_cdisfruta_${userId || 'guest'}`;

const hasShippingData = (data) => Boolean(
  data?.direccion || data?.municipio || data?.departamento || data?.whatsapp || data?.barrio
);

const readShippingDraft = (userId) => {
  try {
    const raw = localStorage.getItem(shippingStorageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const writeShippingDraft = (userId, form) => {
  if (!userId) return;
  try {
    const payload = {};
    SHIPPING_FIELDS.forEach((key) => {
      payload[key] = String(form?.[key] || '').trim();
    });
    localStorage.setItem(shippingStorageKey(userId), JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
};

const clearShippingDraft = (userId) => {
  if (!userId) return;
  try { localStorage.removeItem(shippingStorageKey(userId)); } catch { /* ignore */ }
};

const addressesFromUser = (user) => {
  const list = Array.isArray(user?.direccionesEnvio) ? user.direccionesEnvio.filter(hasShippingData) : [];
  if (list.length) return list;
  if (hasShippingData(user?.direccionEnvio)) {
    return [{ id: 'principal', etiqueta: 'Principal', ...user.direccionEnvio }];
  }
  return [];
};

const applyAddressToForm = (addr, user, extra = {}) => {
  const nombreParts = String(user?.nombre || '').trim().split(/\s+/).filter(Boolean);
  return {
    ...emptyForm(),
    nombres: addr?.nombres || nombreParts[0] || '',
    apellidos: addr?.apellidos || (nombreParts.length > 1 ? nombreParts.slice(1).join(' ') : ''),
    whatsapp: addr?.whatsapp || user?.telefono || '',
    departamento: addr?.departamento || '',
    municipio: addr?.municipio || '',
    direccion: addr?.direccion || '',
    barrio: addr?.barrio || '',
    correo: user?.email || '',
    ...extra,
  };
};

const formFromUser = (user) => {
  if (!user) return emptyForm();
  const addresses = addressesFromUser(user);
  const draft = readShippingDraft(user.id);
  const source = addresses[0] || (hasShippingData(draft) ? draft : null);
  return applyAddressToForm(source, user);
};

export default function CartModal({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { userData, authenticated, verifyToken } = useAuth();
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
  const [metodoPago, setMetodoPago] = useState('Contraentrega');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [addressLabel, setAddressLabel] = useState('Casa');
  
  const [formData, setFormData] = useState(emptyForm);

  const savedAddresses = authenticated ? addressesFromUser(userData) : [];
  const showAddressPicker = authenticated && savedAddresses.length > 0 && !useNewAddress;
  const municipiosDisponibles = COLOMBIA_GEO[formData.departamento] || [];

  const selectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setUseNewAddress(false);
    setFormData((prev) => applyAddressToForm(addr, userData, {
      nota: prev.nota,
      compromiso: prev.compromiso,
      correo: userData?.email || prev.correo,
    }));
  };

  useEffect(() => {
    const normalizeCart = (items) => (Array.isArray(items) ? items : []).map((item) => ({
      ...item,
      precio: Number(item?.precio) || 0,
      quantity: Math.max(1, Number(item?.quantity) || 1),
    }));

    const persistCart = (items) => {
      localStorage.setItem('cart_cdisfruta', JSON.stringify(items));
      setCartItems(items);
      window.dispatchEvent(new Event('cartUpdate'));
    };

    const handleSync = () => {
      const savedCart = normalizeCart(JSON.parse(localStorage.getItem('cart_cdisfruta') || '[]'));
      setCartItems(savedCart);
    };

    const refreshPrices = async () => {
      const savedCart = normalizeCart(JSON.parse(localStorage.getItem('cart_cdisfruta') || '[]'));
      if (savedCart.length === 0) {
        setCartItems([]);
        return;
      }
      try {
        const { data } = await apiAxios.get('/get-productos');
        const catalog = Array.isArray(data) ? data : (data?.productos || data?.data || []);
        const byId = new Map(catalog.map((product) => [String(product._id), product]));
        const refreshed = savedCart
          .map((item) => {
            const product = byId.get(String(item._id));
            if (!product) return null;
            return {
              ...item,
              nombre: product.nombre || item.nombre,
              precio: Number(product.precio) || 0,
              stock: product.stock,
              imagen: product.imagen || item.imagen,
            };
          })
          .filter(Boolean);
        persistCart(refreshed);
      } catch {
        handleSync();
      }
    };

    if (isOpen) {
      handleSync();
      refreshPrices();
      window.addEventListener('cartUpdate', handleSync);
    }
    return () => window.removeEventListener('cartUpdate', handleSync);
  }, [isOpen]);

  // Al abrir el carrito con sesión, elige la dirección guardada (sin mostrar todos los inputs).
  useEffect(() => {
    if (!isOpen || orderComplete) return;
    if (authenticated && userData) {
      const list = addressesFromUser(userData);
      if (list.length) {
        setUseNewAddress(false);
        setSelectedAddressId(list[0].id);
        setFormData(applyAddressToForm(list[0], userData));
      } else {
        setUseNewAddress(true);
        setSelectedAddressId(null);
        setFormData(formFromUser(userData));
      }
      return;
    }
    if (!authenticated) {
      setUseNewAddress(true);
      setSelectedAddressId(null);
      setFormData(emptyForm());
    }
  }, [isOpen, authenticated, userData?.id, orderComplete]); // eslint-disable-line react-hooks/exhaustive-deps -- solo al abrir / cambiar sesión

  const total = cartItems.reduce((acc, item) => acc + (Number(item.precio) || 0) * (Number(item.quantity) || 0), 0);
  const canCheckout = cartItems.length > 0 && total > 0;

  const removeItem = (id) => {
    const currentCart = JSON.parse(localStorage.getItem("cart_cdisfruta") || "[]");
    const newCart = currentCart.filter(item => item._id !== id);
    
    setCartItems(newCart);
    localStorage.setItem("cart_cdisfruta", JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = { 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'departamento' ? { municipio: '' } : {})
    };
    setFormData(next);
    if (authenticated && userData?.id && name !== 'compromiso' && name !== 'nota') {
      writeShippingDraft(userData.id, next);
    }
  };

  const handleConfirmarPedido = async () => {
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    if (!formData.compromiso) {
      alert("Debes confirmar que tus datos de envío son correctos para continuar.");
      return;
    }

    if (cartItems.length === 0) {
      alert('Tu carrito está vacío. Agrega un producto de la tienda antes de pagar.');
      return;
    }

    if (!(total > 0)) {
      alert('El total del pedido es $0. Vuelve a agregar el producto desde la tienda (el precio debe ser mayor a cero) e inténtalo de nuevo.');
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
      metodoPago,
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
      // Si el cliente registra una dirección nueva a propósito, la guardamos antes del pedido.
      if (authenticated && useNewAddress && saveNewAddress) {
        try {
          await apiAxios.post('/auth/direcciones-envio', {
            ...nuevoPedido.datosEnvio,
            etiqueta: addressLabel || 'Casa',
          });
        } catch {
          /* el pedido igual puede continuar; el back también guarda al comprar */
        }
      }

      // 2. Guardar pedido en MongoDB mediante la API
      const { data: orderResponse } = await apiAxios.post('/pedidos', nuevoPedido);

      // Con sesión, la dirección queda en la cuenta; refrescamos y limpiamos el borrador local.
      if (authenticated) {
        if (userData?.id) clearShippingDraft(userData.id);
        try { await verifyToken(); } catch { /* la compra ya quedó registrada */ }
      }

      if (metodoPago !== 'Contraentrega') {
        const checkout = orderResponse.checkout;
        if (!checkout?.url || !checkout?.fields) throw new Error('No recibimos los datos para iniciar el pago seguro. El carrito sigue guardado.');
        sessionStorage.setItem('pending_wompi_reference', checkout.fields.reference);
        const checkoutForm = document.createElement('form');
        checkoutForm.method = 'GET';
        checkoutForm.action = checkout.url;
        Object.entries(checkout.fields).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden'; input.name = name; input.value = String(value);
          checkoutForm.appendChild(input);
        });
        document.body.appendChild(checkoutForm);
        checkoutForm.submit();
        return;
      }

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
      alert(error.response?.data?.message || error.message || "Hubo un error al registrar tu pedido en el sistema. Inténtalo de nuevo.");
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

            {showAddressPicker ? (
              <div className={tw('mb-4 space-y-3')} role="radiogroup" aria-label="Direcciones guardadas">
                <p className={tw('text-sm text-slate-600')}>Elige una dirección guardada o agrega una nueva.</p>
                {savedAddresses.map((addr) => {
                  const selected = selectedAddressId === addr.id;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => selectSavedAddress(addr)}
                      className={tw(
                        'w-full rounded-2xl border px-4 py-3 text-left transition',
                        selected
                          ? 'border-[#ff7e5f] bg-orange-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      <div className={tw('flex items-start gap-3')}>
                        <span className={tw('mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border', selected ? 'border-[#ff7e5f] bg-[#ff7e5f]' : 'border-slate-300')}>
                          {selected ? <span className={tw('h-1.5 w-1.5 rounded-full bg-white')} /> : null}
                        </span>
                        <div className={tw('min-w-0')}>
                          <p className={tw('text-sm font-bold text-slate-800')}>{addr.etiqueta || 'Dirección'}</p>
                          <p className={tw('mt-0.5 text-sm text-slate-700')}>{addr.nombres} {addr.apellidos}</p>
                          <p className={tw('text-sm text-slate-600')}>{addr.direccion}, {addr.barrio}</p>
                          <p className={tw('text-xs text-slate-500')}>{addr.municipio}, {addr.departamento} · {addr.whatsapp}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setUseNewAddress(true);
                    setSelectedAddressId(null);
                    setFormData((prev) => ({
                      ...emptyForm(),
                      correo: userData?.email || prev.correo,
                      nota: prev.nota,
                      compromiso: false,
                    }));
                  }}
                  className={tw('w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100')}
                >
                  + Usar otra dirección
                </button>
              </div>
            ) : (
              <>
                {authenticated && savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const first = savedAddresses[0];
                      selectSavedAddress(first);
                    }}
                    className={tw('mb-3 text-sm font-semibold text-[#e06d43] underline')}
                  >
                    Volver a mis direcciones guardadas
                  </button>
                )}
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

                <div className={tw("input-box")}>
                  <label>Número de WhatsApp *</label>
                  <div className={tw("input-field")}>
                    <FaPhone />
                    <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} placeholder="310..." />
                  </div>
                </div>

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

                <div className={tw("input-box")}>
                  <label>Correo electrónico *</label>
                  <div className={tw("input-field")}>
                    <FaEnvelope />
                    <input type="email" name="correo" required value={formData.correo} onChange={handleInputChange} placeholder="tu@email.com" readOnly={authenticated} />
                  </div>
                </div>

                {authenticated && (
                  <div className={tw('mb-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3')}>
                    <label className={tw('flex items-start gap-2 text-sm text-slate-700')}>
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className={tw('mt-1 accent-[#ff7e5f]')}
                      />
                      <span>Guardar esta dirección en mi cuenta para la próxima compra</span>
                    </label>
                    {saveNewAddress && (
                      <label className={tw('block text-sm text-slate-700')}>
                        Nombre de la dirección
                        <input
                          type="text"
                          value={addressLabel}
                          onChange={(e) => setAddressLabel(e.target.value)}
                          placeholder="Casa, Oficina…"
                          className={tw('mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm')}
                        />
                      </label>
                    )}
                  </div>
                )}
              </>
            )}

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
                Confirmo que mis datos de envío son correctos. {metodoPago === 'Contraentrega' && 'Pagaré al recibir mi producto.'}
              </label>
            </div>

            <section className={tw('mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4')} aria-label="Opciones de envío y pago">
              <div><h3 className={tw('text-base font-bold text-slate-800')}>Envío</h3><label className={tw('mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800')}><input type="radio" checked readOnly className={tw('accent-emerald-600')} /><span><strong>Envío gratis</strong><br /><span className={tw('text-xs')}>Sin costo adicional</span></span></label></div>
              <div>
                <h3 className={tw('text-base font-bold text-slate-800')}>Método de pago</h3>
                <div className={tw('mt-2 grid gap-2 sm:grid-cols-3')}>
                  {[
                    ['NEQUI', 'Nequi'],
                    ['CARD', 'Tarjeta'],
                    ['Contraentrega', 'Contra entrega'],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className={tw(
                        'flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm',
                        metodoPago === value
                          ? 'border-[#ff7e5f] bg-orange-50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-600'
                      )}
                    >
                      <input
                        type="radio"
                        name="metodoPago"
                        value={value}
                        checked={metodoPago === value}
                        onChange={() => setMetodoPago(value)}
                        className={tw('accent-[#ff7e5f]')}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <p className={tw('mt-2 text-xs leading-5 text-slate-500')}>
                  {metodoPago === 'NEQUI'
                    ? 'Continuarás al checkout seguro de Wompi. Selecciona Nequi allí para completar la transacción.'
                    : metodoPago === 'CARD'
                      ? 'Continuarás al checkout seguro de Wompi. Selecciona tarjeta allí para completar el pago (sandbox: sin cobro real).'
                      : 'Confirmaremos el pedido y te abriremos WhatsApp para coordinar el pago contra entrega.'}
                </p>
              </div>
            </section>

            <div className={tw("cart-footer-sticky")}>
              <div className={tw("total-display")}>
                <span>Total a pagar</span>
                <strong>${total.toLocaleString("es-CO")}</strong>
              </div>
              {!canCheckout && (
                <p className={tw('mb-2 text-center text-xs font-medium text-rose-600')} role="status">
                  {cartItems.length === 0
                    ? 'Agrega productos desde la tienda para continuar.'
                    : 'El total es $0: el carrito no tiene precio válido. Quita el ítem y vuelve a agregarlo desde la tienda.'}
                </p>
              )}
              <button 
                type="button" 
                className={tw("btn-confirm-whatsapp")} 
                onClick={handleConfirmarPedido}
                disabled={!canCheckout || submittingOrder}
              >
                {submittingOrder
                  ? 'Registrando pedido…'
                  : metodoPago === 'Contraentrega'
                    ? <>Confirmar Pedido <FaWhatsapp size={20} /></>
                    : 'Ir a pagar con Wompi'}
              </button>
            </div>
          </form>
        </div>}
      </div>
    </div>
  );
}
