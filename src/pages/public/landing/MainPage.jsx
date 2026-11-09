import { lazy, Suspense } from 'react';
import { tw } from '../../../utils/tw.js';
import HeroCarousel from './Carrusel';
import Header from './Header';
import { IoLocationOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import { useTranslation } from 'react-i18next';

const KnowSection = lazy(() => import('./KnowSection'));
const HistorySection = lazy(() => import('./HistorySection'));
const MissionVision = lazy(() => import('./MissionVision'));
const Videos = lazy(() => import('./Videos'));

// Contenido editorial de Historia. Esta sección es estática y no está conectada al panel administrativo.
// Los textos y distintivos visuales de esta configuración se pueden editar aquí sin tocar el panel.
const getHistoryContent = (t) => ({
  photo: '/img/cdisfruta_06.webp',
  photoAlt: t('history.photoAlt'),
  years: 6,
  eyebrow: t('history.eyebrow'),
  quote: t('history.quote'),
  paragraphs: [
    t('history.paragraphOne'),
    t('history.paragraphTwo'),
  ],
  photoTagline: t('history.photoTagline'),
  photoBadges: [
    { id: 'natural', icon: 'leaf', label: t('history.badgeNatural') },
    { id: 'sin-conservantes', icon: 'heart', label: t('history.badgeNoPreservatives') },
    { id: 'nutrientes', icon: 'sprout', label: t('history.badgeNutrients') },
  ],
  values: [
    { id: 'fruta-natural', icon: 'leaf', label: t('history.valueFruit') },
    { id: 'apoyo-campesino', icon: 'support', label: t('history.valueFarmers') },
    { id: 'calidad', icon: 'shield', label: t('history.valueQuality') },
    { id: 'sabor', icon: 'heart', label: t('history.valueFlavor') },
  ],
  closingNote: t('history.closing'),
});

function SectionFallback({ minHeight = '20rem' }) {
  return <div className={tw('w-full bg-[#FAEFE6]')} style={{ minHeight }} aria-hidden="true" />;
}

function MainPage() {
  const { t } = useTranslation('landing');
  const historyContent = getHistoryContent(t);
  return (
    <div className={tw("main-page-wrapper", "theme-v2")}>
      <a
        href="#inicio"
        className={tw('sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[#E8603C] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white')}
      >
        {t('footer.skip')}
      </a>
      <Header themeV2 />
      <main id="contenido-principal">
      <HeroCarousel />

      <Suspense fallback={<SectionFallback minHeight="28rem" />}>
        <KnowSection />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="32rem" />}>
        <HistorySection content={historyContent} />
      </Suspense>
 
      <Suspense fallback={<SectionFallback minHeight="36rem" />}>
        <MissionVision />
      </Suspense>
 
      {/* ── GALERÍA / VIDEOS ── */}
      <section className={tw("media-section", "scroll-mt-24")} id="videos">
        <Suspense fallback={<SectionFallback minHeight="24rem" />}>
          <Videos />
        </Suspense>
      </section>
      </main>
 
      {/* ── FOOTER ── */}
      <footer className={tw("footer-main")}>
        <div className={tw("footer-grid")}>
          {/* Marca */}
          <div className={tw("footer-brand-col")}>
            <div className={tw("footer-logo")}>
              <div className={tw("hdr-logo-ring")}>
                <img src="/img/logo_cdisfruta.webp" alt={t('footer.logoAlt')} width="54" height="54" decoding="async" loading="lazy" />
              </div>
              <span className={tw("footer-brand-name")}>CDISFRUTA</span>
            </div>
            <p className={tw("footer-tagline")}>
              {t('footer.brandTagline')}
            </p>
            <div className={tw("footer-social")}>
              {/* Enlace a Instagram */}
              <a 
                href="https://www.instagram.com/cdisfruta_col" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={tw("social-pill")}
              >
                Instagram
              </a>
              
              {/* Enlace a WhatsApp */}
              <a 
                href="https://wa.me/573229683625" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={tw("social-pill")}
              >
                WhatsApp
              </a>
            </div>
          </div>
 
          {/* Navegación */}
          <div className={tw("footer-col")}>
            <h4 className={tw("footer-col-title")}>{t('footer.navigation')}</h4>
            <ul className={tw("footer-links")}>
              <li><a href="/#inicio">{t('common:navigation.home')}</a></li>
              <li><a href="/#historia">{t('footer.about')}</a></li>
              <li><a href="/#features">{t('footer.features')}</a></li>
              <li><a href="/#videos">{t('footer.gallery')}</a></li>
            </ul>
          </div>
 
          {/* Empresa */}
          <div className={tw("footer-col")}>
            <h4 className={tw("footer-col-title")}>{t('footer.company')}</h4>
            <ul className={tw("footer-links")}>
              <li><a href="/#historia">{t('footer.ourStory')}</a></li>
              <li><a href="/#historia">{t('footer.craft')}</a></li>
              <li><a href="/#inicio">{t('footer.international')}</a></li>
              <li><a href="/#contacto">{t('footer.distributors')}</a></li>
            </ul>
          </div>
 
          {/* Contacto */}
          <section className={tw("footer-col", "scroll-mt-24")} id="contacto" aria-labelledby="footer-contact-title">
            <h4 className={tw("footer-col-title")} id="footer-contact-title">{t('footer.contact')}</h4>
            <ul className={tw("footer-contact-list")}>
              <li>
                <span className={tw("footer-contact-icon")} aria-hidden="true"><IoLocationOutline /></span>
                <a href="https://www.google.com/maps/search/?api=1&query=Ubat%C3%A9%2C%20Cundinamarca%2C%20Colombia" target="_blank" rel="noopener noreferrer">{t('footer.location')}</a>
              </li>
              <li>
                <span className={tw("footer-contact-icon")} aria-hidden="true"><BsTelephone /></span>
                <a href="tel:+573229683625">+57 322 968 3625</a>
              </li>
              <li>
                <span className={tw("footer-contact-icon")} aria-hidden="true"><MdOutlineMail /></span>
                <a href="mailto:cdisfruta@gmail.com">cdisfruta@gmail.com</a>
              </li>
            </ul>
          </section>
        </div>
 
        <div className={tw("footer-bottom")}>
          <p>{t('footer.rights')}</p>
          <p className={tw("footer-made")}>{t('footer.made')}</p>
        </div>
      </footer>
    </div>
  );
}
 
export default MainPage;
