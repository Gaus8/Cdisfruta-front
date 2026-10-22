import { useCallback, useEffect, useState } from 'react';
import { URL_SERVER } from '../../../services/api/client.js';
import HeroCarousel3D from './HeroCarousel3D';

const isBannerActive = (banner) => banner.activo !== false && banner.active !== false && banner.estado !== 'inactivo';

/** Loads the same ordered banner collection used by the admin cover editor. */
export default function Carrusel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBanners = useCallback(async (signal, initial = false) => {
    try {
      const response = await fetch(`${URL_SERVER}/portada`, { signal, cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo cargar la portada.');
      const slides = await response.json();
      const activeBanners = Array.isArray(slides)
        ? slides.filter(isBannerActive).sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0))
        : [];
      setBanners(activeBanners);
    } catch (error) {
      if (error.name !== 'AbortError') console.error('No se pudo sincronizar el contenido de portada:', error);
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
