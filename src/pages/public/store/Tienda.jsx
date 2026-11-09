import { tw } from '../../../utils/tw.js';
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth.js";
import HeaderTienda from "./HeaderTienda";
import ProductosTienda from "./ProductosTienda";
import { FaArrowRight, FaChevronUp } from "react-icons/fa";
import { Trans, useTranslation } from 'react-i18next';

export default function Tienda() {
  const { t } = useTranslation('shop');
  const { userData, loading } = useAuth();

  const [categoriaActiva] = useState("Todos los productos");
  const [mostrarBotonSubir, setMostrarBotonSubir] = useState(false);

  const productosRef = useRef(null);

  const scrollToProducts = () => {
    productosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejo correcto de event listeners en React
  useEffect(() => {
    const handleScroll = () => {
      setMostrarBotonSubir(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className={tw("status-container")}>
        <div className={tw("spinner-auth")}></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className={tw("userpage-container")}>
      <HeaderTienda />

      <div className={tw(tw("content-wrapper"), "![display:block]")} >
        <main className={tw(tw("main-products-content"), "![width:100%]")} >
          <header className={tw("products-hero-section")}>
            <div className={tw("hero-content")}>
              <div className={tw("hero-text")}>
                <span className={tw("hero-subtitle")}>{t('hero.eyebrow')}</span>
                <h1>{t('hero.title')}</h1>
                <p>
                  <Trans ns="shop" i18nKey="hero.description" components={{ strong: <strong /> }} />
                </p>
                
                <button className={tw("hero-explore-btn")} onClick={scrollToProducts}>
                  <span>{t('hero.viewProducts')}</span>
                  <FaArrowRight aria-hidden="true" />
                </button>
              </div>

              <picture className={tw("hero-side-decoration")} aria-hidden="true">
                <source media="(max-width: 768px)" srcSet="/img/tienda-hero-side-320.webp" />
                <img src="/img/tienda-hero-side-640.webp" alt="" width="480" height="640" decoding="async" loading="lazy" />
              </picture>

              <div className={tw("hero-visual")}>
                <div className={tw("hero-light-effects")} aria-hidden="true">
                  <span className={tw("hero-light-beam")} />
                  <span className={tw("hero-floor-reflection")} />
                  <span className={tw("hero-contact-shadow")} />
                </div>
                <picture className={tw("store-hero-picture")}>
                  <source media="(max-width: 768px)" srcSet="/img/tienda-hero-800.webp" />
                  <img
                    src="/img/tienda-hero-1600.webp"
                    srcSet="/img/tienda-hero-800.webp 800w, /img/tienda-hero-1600.webp 1600w"
                    sizes="(max-width: 480px) 100vw, (max-width: 1023px) 48vw, 62vw"
                    alt="Escena CDISFRUTA con bolsa de frutas deshidratadas, empaque azul, fresa, piña, menta y hojas"
                    className={tw("hero-product-img")}
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </div>
          </header>

          <div ref={productosRef}>
            <ProductosTienda categoria={categoriaActiva} user={userData} />
          </div>
        </main>
      </div>

      {mostrarBotonSubir && (
        <button className={tw("scroll-to-top-btn")} onClick={scrollToTop} title={t('backToTop')} aria-label={t('backToTop')}>
          <FaChevronUp />
        </button>
      )}
    </div>
  );
}
