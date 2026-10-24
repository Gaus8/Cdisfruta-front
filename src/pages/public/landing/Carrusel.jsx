import { useCallback, useEffect, useState } from 'react';
import { URL_SERVER } from '../../../services/api/client.js';
import HeroCarousel3D from './HeroCarousel3D';

const isBannerActive = (banner) => banner.activo !== false && banner.active !== false && banner.estado !== 'inactivo';

const initialBanners = [
  { eyebrow: 'Presencia internacional', etiqueta: 'Presencia internacional', titulo: 'CDISFRUTA en Australia', desc: 'Nuestras aromáticas llegando a nuevos destinos. Sabor colombiano presente en Melbourne.', tag: 'Australia · Melbourne', detalle: 'Nuestra expansión internacional comenzó con el sueño de llevar el sabor de Ubaté al mundo.', img: '/img/cdisfruta_01.webp', iconKey: 'globe', orden: 0 },
  { eyebrow: 'Producto destacado', etiqueta: 'Producto destacado', titulo: 'Aromáticas frutales', desc: 'Infusiones naturales elaboradas con frutas seleccionadas, que brindan sabor, frescura y bienestar en cada taza.', tag: '100% Natural', detalle: 'Seleccionamos cada fruta en su punto exacto de maduración.', img: '/img/cdisfruta_02.webp', iconKey: 'leaf', orden: 1 },
  { eyebrow: 'Nuestra tierra', etiqueta: 'Nuestra tierra', titulo: 'Tradición de Ubaté', desc: 'Reflejamos la riqueza de nuestra tierra en cada mezcla, con frutas y hierbas cuidadosamente seleccionadas.', tag: 'Ubaté · Cundinamarca', detalle: 'CDISFRUTA nace en el corazón de la provincia de Ubaté.', img: '/img/cdisfruta_07.webp', iconKey: 'location', orden: 2 }
];

const bannerSnapshot = (slides) => JSON.stringify(slides.map(({ _id, orden, titulo, eyebrow, etiqueta, desc, tag, detalle, img, iconKey }) => ({ _id, orden, titulo, eyebrow, etiqueta, desc, tag, detalle, img, iconKey })));

/** Loads the same ordered banner collection used by the admin cover editor. */
export default function Carrusel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBanners = useCallback(async (signal, initial = false) => {
    try {
      const response = await fetch(`${URL_SERVER}/portada`, { signal });
      if (!response.ok) throw new Error('No se pudo cargar la portada.');
      const slides = await response.json();
      const activeBanners = Array.isArray(slides)
        ? slides.filter(isBannerActive).sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0))
        : [];
      if (activeBanners.length) {
        setBanners((prev) => (bannerSnapshot(prev) === bannerSnapshot(activeBanners) ? prev : activeBanners));
      } else if (initial) {
        setBanners(initialBanners);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('No se pudo sincronizar el contenido de portada:', error);
        if (initial) setBanners(initialBanners);
      }
    } finally {
      if (initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadBanners(controller.signal, true);
    const refresh = () => loadBanners(controller.signal);
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [loadBanners]);

  return <HeroCarousel3D
    banners={banners}
    loading={loading}
  />;
}
