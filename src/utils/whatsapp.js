/** Número de contacto CDISFRUTA (formato internacional sin +). */
export const WHATSAPP_NUMBER = '573229683625';

export const whatsappUrl = (message = 'Hola CDISFRUTA, me gustaría recibir más información.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
