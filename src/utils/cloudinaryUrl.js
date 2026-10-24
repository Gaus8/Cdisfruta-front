/**
 * Inserta transformaciones de entrega en URLs de Cloudinary (sin re-subir).
 * Si la URL no es de Cloudinary, la devuelve sin cambios.
 */
export function cloudinaryUrl(url, { width, height, quality = 'auto', format = 'auto', crop = 'limit' } = {}) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;

  const transforms = [];
  if (width) transforms.push(`w_${Math.round(width)}`);
  if (height) transforms.push(`h_${Math.round(height)}`);
  if (crop) transforms.push(`c_${crop}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);
  if (!transforms.length) return url;

  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}
