import { tw } from '../../utils/tw.js';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import HeaderDashboard from "../../components/layout/CustomerHeader.jsx";
import ProductosTienda from "./ProductosTienda";
import { apiAxios } from "../../services/api/client";
import {
  FaChevronUp, FaBoxOpen, FaMapMarkerAlt, FaRedo, FaShoppingBag, FaArrowRight,
} from "react-icons/fa";

const addPedidoToCart = (pedido) => {
  const current = JSON.parse(localStorage.getItem('cart_cdisfruta') || '[]');
  const next = [...current];
  for (const item of pedido?.productos || []) {
    const id = String(item.productoId || item._id || '');
    if (!id) continue;
    const qty = Math.max(1, Number(item.cantidad || item.quantity) || 1);
    const existing = next.find((row) => String(row._id) === id);
    if (existing) {
      existing.quantity = Math.max(1, Number(existing.quantity) || 1) + qty;
      existing.precio = Number(item.precio) || Number(existing.precio) || 0;
    } else {
      next.push({
        _id: id,
        nombre: item.nombre || 'Producto',
        precio: Number(item.precio) || 0,
        quantity: qty,
        imagen: item.imagen || item.img || '',
      });
    }
  }
  localStorage.setItem('cart_cdisfruta', JSON.stringify(next));
  window.dispatchEvent(new Event('cartUpdate'));
  window.dispatchEvent(new Event('openCart'));
};

export default function DashboardUsuario() {
  const { userData, loading } = useAuth();
  const navigate = useNavigate();
  const [categoriaActiva] = useState("Todos los productos");
  const [mostrarBotonSubir, setMostrarBotonSubir] = useState(false);
  const [ultimoPedido, setUltimoPedido] = useState(null);
  const [hubLoading, setHubLoading] = useState(true);
  const productosRef = useRef(null);

  const nombreCorto = userData?.nombre ? userData.nombre.split(' ')[0] : 'Cliente';
  const tieneDireccion = Boolean(
    userData?.direccionEnvio?.direccion
    || (Array.isArray(userData?.direccionesEnvio) && userData.direccionesEnvio.length > 0)
  );

  const scrollToProducts = () => {
    productosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const irADirecciones = () => {
    sessionStorage.setItem('config_tab_cdisfruta', 'direcciones');
    navigate('/cliente/configuracion?tab=direcciones');
  };

  useEffect(() => {
    const onScroll = () => setMostrarBotonSubir(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadHub = async () => {
      if (!userData) {
        setHubLoading(false);
        return;
      }
      setHubLoading(true);
      try {
        const { data } = await apiAxios.get('/pedidos/mis-pedidos');
        const lista = Array.isArray(data) ? data : [];
        const activo = lista.find((p) => p.estado !== 'Cancelado') || lista[0] || null;
        if (!cancelled) setUltimoPedido(activo);
      } catch {
        if (!cancelled) setUltimoPedido(null);
      } finally {
        if (!cancelled) setHubLoading(false);
      }
    };
    loadHub();
    return () => { cancelled = true; };
  }, [userData?.id]);

  if (loading) {
    return (
      <div className={tw("status-container")}>
        <div className={tw("spinner-auth")}></div>
        <p>Cargando tu espacio CDISFRUTA…</p>
      </div>
    );
  }

  const idCorto = ultimoPedido?._id ? String(ultimoPedido._id).slice(-8).toUpperCase() : '';
  const itemsPedido = ultimoPedido?.productos?.length || 0;

  return (
    <div className={tw("userpage-container client-area")}>
      <HeaderDashboard />

      <div className={tw(tw("content-wrapper"), "![display:block]")} >
        <main className={tw(tw("main-products-content"), "![width:100%]")} >
          <section className={tw("client-hub")} aria-label="Tu espacio CDISFRUTA">
            <div className={tw("client-hub__intro")}>
              <p className={tw("client-hub__eyebrow")}>Mi CDISFRUTA</p>
              <h1 className={tw("client-hub__title")}>Hola, {nombreCorto}</h1>
              <p className={tw("client-hub__subtitle")}>
                Aquí gestionas pedidos, direcciones y compras rápidas. La vitrina de marca sigue en la tienda pública.
              </p>
            </div>

            <div className={tw("client-hub__grid")}>
              <article className={tw("client-hub__card client-hub__card--primary")}>
                <div className={tw("client-hub__card-icon")} aria-hidden="true"><FaBoxOpen /></div>
                <div className={tw("client-hub__card-body")}>
                  <h2>Tu último pedido</h2>
                  {hubLoading ? (
                    <p className={tw("client-hub__muted")}>Consultando…</p>
                  ) : ultimoPedido ? (
                    <>
                      <p className={tw("client-hub__meta")}>
                        #{idCorto} · {ultimoPedido.estado} · {itemsPedido} producto{itemsPedido === 1 ? '' : 's'}
                      </p>
                      <p className={tw("client-hub__meta")}>
                        ${Number(ultimoPedido.total || 0).toLocaleString('es-CO')}
                      </p>
                      <div className={tw("client-hub__actions")}>
                        <button type="button" className={tw("client-hub__btn client-hub__btn--solid")} onClick={() => addPedidoToCart(ultimoPedido)}>
                          <FaRedo /> Repetir compra
                        </button>
                        <button type="button" className={tw("client-hub__btn client-hub__btn--ghost")} onClick={() => navigate('/cliente/pedidos')}>
                          Ver pedidos
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={tw("client-hub__muted")}>Aún no tienes pedidos. Empieza con algo rico de Ubaté.</p>
                      <button type="button" className={tw("client-hub__btn client-hub__btn--solid")} onClick={scrollToProducts}>
                        Ver catálogo <FaArrowRight />
                      </button>
                    </>
                  )}
                </div>
              </article>

              <article className={tw("client-hub__card")}>
                <div className={tw("client-hub__card-icon")} aria-hidden="true"><FaShoppingBag /></div>
                <div className={tw("client-hub__card-body")}>
                  <h2>Seguir comprando</h2>
                  <p className={tw("client-hub__muted")}>Explora el catálogo y agrega snacks a tu carrito cuando quieras.</p>
                  <button type="button" className={tw("client-hub__btn client-hub__btn--solid")} onClick={scrollToProducts}>
                    Ir a productos
                  </button>
                </div>
              </article>

              <article className={tw("client-hub__card")}>
                <div className={tw("client-hub__card-icon")} aria-hidden="true"><FaMapMarkerAlt /></div>
                <div className={tw("client-hub__card-body")}>
                  <h2>Direcciones</h2>
                  <p className={tw("client-hub__muted")}>
                    {tieneDireccion
                      ? 'Ya tienes direcciones listas para elegir en el carrito.'
                      : 'Registra tu casa u oficina para no volver a llenar el formulario.'}
                  </p>
                  <button type="button" className={tw("client-hub__btn client-hub__btn--ghost")} onClick={irADirecciones}>
                    {tieneDireccion ? 'Administrar' : 'Registrar dirección'}
                  </button>
                </div>
              </article>
            </div>
          </section>

          <div ref={productosRef} className={tw("client-catalog-anchor")}>
            <div className={tw("client-catalog-heading")}>
              <h2>Tu catálogo</h2>
              <p>Elige snacks y agrégalos al carrito. Si ya guardaste una dirección, solo la escoges al pagar.</p>
            </div>
            <ProductosTienda categoria={categoriaActiva} user={userData} />
          </div>
        </main>
      </div>

      {mostrarBotonSubir && (
        <button className={tw("scroll-to-top-btn")} onClick={scrollToTop} title="Volver arriba">
          <FaChevronUp />
        </button>
      )}
    </div>
  );
}
