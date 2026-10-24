/** Formatos de imagen admitidos en toda la app (productos, portada, avatares). */
export const IMAGE_EXTENSIONS = [
  'jpg', 'jpeg', 'jfif', 'png', 'webp', 'gif', 'avif', 'bmp', 'tif', 'tiff', 'heic', 'heif',
];

export const IMAGE_MIME_TYPES = [
  'image/jpeg', 'image/jpg', 'image/pjpeg',
  'image/png', 'image/webp', 'image/gif', 'image/avif',
  'image/bmp', 'image/x-ms-bmp',
  'image/tiff', 'image/tif',
  'image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence',
];

/** Valor para el atributo `accept` de inputs file */
export const IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,image/tiff,.jpg,.jpeg,.jfif,.png,.webp,.gif,.avif,.bmp,.tif,.tiff,.heic,.heif';

/** Texto corto para hints de UI */
export const IMAGE_FORMATS_LABEL = 'JPG, PNG, WebP, GIF, AVIF, BMP, TIFF o HEIC';

export function isAllowedImageFile(file) {
  if (!file) return false;
  const mime = String(file.type || '').toLowerCase();
  if (mime && IMAGE_MIME_TYPES.includes(mime)) return true;
  const extension = String(file.name || '').split('.').pop()?.toLowerCase() || '';
  return IMAGE_EXTENSIONS.includes(extension);
}
