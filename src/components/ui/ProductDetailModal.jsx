import { useEffect, useState } from 'react';
import { FaShoppingCart, FaPlus, FaMinus, FaTimes, FaChevronLeft, FaChevronRight, FaBoxOpen } from 'react-icons/fa';
import { tw } from '../../utils/tw.js';
import { cloudinaryUrl } from '../../utils/cloudinaryUrl.js';
import { useTranslation } from 'react-i18next';
import { translateCatalogText } from '../../i18n/catalogText.js';
import { formatCurrency } from '../../i18n/format.js';

const imagesOf = (product) => {
  if (!product) return [];
  if (Array.isArray(product.imagenes) && product.imagenes.length > 0) {
    return product.imagenes.filter(Boolean);
  }
  return product.imagen ? [product.imagen] : [];
};

export default function ProductDetailModal({
  product,
  quantity = 1,
  onClose,
  onIncrease,
  onDecrease,
  onAddToCart,
}) {
  const { t, i18n } = useTranslation('shop');
  const language = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'es';
  const displayText = (value) => translateCatalogText(value, language);
  const images = imagesOf(product);
  const [activeImage, setActiveImage] = useState(images[0] || '');
  const activeIndex = Math.max(0, images.indexOf(activeImage));

  useEffect(() => {
    setActiveImage(images[0] || '');
  }, [product?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!product) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
      if (event.key === 'ArrowRight' && images.length > 1) {
        const index = Math.max(0, images.indexOf(activeImage));
        setActiveImage(images[(index + 1) % images.length]);
      }
      if (event.key === 'ArrowLeft' && images.length > 1) {
        const index = Math.max(0, images.indexOf(activeImage));
        setActiveImage(images[(index - 1 + images.length) % images.length]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [product, activeImage, images, onClose]);

  if (!product) return null;

  const inStock = product.stock > 0;

  const goNext = () => {
    if (images.length < 2) return;
    const index = Math.max(0, images.indexOf(activeImage));
    setActiveImage(images[(index + 1) % images.length]);
  };

  const goPrev = () => {
    if (images.length < 2) return;
    const index = Math.max(0, images.indexOf(activeImage));
    setActiveImage(images[(index - 1 + images.length) % images.length]);
  };

  return (
    <div className={tw('product-modal-overlay')} onClick={onClose} role="presentation">
      <div
        className={tw('product-modal-content')}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={displayText(product.nombre)}
      >
        <button type="button" className={tw('close-modal-btn')} onClick={onClose} aria-label={t('detail.close')}>
          <FaTimes size={16} />
        </button>

        <div className={tw('modal-body-grid')}>
          <div className={tw('modal-image-gallery-container')}>
            <div className={tw('modal-main-image-wrapper')}>
              {activeImage ? (
                <>
                  <img
                    src={cloudinaryUrl(activeImage, { width: 900 })}
                    alt={displayText(product.nombre)}
                    width="900"
                    height="900"
                    loading="lazy"
                    decoding="async"
                  />
                  {images.length > 1 && (
                    <>
                      <button type="button" className={tw('modal-slider-arrow modal-prev')} onClick={goPrev} aria-label={t('detail.previousImage')}>
                        <FaChevronLeft size={14} />
                      </button>
                      <button type="button" className={tw('modal-slider-arrow modal-next')} onClick={goNext} aria-label={t('detail.nextImage')}>
                        <FaChevronRight size={14} />
                      </button>
                      <span className={tw('modal-image-counter')}>
                        {activeIndex + 1} / {images.length}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <div className={tw('placeholder-img modal-placeholder')}>
                  <FaBoxOpen size={42} />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className={tw('modal-thumbnails-grid')}>
                {images.map((imgUrl, index) => (
                  <button
                    key={`${imgUrl}-${index}`}
                    type="button"
                    className={tw(`thumbnail-btn ${activeImage === imgUrl ? 'active' : ''}`)}
                    onClick={() => setActiveImage(imgUrl)}
                    aria-label={t('detail.imageView', { number: index + 1 })}
                  >
                    <img
                      src={cloudinaryUrl(imgUrl, { width: 160 })}
                      alt={t('detail.productViewAlt', { name: displayText(product.nombre), number: index + 1 })}
                      width="160"
                      height="160"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={tw('modal-details-container')}>
            {product.categoria && (
              <span className={tw('modal-category-pill')}>{displayText(product.categoria)}</span>
            )}
            <h2>{displayText(product.nombre)}</h2>

            <div className={tw('modal-price-box')}>
              <div className={tw('modal-price-row')}>
                <div>
                  <span className={tw('price-label')}>{t('detail.unitPrice')}</span>
                  <span className={tw('product-price')}>
                    {formatCurrency(product.precio || 0, language)}
                  </span>
                </div>
                <span className={tw(inStock ? 'modal-stock-badge modal-stock-ok' : 'modal-stock-badge modal-stock-out')}>
                  {inStock ? t('products.available', { count: product.stock }) : t('products.outOfStock')}
                </span>
              </div>
            </div>

            <div className={tw('modal-description-box')}>
              <h4>{t('detail.description')}</h4>
              <p>
                {displayText(product.descripcion || t('detail.defaultDescription'))}
              </p>
            </div>

            {inStock ? (
              <div className={tw('product-detail-actions')}>
                <div className={tw('product-detail-qty-box')}>
                  <button type="button" onClick={() => onDecrease?.(product._id)} className={tw('product-detail-qty-btn')} aria-label={t('detail.decrease')}>
                    <FaMinus size={11} />
                  </button>
                  <span className={tw('product-detail-qty-number')}>{quantity}</span>
                  <button type="button" onClick={() => onIncrease?.(product._id, product.stock)} className={tw('product-detail-qty-btn')} aria-label={t('detail.increase')}>
                    <FaPlus size={11} />
                  </button>
                </div>

                <button
                  type="button"
                  className={tw('product-detail-submit-btn')}
                  onClick={(event) => onAddToCart?.(product, event.currentTarget)}
                >
                  <FaShoppingCart size={16} /> {t('products.add')}
                </button>
              </div>
            ) : (
              <p className={tw('modal-out-of-stock-note')}>{t('detail.unavailable')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
