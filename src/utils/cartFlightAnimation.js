const CART_TARGET_SELECTOR = '[data-cart-animation-target="true"]';

export function animateProductToCart(imageUrl, sourceElement) {
  if (!imageUrl || !sourceElement || typeof window === 'undefined') return;

  const cartTarget = document.querySelector(CART_TARGET_SELECTOR);
  if (!cartTarget) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = cartTarget.getBoundingClientRect();
  if (!sourceRect.width || !sourceRect.height || !targetRect.width || !targetRect.height) return;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || typeof Element.prototype.animate !== 'function') {
    cartTarget.classList.remove('cart-flight-target--pulse');
    void cartTarget.offsetWidth;
    cartTarget.classList.add('cart-flight-target--pulse');
    window.setTimeout(() => cartTarget.classList.remove('cart-flight-target--pulse'), 650);
    return;
  }

  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = '';
  image.setAttribute('aria-hidden', 'true');
  Object.assign(image.style, {
    position: 'fixed',
    zIndex: '2000',
    left: `${sourceRect.left + sourceRect.width / 2}px`,
    top: `${sourceRect.top + sourceRect.height / 2}px`,
    width: `${Math.min(sourceRect.width, 112)}px`,
    height: `${Math.min(sourceRect.height, 112)}px`,
    objectFit: 'contain',
    borderRadius: '50%',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    filter: 'drop-shadow(0 5px 10px rgba(0, 0, 0, .24))',
  });
  document.body.appendChild(image);

  const startSize = Math.min(sourceRect.width, sourceRect.height, 112);
  const endSize = Math.max(12, Math.min(targetRect.width, targetRect.height) * 0.42);
  const flight = image.animate([
    {
      left: `${sourceRect.left + sourceRect.width / 2}px`,
      top: `${sourceRect.top + sourceRect.height / 2}px`,
      width: `${startSize}px`,
      height: `${startSize}px`,
      opacity: 1,
      transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
    },
    {
      left: `${targetRect.left + targetRect.width / 2}px`,
      top: `${targetRect.top + targetRect.height / 2}px`,
      width: `${endSize}px`,
      height: `${endSize}px`,
      opacity: 0.35,
      transform: 'translate(-50%, -50%) scale(.45) rotate(18deg)',
    },
  ], { duration: 680, easing: 'cubic-bezier(.22,.75,.25,1)', fill: 'forwards' });

  flight.onfinish = () => image.remove();
  flight.oncancel = () => image.remove();

  cartTarget.classList.remove('cart-flight-target--pulse');
  void cartTarget.offsetWidth;
  cartTarget.classList.add('cart-flight-target--pulse');
  window.setTimeout(() => cartTarget.classList.remove('cart-flight-target--pulse'), 650);
}
