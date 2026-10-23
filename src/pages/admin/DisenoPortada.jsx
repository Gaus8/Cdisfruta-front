import { tw } from '../../utils/tw.js';
import { useEffect, useRef, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaCloudUploadAlt, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import { useBlocker } from 'react-router-dom';
import { apiAxios } from '../../services/api/client';
import ConfirmModal from '../../components/ui/ConfirmModal';

const MAX_SLIDES = 12;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MIN_IMAGE_EDGE = 480;
const PLACEHOLDER = '/img/logo_cdisfruta.webp';
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'jfif', 'png', 'webp', 'gif', 'avif', 'bmp', 'tif', 'tiff', 'heic', 'heif'];
const IMAGE_MIMES = new Set([
  'image/jpeg', 'image/jpg', 'image/pjpeg',
  'image/png', 'image/webp', 'image/gif', 'image/avif',
  'image/bmp', 'image/x-ms-bmp',
  'image/tiff', 'image/tif',
  'image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'
]);
const PREVIEWABLE_EXTENSIONS = new Set(['jpg', 'jpeg', 'jfif', 'png', 'webp', 'gif', 'avif', 'bmp']);
const imageExtension = (file) => file.name.split('.').pop()?.toLowerCase() || '';
const isAcceptedImage = (file) => IMAGE_MIMES.has(file.type) || IMAGE_EXTENSIONS.includes(imageExtension(file));

const initialSlides = [
  { eyebrow: 'Presencia internacional', etiqueta: 'Presencia internacional', titulo: 'CDISFRUTA en Australia', desc: 'Nuestras aromáticas llegando a nuevos destinos. Sabor colombiano presente en Melbourne.', tag: 'Australia · Melbourne', detalle: 'Nuestra expansión internacional comenzó con el sueño de llevar el sabor de Ubaté al mundo. Hoy, nuestras infusiones se disfrutan en Melbourne por diversas familias, destacando por su origen natural y procesos artesanales.', img: '/img/cdisfruta_01.webp', iconKey: 'globe' },
  { eyebrow: 'Producto destacado', etiqueta: 'Producto destacado', titulo: 'Aromáticas frutales', desc: 'Infusiones naturales elaboradas con frutas seleccionadas, que brindan sabor, frescura y bienestar en cada taza.', tag: '100% Natural', detalle: 'Seleccionamos cada fruta en su punto exacto de maduración. Nuestro proceso de deshidratado lento conserva todas las propiedades vitamínicas y el aroma intenso que nos caracteriza.', img: '/img/cdisfruta_02.webp', iconKey: 'leaf' },
  { eyebrow: 'Nuestra tierra', etiqueta: 'Nuestra tierra', titulo: 'Tradición de Ubaté', desc: 'Reflejamos la riqueza de nuestra tierra en cada mezcla, con frutas y hierbas cuidadosamente seleccionadas.', tag: 'Ubaté · Cundinamarca', detalle: 'CDISFRUTA nace en el corazón de la provincia de Ubaté. Trabajamos de la mano con productores locales, asegurando frescura y apoyando el crecimiento de nuestra comunidad campesina.', img: '/img/cdisfruta_07.webp', iconKey: 'location' }
];

const fieldLimits = { eyebrow: 32, etiqueta: 26, titulo: 64, desc: 180, tag: 28, detalle: 500 };
const slideKey = (slide) => slide._id || slide.clientKey;
const createClientKey = () => `nueva-${crypto.randomUUID()}`;

const cleanSlides = (slides) => slides.map((slide) => ({
  _id: slide._id,
  clientKey: slide.clientKey || slide._id || createClientKey(),
  eyebrow: slide.eyebrow || '',
  etiqueta: slide.etiqueta || slide.eyebrow || '',
  titulo: slide.titulo || '',
  desc: slide.desc || '',
  tag: slide.tag || '',
  detalle: slide.detalle || '',
  img: slide.img || '',
  iconKey: slide.iconKey || 'leaf'
}));

const makeSnapshot = (slides) => JSON.stringify(slides.map(({ _id, eyebrow, etiqueta, titulo, desc, tag, detalle, img, iconKey }) => ({ _id, eyebrow, etiqueta, titulo, desc, tag, detalle, img, iconKey })));

const emptySlide = () => ({
  clientKey: createClientKey(),
  eyebrow: '',
  etiqueta: '',
  titulo: '',
  desc: '',
  tag: '',
  detalle: '',
  img: '',
  iconKey: 'leaf'
});

export default function DisenoPortada() {
  const [slides, setSlides] = useState(initialSlides);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const refs = useRef({});
  const isDirty = savedSnapshot !== null && (makeSnapshot(slides) !== savedSnapshot || Object.keys(files).length > 0);
  const blocker = useBlocker(isDirty);

  useEffect(() => {
    apiAxios.get('/portada').then(({ data }) => {
      const loaded = Array.isArray(data) && data.length > 0 ? cleanSlides(data) : cleanSlides(initialSlides);
      setSlides(loaded);
      setSavedSnapshot(makeSnapshot(loaded));
    }).catch(() => {
      const fallback = cleanSlides(initialSlides);
      setSlides(fallback);
      setSavedSnapshot(makeSnapshot(fallback));
      setMessage({ type: 'error', text: 'No fue posible cargar la portada. Se muestran los textos predeterminados.' });
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isDirty) return undefined;
    const warnBeforeUnload = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [isDirty]);

  const changeField = (key, field, value) => setSlides((current) => current.map((slide) => slideKey(slide) === key ? { ...slide, [field]: value } : slide));

  const selectImage = async (key, file) => {
    if (!file) return;
    if (!isAcceptedImage(file)) {
      setMessage({ type: 'error', text: 'Usa JPG, PNG, WebP, GIF, AVIF, BMP, TIFF o HEIC.' });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage({ type: 'error', text: 'La imagen supera el máximo permitido de 8 MB.' });
      return;
    }
    const extension = imageExtension(file);
    const preview = URL.createObjectURL(file);
    let previewSrc = preview;
    if (PREVIEWABLE_EXTENSIONS.has(extension) || file.type.startsWith('image/')) {
      try {
        const dimensions = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
          image.onerror = () => reject(new Error('preview'));
          image.src = preview;
        });
        if (Math.max(dimensions.width, dimensions.height) < MIN_IMAGE_EDGE) {
          URL.revokeObjectURL(preview);
          setMessage({ type: 'error', text: 'La imagen es muy pequeña. Usa una foto de al menos 480 px en su lado más largo.' });
          return;
        }
      } catch {
        if (PREVIEWABLE_EXTENSIONS.has(extension)) {
          URL.revokeObjectURL(preview);
          setMessage({ type: 'error', text: 'No se pudo leer la imagen. Prueba con JPG, PNG, WebP, GIF o AVIF.' });
          return;
        }
        URL.revokeObjectURL(preview);
        previewSrc = '';
      }
    } else {
      URL.revokeObjectURL(preview);
      previewSrc = '';
    }
    setSlides((current) => current.map((slide) => {
      if (slideKey(slide) !== key) return slide;
      if (slide.img?.startsWith('blob:')) URL.revokeObjectURL(slide.img);
      return { ...slide, img: previewSrc || PLACEHOLDER };
    }));
    setFiles((current) => ({ ...current, [key]: file }));
    setMessage(previewSrc ? null : { type: 'success', text: 'Imagen lista. Este formato no tiene vista previa aquí; se verá en el inicio al guardar.' });
  };

  const addSlide = () => {
    if (slides.length >= MAX_SLIDES) {
      setMessage({ type: 'error', text: `Puedes publicar hasta ${MAX_SLIDES} diapositivas.` });
      return;
    }
    const slide = emptySlide();
    setSlides((current) => [...current, slide]);
    setMessage(null);
    window.requestAnimationFrame(() => {
      document.getElementById(`portada-${slide.clientKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const moveSlide = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    setSlides((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setSlides((current) => {
      const removed = current.find((slide) => slideKey(slide) === pendingDelete);
      if (removed?.img?.startsWith('blob:')) URL.revokeObjectURL(removed.img);
      return current.filter((slide) => slideKey(slide) !== pendingDelete);
    });
    setFiles((current) => {
      const next = { ...current };
      delete next[pendingDelete];
      return next;
    });
    setPendingDelete(null);
    setMessage(null);
  };

  const save = async (event) => {
    event.preventDefault();
    const missingImage = slides.findIndex((slide) => !slide.img && !files[slideKey(slide)]);
    if (missingImage >= 0) {
      setMessage({ type: 'error', text: `Agrega una imagen a la diapositiva ${missingImage + 1}.` });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const form = new FormData();
      const payload = slides.map((slide) => ({
        ...(slide._id ? { _id: slide._id } : {}),
        eyebrow: slide.eyebrow,
        etiqueta: slide.etiqueta || slide.eyebrow,
        titulo: slide.titulo,
        desc: slide.desc,
        tag: slide.tag,
        detalle: slide.detalle,
        img: slide.img?.startsWith('blob:') ? '' : slide.img,
        iconKey: slide.iconKey || 'leaf'
      }));
      form.append('slides', JSON.stringify(payload));
      slides.forEach((slide, index) => {
        const file = files[slideKey(slide)];
        if (file) form.append(`imagen_${index}`, file);
      });
      const { data } = await apiAxios.put('/admin/portada', form);
      const saved = cleanSlides(data);
      slides.forEach((slide) => { if (slide.img?.startsWith('blob:')) URL.revokeObjectURL(slide.img); });
      setSlides(saved);
      setFiles({});
      setSavedSnapshot(makeSnapshot(saved));
      setMessage({ type: 'success', text: 'La portada se actualizó correctamente.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'No se pudo guardar la portada. Inténtalo de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={tw("cover-editor-loading")}>Cargando contenido de portada…</div>;

  return (
    <form className={tw("cover-editor")} onSubmit={save}>
      <header className={tw("cover-editor-header", "flex-wrap")}>
        <div>
          <span className={tw("cover-editor-kicker")}>Experiencia de marca</span>
          <h1>Diseño de portada</h1>
          <p>Agrega, edita, ordena o elimina las imágenes del carrusel principal. El inicio muestra las diapositivas en este mismo orden.</p>
        </div>
        <button type="button" onClick={addSlide} disabled={slides.length >= MAX_SLIDES} className={tw('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ffd8cc] bg-white px-4 font-bold text-[#e06d43] transition hover:bg-[#fff5f1] disabled:cursor-not-allowed disabled:opacity-50')}>
          <FaPlus /> Agregar diapositiva
        </button>
      </header>
      <div className={tw("cover-guidance")}><strong>Guía de imágenes</strong><span>JPG, PNG, WebP, GIF, AVIF, BMP, TIFF o HEIC · Máximo 8 MB · Al menos 480 px en el lado más largo · Recomendado 1200 px o más · Hasta {MAX_SLIDES} diapositivas.</span></div>
      {message && <div className={tw(`cover-feedback ${message.type}`)} role="status">{message.text}</div>}
      <div className={tw("cover-slide-list")}>
        {slides.map((slide, index) => {
          const key = slideKey(slide);
          return (
            <section className={tw("cover-slide-card")} key={key} id={`portada-${key}`}>
              <div className={tw("cover-slide-heading", "flex-wrap")}>
                <span className={tw("cover-slide-number")}>{String(index + 1).padStart(2, '0')}</span>
                <div><h2>Diapositiva {index + 1}</h2><p>{index === 0 ? 'Esta es la primera imagen del carrusel.' : 'Este contenido aparece en el carrusel de inicio.'}</p></div>
                <div className={tw('ml-auto flex flex-wrap items-center gap-2')}>
                  <button type="button" aria-label={`Subir diapositiva ${index + 1}`} disabled={index === 0} onClick={() => moveSlide(index, -1)} className={tw('grid size-10 place-items-center rounded-lg border border-[#e4e9e3] bg-white text-[#526b56] transition hover:border-[#ff7e5f] hover:text-[#e06d43] disabled:cursor-not-allowed disabled:opacity-40')}><FaArrowUp /></button>
                  <button type="button" aria-label={`Bajar diapositiva ${index + 1}`} disabled={index === slides.length - 1} onClick={() => moveSlide(index, 1)} className={tw('grid size-10 place-items-center rounded-lg border border-[#e4e9e3] bg-white text-[#526b56] transition hover:border-[#ff7e5f] hover:text-[#e06d43] disabled:cursor-not-allowed disabled:opacity-40')}><FaArrowDown /></button>
                  <button type="button" aria-label={`Eliminar diapositiva ${index + 1}`} disabled={slides.length <= 1} onClick={() => setPendingDelete(key)} className={tw('inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#ffd8cc] bg-white px-3 font-bold text-[#a53c2e] transition hover:bg-[#fff0ed] disabled:cursor-not-allowed disabled:opacity-40')}><FaTrash /> Eliminar</button>
                </div>
              </div>
              <div className={tw("cover-slide-body")}>
                <div className={tw("cover-image-column")}>
                  <div className={tw("cover-image-preview")}><img src={slide.img || PLACEHOLDER} alt={slide.img ? `Vista previa diapositiva ${index + 1}` : `La diapositiva ${index + 1} todavía no tiene imagen`} /></div>
                  <input ref={(element) => { refs.current[key] = element; }} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,image/tiff,.jpg,.jpeg,.jfif,.png,.webp,.gif,.avif,.bmp,.tif,.tiff,.heic,.heif" hidden onChange={(event) => { selectImage(key, event.target.files?.[0]); event.target.value = ''; }} />
                  <button className={tw("cover-image-button")} type="button" onClick={() => refs.current[key]?.click()}><FaCloudUploadAlt /> {slide.img ? 'Cambiar imagen' : 'Elegir imagen'}</button>
                  <small>{slide.img ? 'La imagen se recorta para adaptarse a escritorio y móvil.' : 'Esta diapositiva necesita una imagen antes de guardar.'}</small>
                </div>
                <div className={tw("cover-fields")}>
                  <div className={tw('cover-field-group grid grid-cols-1 gap-3 rounded-xl border border-[#e6ece4] bg-[#fbfcfa] p-4 sm:grid-cols-2 [&>h3]:col-span-full [&>h3]:m-0 [&>h3]:text-base [&>h3]:text-[#344b37] [&>p]:col-span-full [&>p]:m-0 [&>p]:text-sm [&>p]:text-[#7d897e]')}>
                    <h3>Texto principal</h3>
                    <p>Aparece junto a la imagen en la página de inicio.</p>
                    {renderField(key, slide, 'eyebrow', 'Frase superior')}
                    {renderField(key, slide, 'titulo', 'Título principal')}
                    {renderField(key, slide, 'desc', 'Descripción breve')}
                  </div>
                  <details className={tw("cover-collapsible cover-overlay-group")}>
                    <summary><span><strong>Cuadro flotante sobre la imagen</strong><small>Editar sus dos textos breves</small></span><span className={tw("cover-expand-label")}>Desplegar</span></summary>
                    <div className={tw("cover-collapsible-content")}>
                      <p>Textos cortos para que la etiqueta conserve su tamaño en escritorio y móvil.</p>
                      {renderField(key, slide, 'etiqueta', 'Frase de la etiqueta')}
                      {renderField(key, slide, 'tag', 'Texto inferior del cuadro')}
                    </div>
                  </details>
                  <details className={tw("cover-collapsible cover-detail-group")}>
                    <summary><span><strong>Contenido de “Más información”</strong><small>Editar el texto que verá el cliente</small></span><span className={tw("cover-expand-label")}>Desplegar</span></summary>
                    <div className={tw("cover-collapsible-content")}>
                      <p>Este texto cambia junto con cada diapositiva y aparece al pulsar el botón.</p>
                      {renderField(key, slide, 'detalle', 'Descripción ampliada')}
                    </div>
                  </details>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <div className={tw("cover-editor-bottom")}><span>{slides.length} de {MAX_SLIDES} diapositivas. Los cambios se reflejan en la página principal después de guardar.</span></div>
      <div className={tw("cover-save-dock")}><span className={tw(isDirty ? 'pending' : 'saved')}>{saving ? 'Guardando cambios…' : isDirty ? 'Tienes cambios sin guardar' : 'Todos los cambios están guardados'}</span><button className={tw("cover-save-button")} type="submit" disabled={saving || !isDirty}><FaSave /> {saving ? 'Guardando…' : 'Guardar cambios'}</button></div>
      {blocker.state === 'blocked' && <div className={tw("cover-unsaved-overlay")} role="presentation"><section className={tw("cover-unsaved-modal")} role="dialog" aria-modal="true" aria-labelledby="cover-unsaved-title"><span className={tw("cover-unsaved-icon")}>!</span><h2 id="cover-unsaved-title">Tienes cambios sin guardar</h2><p>Si sales ahora, las modificaciones de la portada se perderán.</p><div><button type="button" className={tw("cover-stay-button")} onClick={() => blocker.reset()}>Seguir editando</button><button type="button" className={tw("cover-discard-button")} onClick={() => blocker.proceed()}>Salir sin guardar</button></div></section></div>}
      <ConfirmModal open={Boolean(pendingDelete)} title="¿Eliminar esta diapositiva?" description="Desaparecerá del carrusel de inicio cuando guardes los cambios. Tiene que quedar al menos una diapositiva publicada." confirmLabel="Sí, eliminar" onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />
    </form>
  );

  function renderField(key, slide, field, label) {
    const multiline = ['desc', 'detalle'].includes(field);
    const limit = fieldLimits[field];
    return <label className={tw("cover-character-field")} key={field}>{label}{multiline ? <textarea required maxLength={limit} value={slide[field] || ''} onChange={(event) => changeField(key, field, event.target.value)} rows={field === 'detalle' ? 4 : 2} /> : <input required maxLength={limit} value={slide[field] || ''} onChange={(event) => changeField(key, field, event.target.value)} />}<small className={tw("cover-character-count")}>{(slide[field] || '').length}/{limit} caracteres</small></label>;
  }
}
